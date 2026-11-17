import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Small JSON-file store (one file per collection). It needs a server with a persistent disk (VPS, Docker volume).
// On serverless hosts (Vercel etc.) swap these few functions for a real database; nothing else has to change.
const DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");

export type LeadStatus = "new" | "contacted" | "won" | "lost";
export interface Lead { id: string; createdAt: string; name: string; email: string; phone: string; message: string; status: LeadStatus; notes: string }
export type TaskStatus = "todo" | "doing" | "done";
export type Priority = "high" | "medium" | "low";
export interface Task { id: string; createdAt: string; title: string; details: string; priority: Priority; status: TaskStatus; assignee: string; output: string }

export type PlanStatus = "idea" | "draft" | "scheduled" | "posted";
export interface Plan { id: string; createdAt: string; date: string; channel: string; title: string; body: string; status: PlanStatus }

const file = (name: string) => path.join(DIR, `${name}.json`);
let chain: Promise<unknown> = Promise.resolve();

async function read<T>(name: string): Promise<T[]> {
  try { return JSON.parse(await fs.readFile(file(name), "utf8")) as T[]; } catch { return []; }
}

// Writes are serialised and atomic (write temp file, then rename) so concurrent requests can't corrupt the data.
function mutate<T, R>(name: string, fn: (rows: T[]) => R): Promise<R> {
  const run = chain.then(async () => {
    await fs.mkdir(DIR, { recursive: true });
    const rows = await read<T>(name);
    const out = fn(rows);
    const tmp = `${file(name)}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(rows, null, 2), "utf8");
    await fs.rename(tmp, file(name));
    return out;
  });
  chain = run.catch(() => undefined);
  return run;
}

export const newId = () => crypto.randomUUID();

export const leads = {
  list: async () => (await read<Lead>("leads")).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  add: (l: Omit<Lead, "id" | "createdAt" | "status" | "notes">) =>
    mutate<Lead, Lead>("leads", (rows) => { const row: Lead = { ...l, id: newId(), createdAt: new Date().toISOString(), status: "new", notes: "" }; rows.push(row); return row; }),
  update: (id: string, patch: Partial<Pick<Lead, "status" | "notes">>) =>
    mutate<Lead, Lead | null>("leads", (rows) => { const r = rows.find((x) => x.id === id); if (!r) return null; Object.assign(r, patch); return r; }),
  remove: (id: string) =>
    mutate<Lead, boolean>("leads", (rows) => { const i = rows.findIndex((x) => x.id === id); if (i < 0) return false; rows.splice(i, 1); return true; }),
};

export const tasks = {
  list: async () => (await read<Task>("tasks")).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  add: (t: Pick<Task, "title" | "details" | "priority" | "assignee">) =>
    mutate<Task, Task>("tasks", (rows) => { const row: Task = { ...t, id: newId(), createdAt: new Date().toISOString(), status: "todo", output: "" }; rows.push(row); return row; }),
  update: (id: string, patch: Partial<Pick<Task, "status" | "priority" | "output" | "title" | "details" | "assignee">>) =>
    mutate<Task, Task | null>("tasks", (rows) => { const r = rows.find((x) => x.id === id); if (!r) return null; Object.assign(r, patch); return r; }),
  remove: (id: string) =>
    mutate<Task, boolean>("tasks", (rows) => { const i = rows.findIndex((x) => x.id === id); if (i < 0) return false; rows.splice(i, 1); return true; }),
};

export const plans = {
  list: async () => (await read<Plan>("plans")).sort((a, b) => a.date.localeCompare(b.date)),
  add: (p: Pick<Plan, "date" | "channel" | "title" | "body">) =>
    mutate<Plan, Plan>("plans", (rows) => { const row: Plan = { ...p, id: newId(), createdAt: new Date().toISOString(), status: "idea" }; rows.push(row); return row; }),
  update: (id: string, patch: Partial<Pick<Plan, "date" | "channel" | "title" | "body" | "status">>) =>
    mutate<Plan, Plan | null>("plans", (rows) => { const r = rows.find((x) => x.id === id); if (!r) return null; Object.assign(r, patch); return r; }),
  remove: (id: string) =>
    mutate<Plan, boolean>("plans", (rows) => { const i = rows.findIndex((x) => x.id === id); if (i < 0) return false; rows.splice(i, 1); return true; }),
};
