"use client";
import { useState } from "react";

type T = { id: string; label: string; hint: string };

export default function StudioClient({ ready, tools }: { ready: boolean; tools: T[] }) {
  const [tool, setTool] = useState(tools[0].id);
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [msg, setMsg] = useState("");
  const t = tools.find((x) => x.id === tool)!;

  if (!ready) return <div className="adm-card">Claude isn&apos;t connected. Set <code>ANTHROPIC_API_KEY</code> on the server to use the Studio.</div>;

  async function run() {
    setBusy(true); setOut(""); setMsg("");
    const r = await fetch("/api/admin/studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, brief }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) setOut(d.text); else setMsg(d.error || "Failed");
    setBusy(false);
  }
  async function save() {
    const r = await fetch("/api/admin/studio/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tool, content: out }) });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? `Saved to workspace: ${d.path}` : d.error || "Could not save");
  }
  async function toCalendar() {
    const title = out.split("\n").find((l) => l.trim())?.replace(/^#+\s*/, "").slice(0, 120) || t.label;
    const date = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const r = await fetch("/api/admin/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, date, channel: ({ blog: "Blog", social: "LinkedIn", email: "Email" } as Record<string, string>)[tool] || "Other", body: out }) });
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
          <button className="adm-btn" disabled={busy || brief.trim().length < 3} onClick={run}>{busy ? "Generating…" : `Generate ${t.label.toLowerCase()}`}</button>
        </div>
      </div>
      {msg && <div className="adm-ok">{msg}</div>}
      {out && (
        <div className="adm-card adm-result">
          <div className="adm-result-top"><b>Claude</b>
            <span>
              <button className="adm-btn ghost" onClick={() => navigator.clipboard.writeText(out)}>Copy</button>
              <button className="adm-btn ghost" onClick={save}>Save to workspace</button>
              <button className="adm-btn ghost" onClick={toCalendar}>+ Calendar</button>
            </span>
          </div>
          <textarea className="adm-out" value={out} onChange={(e) => setOut(e.target.value)} rows={20} />
        </div>
      )}
    </>
  );
}
