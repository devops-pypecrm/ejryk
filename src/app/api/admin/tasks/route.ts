import { NextRequest } from "next/server";
import { tasks, Priority } from "../../../../lib/store";
import { json, sameOrigin, str } from "../../../../lib/http";

const PRIORITIES: Priority[] = ["high", "medium", "low"];

export async function GET() { return json(await tasks.list()); }

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const b = await req.json().catch(() => ({}));
  const title = str(b.title, 200);
  if (!title) return json({ error: "Title is required" }, 400);
  const row = await tasks.add({ title, details: str(b.details, 4000), priority: PRIORITIES.includes(b.priority) ? b.priority : "medium", assignee: str(b.assignee, 80) });
  return json(row, 201);
}
