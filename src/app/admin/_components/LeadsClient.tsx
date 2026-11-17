"use client";
import { useState } from "react";
import type { Lead, LeadStatus } from "../../../lib/store";

const STATUSES: LeadStatus[] = ["new", "contacted", "won", "lost"];

export default function LeadsClient({ initial, ai: aiReady }: { initial: Lead[]; ai: boolean }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [err, setErr] = useState("");
  const [draft, setDraft] = useState<Record<string, { text: string; busy: boolean }>>({});

  async function patch(id: string, body: object) {
    const r = await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) { setErr("Could not save. Are you still signed in?"); return; }
    setErr(""); const row = await r.json(); setRows((p) => p.map((x) => (x.id === id ? row : x)));
  }
  async function del(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const r = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (r.ok) setRows((p) => p.filter((x) => x.id !== id)); else setErr("Could not delete.");
  }
  async function ai(x: Lead) {
    setDraft((d) => ({ ...d, [x.id]: { text: "", busy: true } }));
    const r = await fetch(`/api/admin/leads/${x.id}/draft`, { method: "POST", headers: { "Content-Type": "application/json" } });
    const d = await r.json().catch(() => ({}));
    setDraft((m) => ({ ...m, [x.id]: { text: r.ok ? d.draft : `⚠ ${d.error || "Failed"}`, busy: false } }));
  }
  const shown = rows.filter((x) => filter === "all" || x.status === filter);

  return (
    <>
      <div className="adm-tabs">
        {(["all", ...STATUSES] as const).map((s) => (
          <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}>{s} <i>{s === "all" ? rows.length : rows.filter((x) => x.status === s).length}</i></button>
        ))}
      </div>
      <div className="adm-toolbar"><a className="adm-btn ghost" href="/api/admin/leads/export">Download CSV</a></div>
      {err && <div className="adm-err">{err}</div>}
      {!shown.length && <div className="adm-card"><p className="adm-empty">Nothing here yet.</p></div>}
      {shown.map((x) => (
        <article className="adm-card adm-lead" key={x.id}>
          <div className="adm-lead-top">
            <div><strong>{x.name}</strong> <time>{new Date(x.createdAt).toLocaleString()}</time></div>
            <select value={x.status} onChange={(e) => patch(x.id, { status: e.target.value })} className={`pill ${x.status}`}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div className="adm-contact"><a href={`mailto:${x.email}`}>{x.email}</a>{x.phone && <a href={`tel:${x.phone}`}>{x.phone}</a>}{x.phone && <a href={`https://wa.me/${x.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</div>
          <p className="adm-msg">{x.message}</p>
          <textarea key={x.notes} defaultValue={x.notes} placeholder="Private notes…" onBlur={(e) => e.target.value !== x.notes && patch(x.id, { notes: e.target.value })} />
          <div className="adm-ai">
            {aiReady && <button className="adm-btn ghost" disabled={draft[x.id]?.busy} onClick={() => ai(x)}>✨ Draft reply with Claude</button>}
            <button className="adm-btn ghost danger" onClick={() => del(x.id)}>Delete</button>
          </div>
          {draft[x.id] && (
            <div className="adm-draft">
              {draft[x.id].busy ? <p className="adm-empty">Drafting…</p> : (
                <>
                  <textarea rows={7} value={draft[x.id].text} onChange={(e) => setDraft((m) => ({ ...m, [x.id]: { ...m[x.id], text: e.target.value } }))} />
                  <div className="adm-ai">
                    <button className="adm-btn ghost" onClick={() => navigator.clipboard.writeText(draft[x.id].text)}>Copy</button>
                    <a className="adm-btn ghost" href={`mailto:${x.email}?subject=${encodeURIComponent("Re: your enquiry to Zenitzu")}&body=${encodeURIComponent(draft[x.id].text)}`}>Open in email</a>
                    {x.phone && <a className="adm-btn ghost" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${x.phone.replace(/\D/g, "")}?text=${encodeURIComponent(draft[x.id].text)}`}>Send on WhatsApp</a>}
                    <button className="adm-btn ghost" onClick={() => patch(x.id, { status: "contacted" })}>Mark contacted</button>
                  </div>
                </>
              )}
            </div>
          )}
        </article>
      ))}
    </>
  );
}
