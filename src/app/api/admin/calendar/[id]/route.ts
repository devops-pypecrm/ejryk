import { NextRequest } from "next/server";
import { plans, PlanStatus } from "../../../../../lib/store";
import { json, sameOrigin, str } from "../../../../../lib/http";

const STATUS: PlanStatus[] = ["idea", "draft", "scheduled", "posted"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch: Record<string, string> = {};
  if (STATUS.includes(b.status)) patch.status = b.status;
  if (typeof b.title === "string" && b.title.trim()) patch.title = str(b.title, 200);
  if (typeof b.body === "string") patch.body = str(b.body, 20000);
  if (typeof b.channel === "string") patch.channel = str(b.channel, 40);
  if (typeof b.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date)) patch.date = b.date;
  const row = await plans.update(id, patch);
  return row ? json(row) : json({ error: "Not found" }, 404);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const { id } = await params;
  return (await plans.remove(id)) ? json({ ok: true }) : json({ error: "Not found" }, 404);
}
