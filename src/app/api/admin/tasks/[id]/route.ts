import { NextRequest } from "next/server";
import { tasks, Priority, TaskStatus } from "../../../../../lib/store";
import { json, sameOrigin, str } from "../../../../../lib/http";

const STATUSES: TaskStatus[] = ["todo", "doing", "done"];
const PRIORITIES: Priority[] = ["high", "medium", "low"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, string> = {};
  if (STATUSES.includes(b.status)) patch.status = b.status;
  if (PRIORITIES.includes(b.priority)) patch.priority = b.priority;
  if (typeof b.output === "string") patch.output = str(b.output, 2000);
  if (typeof b.assignee === "string") patch.assignee = str(b.assignee, 80);
  if (typeof b.details === "string") patch.details = str(b.details, 4000);
  if (typeof b.title === "string" && str(b.title, 200)) patch.title = str(b.title, 200);
  const row = await tasks.update(id, patch);
  return row ? json(row) : json({ error: "Not found" }, 404);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  return (await tasks.remove(id)) ? json({ ok: true }) : json({ error: "Not found" }, 404);
}
