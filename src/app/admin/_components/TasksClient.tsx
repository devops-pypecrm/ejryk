"use client";
import { useState } from "react";
import type { Task, TaskStatus, Priority } from "../../../lib/store";

const COLS: { key: TaskStatus; label: string }[] = [{ key: "todo", label: "To do" }, { key: "doing", label: "In progress" }, { key: "done", label: "Done" }];
const ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export default function TasksClient({ initial }: { initial: Task[] }) {
  const [rows, setRows] = useState(initial);
  const [err, setErr] = useState("");

  async function patch(id: string, body: object) {
    const r = await fetch(`/api/admin/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) { setErr("Could not save. Are you still signed in?"); return; }
    setErr(""); const row = await r.json(); setRows((p) => p.map((x) => (x.id === id ? row : x)));
  }
  async function del(id: string) {
    if (!confirm("Delete this task?")) return;
    const r = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
    if (r.ok) setRows((p) => p.filter((x) => x.id !== id)); else setErr("Could not delete.");
  }
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form);
    const r = await fetch("/api/admin/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    if (!r.ok) { setErr("Could not add the task."); return; }
    setErr(""); const row = await r.json(); setRows((p) => [row, ...p]); form.reset();
  }

  return (
    <>
      <form className="adm-card adm-newtask" onSubmit={add}>
        <input name="title" placeholder="New task title" required maxLength={200} />
        <input name="assignee" placeholder="Assignee / agent" maxLength={80} />
        <select name="priority" defaultValue="medium"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
        <textarea name="details" placeholder="Details (optional)" />
        <button className="adm-btn">Add task</button>
      </form>
      {err && <div className="adm-err">{err}</div>}
      <div className="adm-board">
        {COLS.map((c, ci) => {
          const items = rows.filter((x) => x.status === c.key).sort((a, b) => ORDER[a.priority] - ORDER[b.priority]);
          return (
            <section key={c.key} className="adm-col">
              <h3>{c.label} <i>{items.length}</i></h3>
              {items.map((x) => (
                <article key={x.id} className="adm-task">
                  <div className="adm-task-top"><span className={`pill ${x.priority}`}>{x.priority}</span>{x.assignee && <small>{x.assignee}</small>}</div>
                  <strong>{x.title}</strong>
                  {x.details && <p>{x.details}</p>}
                  {x.status === "done" && <input key={x.output} defaultValue={x.output} placeholder="Output link or file path" onBlur={(e) => e.target.value !== x.output && patch(x.id, { output: e.target.value })} />}
                  <div className="adm-task-act">
                    {ci > 0 && <button className="adm-btn ghost" onClick={() => patch(x.id, { status: COLS[ci - 1].key })}>←</button>}
                    {ci < 2 && <button className="adm-btn ghost" onClick={() => patch(x.id, { status: COLS[ci + 1].key })}>{ci === 0 ? "Start →" : "Done →"}</button>}
                    <button className="adm-btn ghost danger" onClick={() => del(x.id)}>✕</button>
                  </div>
                </article>
              ))}
              {!items.length && <p className="adm-empty">Empty</p>}
            </section>
          );
        })}
      </div>
    </>
  );
}
