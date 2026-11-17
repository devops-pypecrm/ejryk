"use client";
import { useCallback, useEffect, useState } from "react";

type Field = { key: string; label: string; type: string; def: string; min?: number; max?: number };
type W = { id: string; name: string; desc: string; trigger: string; hasSchedule: boolean; fields: Field[]; enabled: boolean; params: Record<string, string>; lastRun?: string; lastOk?: boolean; lastMessage?: string };
type Data = { claude: boolean; days: string[]; workflows: W[]; logs: { id: string; at: string; workflow: string; ok: boolean; message: string }[] };
const J = { "Content-Type": "application/json" };

function Card({ w, data, reload }: { w: W; data: Data; reload: () => void }) {
  const [p, setP] = useState(w.params);
  const [on, setOn] = useState(w.enabled);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const dirty = on !== w.enabled || JSON.stringify(p) !== JSON.stringify(w.params);
  const set = (k: string, v: string) => setP((x) => ({ ...x, [k]: v }));

  async function save(enabled = on) {
    setBusy(true);
    const r = await fetch("/api/admin/automation", { method: "PUT", headers: J, body: JSON.stringify({ id: w.id, enabled, params: p }) });
    setMsg(r.ok ? "Saved." : "Could not save."); setBusy(false); if (r.ok) reload();
  }
  async function run() {
    setBusy(true); setMsg("Running…");
    const r = await fetch("/api/admin/automation", { method: "POST", headers: J, body: JSON.stringify({ id: w.id }) });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? `${d.ok ? "Done" : "Problem"}: ${d.message}` : d.error || "Failed"); setBusy(false); reload();
  }

  return (
    <article className={`adm-card adm-wf ${on ? "on" : ""}`}>
      <div className="adm-wf-top">
        <div><strong>{w.name}</strong><span className="adm-chan">{w.trigger === "new_lead" ? "When a lead arrives" : p.every === "weekly" ? "Weekly" : "Daily"}</span></div>
        <label className="adm-switch"><input type="checkbox" checked={on} onChange={(e) => { setOn(e.target.checked); }} /><span>{on ? "On" : "Off"}</span></label>
      </div>
      <p>{w.desc}</p>
      <div className="adm-wf-fields">
        {w.fields.map((f) => (
          <label key={f.key}>{f.label}
            <input type={f.type === "number" ? "number" : "text"} min={f.min} max={f.max} value={p[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
          </label>
        ))}
        {w.hasSchedule && (
          <>
            <label>Repeat<select value={p.every} onChange={(e) => set("every", e.target.value)}><option value="daily">Every day</option><option value="weekly">Every week</option></select></label>
            {p.every === "weekly" && <label>On<select value={p.day} onChange={(e) => set("day", e.target.value)}>{data.days.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></label>}
            <label>At (IST hour, 0-23)<input type="number" min={0} max={23} value={p.hour} onChange={(e) => set("hour", e.target.value)} /></label>
          </>
        )}
      </div>
      <div className="adm-ai">
        <button className="adm-btn" disabled={busy || !dirty} onClick={() => save()}>Save</button>
        {w.hasSchedule && <button className="adm-btn ghost" disabled={busy} onClick={run}>Run now</button>}
        {msg && <small className="adm-wf-msg">{msg}</small>}
      </div>
      {w.lastRun && <small className="adm-wf-last"><span className={`adm-dot ${w.lastOk ? "on" : ""}`} /> Last run {new Date(w.lastRun).toLocaleString()}: {w.lastMessage}</small>}
    </article>
  );
}

export default function AutomationClient() {
  const [d, setD] = useState<Data | null>(null);
  const load = useCallback(() => { fetch("/api/admin/automation").then((r) => r.json()).then(setD).catch(() => undefined); }, []);
  useEffect(load, [load]);
  if (!d) return <p className="adm-empty">Loading…</p>;
  return (
    <>
      {!d.claude && <div className="adm-err">No Claude key is set, so the AI workflows can&apos;t run yet. Add <code>ANTHROPIC_API_KEY</code> on the server.</div>}
      <div className="adm-wf-grid">{d.workflows.map((w) => <Card key={w.id + JSON.stringify(w.params) + w.enabled} w={w} data={d} reload={load} />)}</div>
      <h2 className="adm-h2">Run log</h2>
      <div className="adm-card">
        {!d.logs.length && <p className="adm-empty">Nothing has run yet.</p>}
        {d.logs.map((l) => <div key={l.id} className="adm-check"><span className={`adm-dot ${l.ok ? "on" : ""}`} /><b>{l.workflow}</b><span>{new Date(l.at).toLocaleString()} · {l.message}</span></div>)}
      </div>
    </>
  );
}
