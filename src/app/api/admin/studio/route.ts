import { NextRequest } from "next/server";
import { ask, available, isProvider } from "../../../../lib/chat";
import { TOOLS, systemFor, toolById } from "../../../../lib/studio";
import { json, limited, sameOrigin, str } from "../../../../lib/http";

export async function GET() {
  return json({ providers: available(), tools: TOOLS.map(({ id, label, hint }) => ({ id, label, hint })) });
}

// Run one tool on one bot, or on both side by side.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("studio", 40, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => ({}));
  const tool = toolById(b.tool), brief = str(b.brief, 4000);
  if (!tool || brief.length < 3) return json({ error: "Pick a tool and write a short brief." }, 400);
  const bots = available().filter((p) => (b.provider === "both" ? true : isProvider(b.provider) && p.id === b.provider));
  if (!bots.length) return json({ error: "That bot has no API key set on the server." }, 503);
  const system = await systemFor(tool);
  const results = await Promise.all(bots.map(async (p) => {
    try { return { id: p.id, label: p.label, text: await ask(p.id, [{ role: "user", content: brief }], system, 2500) }; }
    catch { return { id: p.id, label: p.label, error: "This provider returned an error." }; }
  }));
  return json({ results });
}
