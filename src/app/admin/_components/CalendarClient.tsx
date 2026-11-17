"use client";
import { useState } from "react";
import type { Plan, PlanStatus } from "../../../lib/store";

const STATUS: PlanStatus[] = ["idea", "draft", "scheduled", "posted"];
const CHANNELS = ["Blog", "LinkedIn", "Instagram", "X / Twitter", "Facebook", "Telegram", "Discord", "YouTube", "Email", "Other"];
type Chan = { channels: { id: string; label: string; ready: boolean; needs: string[] }[]; byName: Record<string, { ready: boolean; limit: number; via: string }> };
const today = () => new Date().toISOString().slice(0, 10);

export default function CalendarClient({ initial, chan }: { initial: Plan[]; chan: Chan }) {
  const [rows, setRows] = useState(initial);
  const [f, setF] = useState({ title: "", date: today(), channel: "Blog" });
  const [open, setOpen] = useState("");
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const call = async (url: string, method: string, body?: object) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await call("/api/admin/calendar", "POST", f);
    if (!r.ok) return setErr((await r.json().catch(() => ({}))).error || "Could not add");
    setErr(""); const row = await r.json(); setRows((p) => [...p, row].sort((a, b) => a.date.localeCompare(b.date))); setF({ ...f, title: "" });
  }
  async function patch(id: string, body: object) {
    const r = await call(`/api/admin/calendar/${id}`, "PATCH", body);
    if (r.ok) { const row = await r.json(); setRows((p) => p.map((x) => (x.id === id ? row : x)).sort((a, b) => a.date.localeCompare(b.date))); }
  }
  async function publish(x: Plan) {
    if (!confirm(`Publish "${x.title}" to ${x.channel} now? This goes live on your real account.`)) return;
    setNote("Publishing…");
    const r = await call(`/api/admin/calendar/${x.id}/publish`, "POST");
    const d = await r.json().catch(() => ({}));
    setNote(d.message || d.error || "Done");
    const list = await (await call("/api/admin/calendar", "GET")).json();
    if (Array.isArray(list)) setRows(list);
  }
  async function del(id: string) {
    if (confirm("Remove this item?") && (await call(`/api/admin/calendar/${id}`, "DELETE")).ok) setRows((p) => p.filter((x) => x.id !== id));
  }

  const upcoming = rows.filter((x) => x.date >= today() || x.status !== "posted");
  return (
    <>
      <form className="adm-card adm-cal-add" onSubmit={add}>
        <input placeholder="Idea or post title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required maxLength={200} />
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} required />
        <select value={f.channel} onChange={(e) => setF({ ...f, channel: e.target.value })}>{CHANNELS.map((c) => <option key={c}>{c}</option>)}</select>
        <button className="adm-btn">Add</button>
      </form>
      <div className="adm-card adm-pub">
        <b>Publishing channels</b>
        {chan.channels.map((c) => <span key={c.id} title={c.ready ? "Connected" : `Needs: ${c.needs.join(", ")}`}><i className={`adm-dot ${c.ready ? "on" : ""}`} /> {c.label}</span>)}
        <small>Set an item to <b>scheduled</b> to approve it: the Auto-publisher (Automation page) posts it on its date. Blog, Instagram, YouTube, Email and Other go through the webhook if set, otherwise they stay manual.</small>
      </div>
      {note && <div className="adm-ok">{note}</div>}
      {err && <div className="adm-err">{err}</div>}
      {!rows.length && <div className="adm-card"><p className="adm-empty">Nothing planned. Add ideas here, or generate them in the Studio and press “+ Calendar”.</p></div>}
      {(upcoming.length ? upcoming : rows).map((x) => (
        <article key={x.id} className="adm-card adm-cal">
          <div className="adm-cal-row">
            <time className={x.date < today() && x.status !== "posted" ? "late" : ""}>{new Date(x.date + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })}</time>
            <span className="adm-chan">{x.channel}</span>
            <strong>{x.title}</strong>
            <select className={`pill ${x.status === "posted" ? "won" : x.status === "scheduled" ? "contacted" : x.status === "draft" ? "new" : ""}`} value={x.status} onChange={(e) => patch(x.id, { status: e.target.value })}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
            <input type="date" value={x.date} onChange={(e) => patch(x.id, { date: e.target.value })} aria-label="Date" />
            {x.status !== "posted" && chan.byName[x.channel]?.ready && <button className="adm-btn ghost" onClick={() => publish(x)}>Publish now</button>}
            {x.body && <button className="adm-btn ghost" onClick={() => setOpen(open === x.id ? "" : x.id)}>{open === x.id ? "Hide" : "Draft"}</button>}
            <button className="adm-btn ghost danger" onClick={() => del(x.id)}>×</button>
          </div>
          {(x.result || (x.status === "scheduled" && !chan.byName[x.channel]?.ready)) && (
            <small className={`adm-cal-note ${x.result?.startsWith("Failed") ? "bad" : ""}`}>
              {x.result || `${x.channel} isn't connected, so this one stays manual (copy it from Draft).`}
            </small>
          )}
          {open === x.id && <><textarea className="adm-out" rows={12} defaultValue={x.body} onBlur={(e) => e.target.value !== x.body && patch(x.id, { body: e.target.value })} />
            {chan.byName[x.channel]?.limit ? <small className="adm-cal-note">Limit for {x.channel}: {chan.byName[x.channel].limit.toLocaleString()} characters (currently {x.body.length.toLocaleString()}).</small> : null}</>}
        </article>
      ))}
    </>
  );
}
