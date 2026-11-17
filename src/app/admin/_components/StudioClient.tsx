"use client";
import { useState } from "react";

type P = { id: string; label: string; model: string };
type T = { id: string; label: string; hint: string };
type R = { id: string; label: string; text?: string; error?: string };

export default function StudioClient({ providers, tools }: { providers: P[]; tools: T[] }) {
  const [tool, setTool] = useState(tools[0].id);
  const [bot, setBot] = useState(providers.length > 1 ? "both" : providers[0]?.id || "");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<R[]>([]);
  const [msg, setMsg] = useState("");
  const t = tools.find((x) => x.id === tool)!;

  if (!providers.length) return <div className="adm-card">Set <code>GEMINI_API_KEY</code> and/or <code>XAI_API_KEY</code> on the server to use the Studio.</div>;

  async function run() {
    setBusy(true); setRes([]); setMsg("");
    const r = await fetch("/api/admin/studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, brief, provider: bot }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) setRes(d.results); else setMsg(d.error || "Failed");
    setBusy(false);
  }
  async function save(x: R) {
    const r = await fetch("/api/admin/studio/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, content: x.text, by: x.id }) });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? `Saved to workspace: ${d.path}` : d.error || "Could not save");
  }
  async function toCalendar(x: R) {
    const title = (x.text || "").split("\n").find((l) => l.trim())?.replace(/^#+\s*/, "").slice(0, 120) || t.label;
    const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const r = await fetch("/api/admin/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, date, channel: t.label, body: x.text }) });
    setMsg(r.ok ? "Added to the content calendar (tomorrow). Adjust the date there." : "Could not add");
  }

  return (
    <>
      <div className="adm-tabs">{tools.map((x) => <button key={x.id} className={tool === x.id ? "on" : ""} onClick={() => setTool(x.id)}>{x.label}</button>)}</div>
      <div className="adm-card">
        <label>Brief <small style={{ fontWeight: 400, color: "#777" }}>{t.hint}</small>
          <textarea rows={5} value={brief} onChange={(e) => setBrief(e.target.value)} maxLength={4000} placeholder="Be specific: audience, offer, tone, keyword…" />
        </label>
        <div className="adm-studio-run">
          <label>Run on
            <select value={bot} onChange={(e) => setBot(e.target.value)}>
              {providers.length > 1 && <option value="both">Both bots, side by side</option>}
              {providers.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <button className="adm-btn" disabled={busy || brief.trim().length < 3} onClick={run}>{busy ? "Generating…" : `Generate ${t.label.toLowerCase()}`}</button>
        </div>
      </div>
      {msg && <div className="adm-ok">{msg}</div>}
      <div className={`adm-results n${res.length}`}>
        {res.map((x) => (
          <div className="adm-card adm-result" key={x.id}>
            <div className="adm-result-top"><b>{x.label}</b>
              {x.text && <span>
                <button className="adm-btn ghost" onClick={() => navigator.clipboard.writeText(x.text!)}>Copy</button>
                <button className="adm-btn ghost" onClick={() => save(x)}>Save to workspace</button>
                <button className="adm-btn ghost" onClick={() => toCalendar(x)}>+ Calendar</button>
              </span>}
            </div>
            {x.error ? <div className="adm-err">{x.error}</div> : <textarea className="adm-out" defaultValue={x.text} rows={18} />}
          </div>
        ))}
      </div>
    </>
  );
}
