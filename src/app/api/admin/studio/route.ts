import { NextRequest } from "next/server";
import { ask, configured } from "../../../../lib/chat";
import { TOOLS, systemFor, toolById } from "../../../../lib/studio";
import { json, limited, sameOrigin, str } from "../../../../lib/http";

export async function GET() {
  return json({ available: configured(), tools: TOOLS.map(({ id, label, hint }) => ({ id, label, hint })) });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("studio", 40, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => ({}));
  const tool = toolById(b.tool), brief = str(b.brief, 4000);
  if (!tool || brief.length < 3) return json({ error: "Pick a tool and write a short brief." }, 400);
  if (!configured()) return json({ error: "ANTHROPIC_API_KEY is not set on the server." }, 503);
  try {
    return json({ text: await ask([{ role: "user", content: brief }], await systemFor(tool), 2500) });
  } catch { return json({ error: "Claude returned an error. Please try again." }, 502); }
}
