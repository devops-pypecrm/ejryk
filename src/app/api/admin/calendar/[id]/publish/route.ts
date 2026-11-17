import { NextRequest } from "next/server";
import { publishPlan } from "../../../../../../lib/publish";
import { json, limited, sameOrigin } from "../../../../../../lib/http";

// "Publish now" for one calendar item (the person pressing the button is the approval).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("publish", 20, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const { id } = await params;
  const r = await publishPlan(id);
  return json(r, r.ok ? 200 : 422);
}
