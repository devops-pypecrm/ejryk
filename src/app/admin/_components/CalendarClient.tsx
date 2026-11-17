"use client";
import { useState } from "react";
import type { Plan, PlanStatus } from "../../../lib/store";

const STATUS: PlanStatus[] = ["idea", "draft", "scheduled", "posted"];
const CHANNELS = ["Blog", "LinkedIn", "Instagram", "X / Twitter", "YouTube", "Email", "Other"];
const today = () => new Date().toISOString().slice(0, 10);

export default function CalendarClient({ initial }: { initial: Plan[] }) {
  const [rows, setRows] = useState(initial);
  const [f, setF] = useState({ title: "", date: today(), channel: "Blog" });
  const [open, setOpen] = useState("");
  const [err, setErr] = useState("");
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
            {x.body && <button className="adm-btn ghost" onClick={() => setOpen(open === x.id ? "" : x.id)}>{open === x.id ? "Hide" : "Draft"}</button>}
            <button className="adm-btn ghost danger" onClick={() => del(x.id)}>×</button>
          </div>
          {open === x.id && <textarea className="adm-out" rows={12} defaultValue={x.body} onBlur={(e) => e.target.value !== x.body && patch(x.id, { body: e.target.value })} />}
        </article>
      ))}
    </>
  );
}
