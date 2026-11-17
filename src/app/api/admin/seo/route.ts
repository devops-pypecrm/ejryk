import { NextRequest } from "next/server";
import { json, limited, sameOrigin, str } from "../../../../lib/http";

// SEO page checker. Only fetches pages of THIS site (a path like /services), never arbitrary URLs.
const strip = (h: string) => h.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;/g, " ").replace(/\s+/g, " ").trim();
const meta = (h: string, attr: string, val: string) => {
  const m = h.match(new RegExp(`<meta[^>]+${attr}=["']${val}["'][^>]*>`, "i"))?.[0];
  return m?.match(/content=["']([^"']*)["']/i)?.[1] ?? "";
};

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("seo", 40, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => ({}));
  const p = str(b.path, 300) || "/";
  if (!p.startsWith("/") || p.startsWith("//") || /[\s\\]/.test(p)) return json({ error: "Enter a path on this site, like /services/web-development" }, 400);
  const origin = process.env.SITE_URL || req.nextUrl.origin;
  let html = "";
  try {
    const r = await fetch(origin + p, { signal: AbortSignal.timeout(10000), redirect: "manual", cache: "no-store" });
    if (!r.ok) return json({ error: `Page returned ${r.status}` }, 422);
    html = await r.text();
  } catch { return json({ error: "Could not load that page." }, 422); }

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const desc = meta(html, "name", "description");
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/gi)].length;
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\balt=/i.test(i)).length; // alt="" is valid for decorative images
  const words = strip(html.replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, " ")).split(" ").filter(Boolean).length;
  const checks: { ok: boolean; label: string; detail: string }[] = [
    { ok: title.length >= 25 && title.length <= 62, label: "Title length", detail: `${title.length} characters (aim 25-60): ${title || "missing"}` },
    { ok: desc.length >= 70 && desc.length <= 160, label: "Meta description", detail: desc ? `${desc.length} characters (aim 70-155)` : "missing" },
    { ok: h1s === 1, label: "One H1", detail: `${h1s} found` },
    { ok: noAlt === 0, label: "Image alt text", detail: `${imgs.length} images, ${noAlt} missing an alt attribute` },
    { ok: /<link[^>]+rel=["']canonical["']/i.test(html), label: "Canonical link", detail: "tells search engines the preferred URL" },
    { ok: !!meta(html, "property", "og:title") && !!meta(html, "property", "og:image"), label: "Social share tags", detail: "og:title and og:image for link previews" },
    { ok: /<meta[^>]+name=["']viewport["']/i.test(html), label: "Mobile viewport", detail: "responsive meta tag" },
    { ok: /<html[^>]+lang=/i.test(html), label: "Language attribute", detail: "html lang set" },
    { ok: /application\/ld\+json/i.test(html), label: "Structured data (JSON-LD)", detail: "helps rich results and AI search" },
    { ok: words >= 250, label: "Content depth", detail: `about ${words} words of body text` },
  ];
  return json({ url: origin + p, score: Math.round((checks.filter((c) => c.ok).length / checks.length) * 100), checks });
}
