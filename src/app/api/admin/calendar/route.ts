import { NextRequest } from "next/server";
import { plans } from "../../../../lib/store";
import { json, sameOrigin, str } from "../../../../lib/http";

export async function GET() { return json(await plans.list()); }

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const b = await req.json().catch(() => ({}));
  const title = str(b.title, 200), date = str(b.date, 10);
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "A title and a date are required." }, 400);
  return json(await plans.add({ title, date, channel: str(b.channel, 40) || "Blog", body: str(b.body, 20000) }), 201);
}
