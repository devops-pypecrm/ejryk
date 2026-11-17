"use client";
import { useState } from "react";

type Check = { ok: boolean; label: string; detail: string };

export default function ToolsClient({ notifyOn, ga, clarity }: { notifyOn: boolean; ga: boolean; clarity: boolean }) {
  const [u, setU] = useState({ url: "https://zenitzu.com/contact", source: "linkedin", medium: "social", campaign: "launch" });
  const q = new URLSearchParams({ utm_source: u.source, utm_medium: u.medium, utm_campaign: u.campaign });
  let link = "";
  try { const x = new URL(u.url); q.forEach((v, k) => v && x.searchParams.set(k, v)); link = x.toString(); } catch { link = ""; }

  const [path, setPath] = useState("/");
  const [seo, setSeo] = useState<{ url: string; score: number; checks: Check[] } | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function scan() {
    setBusy(true); setErr(""); setSeo(null);
    const r = await fetch("/api/admin/seo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) setSeo(d); else setErr(d.error || "Failed");
    setBusy(false);
  }
  const dot = (on: boolean) => <span className={`adm-dot ${on ? "on" : ""}`} />;

  return (
    <>
      <h2 className="adm-h2">SEO page checker</h2>
      <div className="adm-card">
        <div className="adm-inline"><input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/services/web-development" /><button className="adm-btn" disabled={busy} onClick={scan}>{busy ? "Checking…" : "Check page"}</button></div>
        {err && <div className="adm-err" style={{ marginTop: 12 }}>{err}</div>}
        {seo && (
          <>
            <div className="adm-score"><b className={seo.score >= 80 ? "good" : seo.score >= 50 ? "mid" : "bad"}>{seo.score}</b><span>/100 for {seo.url}</span></div>
            {seo.checks.map((c) => <div key={c.label} className="adm-check">{dot(c.ok)}<b>{c.label}</b><span>{c.detail}</span></div>)}
          </>
        )}
      </div>

      <h2 className="adm-h2">Campaign link builder (UTM)</h2>
      <div className="adm-card">
        <div className="adm-utm">
          <label>Page URL<input value={u.url} onChange={(e) => setU({ ...u, url: e.target.value })} /></label>
          <label>Source<input value={u.source} onChange={(e) => setU({ ...u, source: e.target.value })} /></label>
          <label>Medium<input value={u.medium} onChange={(e) => setU({ ...u, medium: e.target.value })} /></label>
          <label>Campaign<input value={u.campaign} onChange={(e) => setU({ ...u, campaign: e.target.value })} /></label>
        </div>
        <div className="adm-inline" style={{ marginTop: 12 }}>
          <input readOnly value={link || "Enter a full URL starting with https://"} />
          <button className="adm-btn" disabled={!link} onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </div>

      <h2 className="adm-h2">Automation status</h2>
      <div className="adm-card">
        <div className="adm-check">{dot(true)}<b>New lead → follow-up task</b><span>Always on: every enquiry creates a high-priority task.</span></div>
        <div className="adm-check">{dot(notifyOn)}<b>Instant lead alerts</b><span>{notifyOn ? "Telegram / Discord / webhook is connected." : "Off. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, or DISCORD_WEBHOOK_URL, or NOTIFY_WEBHOOK_URL."}</span></div>
        <div className="adm-check">{dot(ga)}<b>Google Analytics 4</b><span>{ga ? "Tracking is live." : "Off. Set NEXT_PUBLIC_GA_ID (free)."}</span></div>
        <div className="adm-check">{dot(clarity)}<b>Microsoft Clarity</b><span>{clarity ? "Heatmaps and recordings are live." : "Off. Set NEXT_PUBLIC_CLARITY_ID (free heatmaps and session recordings)."}</span></div>
        <div className="adm-check">{dot(true)}<b>sitemap.xml and robots.txt</b><span>Generated automatically. <a href="/sitemap.xml" target="_blank">Open sitemap</a> and submit it in Google Search Console.</span></div>
      </div>
    </>
  );
}
