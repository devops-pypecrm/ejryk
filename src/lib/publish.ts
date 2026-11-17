import crypto from "crypto";
import { plans, Plan } from "./store";

// Post automation: publishes calendar items to your own accounts through each platform's official API.
// A channel is only "ready" when its credentials are set on the server. Nothing is posted unless a human
// has set the item to "scheduled" (approval) or presses "Publish now".
export type ChannelId = "x" | "linkedin" | "facebook" | "telegram" | "discord" | "webhook";
type Chan = { id: ChannelId; label: string; limit: number; env: string[]; send: (text: string, title: string, channel: string) => Promise<string> };

const e = (k: string) => process.env[k] || "";
async function call(url: string, init: RequestInit) {
  const r = await fetch(url, { ...init, signal: AbortSignal.timeout(20000), cache: "no-store" });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${t.replace(/\s+/g, " ").slice(0, 160)}`);
  return { r, t };
}
const pct = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

// X (Twitter) API v2 with long-lived OAuth 1.0a user keys. JSON bodies are not part of the signature.
function oauth1(method: string, url: string) {
  const p: Record<string, string> = { oauth_consumer_key: e("X_API_KEY"), oauth_nonce: crypto.randomBytes(12).toString("hex"), oauth_signature_method: "HMAC-SHA1", oauth_timestamp: String(Math.floor(Date.now() / 1000)), oauth_token: e("X_ACCESS_TOKEN"), oauth_version: "1.0" };
  const base = [method, pct(url), pct(Object.keys(p).sort().map((k) => `${pct(k)}=${pct(p[k])}`).join("&"))].join("&");
  p.oauth_signature = crypto.createHmac("sha1", `${pct(e("X_API_SECRET"))}&${pct(e("X_ACCESS_SECRET"))}`).update(base).digest("base64");
  return "OAuth " + Object.keys(p).sort().map((k) => `${pct(k)}="${pct(p[k])}"`).join(", ");
}

const CHANNELS: Chan[] = [
  { id: "x", label: "X / Twitter", limit: 280, env: ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"],
    async send(text) {
      const url = "https://api.twitter.com/2/tweets";
      const { t } = await call(url, { method: "POST", headers: { Authorization: oauth1("POST", url), "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const id = JSON.parse(t)?.data?.id; return id ? `https://x.com/i/status/${id}` : "posted";
    } },
  { id: "linkedin", label: "LinkedIn", limit: 3000, env: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_AUTHOR"],
    async send(text) {
      const { r } = await call("https://api.linkedin.com/v2/ugcPosts", { method: "POST", headers: { Authorization: `Bearer ${e("LINKEDIN_ACCESS_TOKEN")}`, "X-Restli-Protocol-Version": "2.0.0", "Content-Type": "application/json" },
        body: JSON.stringify({ author: e("LINKEDIN_AUTHOR"), lifecycleState: "PUBLISHED", specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text }, shareMediaCategory: "NONE" } }, visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" } }) });
      const id = r.headers.get("x-restli-id"); return id ? `https://www.linkedin.com/feed/update/${id}` : "posted";
    } },
  { id: "facebook", label: "Facebook Page", limit: 5000, env: ["FACEBOOK_PAGE_ID", "FACEBOOK_PAGE_TOKEN"],
    async send(text) {
      const { t } = await call(`https://graph.facebook.com/v21.0/${encodeURIComponent(e("FACEBOOK_PAGE_ID"))}/feed`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ message: text, access_token: e("FACEBOOK_PAGE_TOKEN") }) });
      return `facebook post ${JSON.parse(t)?.id ?? ""}`.trim();
    } },
  { id: "telegram", label: "Telegram channel", limit: 4096, env: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHANNEL_ID"],
    async send(text) {
      await call(`https://api.telegram.org/bot${e("TELEGRAM_BOT_TOKEN")}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: e("TELEGRAM_CHANNEL_ID"), text }) });
      return "posted to channel";
    } },
  { id: "discord", label: "Discord channel", limit: 2000, env: ["DISCORD_POST_WEBHOOK_URL"],
    async send(text) {
      await call(e("DISCORD_POST_WEBHOOK_URL"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text, allowed_mentions: { parse: [] } }) });
      return "posted to channel";
    } },
  { id: "webhook", label: "Zapier / Make / n8n (Instagram, Buffer, anything)", limit: 20000, env: ["PUBLISH_WEBHOOK_URL"],
    async send(text, title, channel) {
      await call(e("PUBLISH_WEBHOOK_URL"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel, title, text }) });
      return "sent to webhook";
    } },
];

const BY_NAME: Record<string, ChannelId> = { "X / Twitter": "x", LinkedIn: "linkedin", Facebook: "facebook", Telegram: "telegram", Discord: "discord" };
const ready = (c: Chan) => c.env.every((k) => !!e(k));
const chanFor = (name: string) => CHANNELS.find((c) => c.id === (BY_NAME[name] ?? "webhook"));

export const channelStatus = () => ({
  channels: CHANNELS.map((c) => ({ id: c.id, label: c.label, ready: ready(c), limit: c.limit, needs: c.env })),
  // calendar channel name -> { ready, limit } so the UI can show what will happen to each item
  byName: Object.fromEntries(["Blog", "LinkedIn", "Instagram", "X / Twitter", "Facebook", "Telegram", "Discord", "YouTube", "Email", "Other"].map((n) => {
    const c = chanFor(n); const direct = !!BY_NAME[n];
    return [n, { ready: !!c && ready(c), limit: c?.limit ?? 0, via: direct ? c!.label : "webhook" }];
  })),
});

// Plain text for platforms that don't render Markdown.
export const plain = (s: string) => s.replace(/^#{1,6}\s+/gm, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[-*]\s+/gm, "• ").trim();

const inflight = new Set<string>();

// Publish one calendar item. Refuses double posts, over-length text and channels without credentials.
export async function publishPlan(id: string): Promise<{ ok: boolean; message: string }> {
  if (inflight.has(id)) return { ok: false, message: "Already publishing." };
  inflight.add(id);
  try {
    const p = (await plans.list()).find((x) => x.id === id);
    if (!p) return { ok: false, message: "Not found." };
    if (p.status === "posted") return { ok: false, message: "Already posted." };
    const c = chanFor(p.channel);
    const fail = async (message: string): Promise<{ ok: boolean; message: string }> => {
      await plans.update(p.id, { result: `Failed: ${message}`, ...(p.status === "scheduled" ? { status: "draft" as const } : {}) });
      return { ok: false, message };
    };
    if (!c || !ready(c)) return fail(`${p.channel} is not connected. Add its credentials on the server (see .env.example).`);
    const text = plain(p.body || p.title);
    if (!text) return fail("Nothing to post.");
    if (text.length > c.limit) return fail(`Too long for ${c.label}: ${text.length} of ${c.limit} characters. Shorten it and try again.`);
    try {
      const where = await c.send(text, p.title, p.channel);
      await plans.update(p.id, { status: "posted", postedAt: new Date().toISOString(), result: `Posted via ${c.label}: ${where}` });
      return { ok: true, message: `Posted via ${c.label}.` };
    } catch (err) {
      console.error(`[publish] ${c.id}`, err);
      return fail(`${c.label} rejected the post (${err instanceof Error ? err.message.slice(0, 200) : "error"}).`);
    }
  } finally { inflight.delete(id); }
}

export type { Plan };
