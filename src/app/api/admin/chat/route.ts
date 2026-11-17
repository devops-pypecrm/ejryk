import { NextRequest } from "next/server";
import { ADMIN_PROMPT, ask, cleanMsgs, configured, modelName } from "../../../../lib/chat";
import { json, limited, sameOrigin } from "../../../../lib/http";

// Guarded by middleware (login required).
export async function GET() {
  return json({ available: configured(), model: modelName() });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("admin-chat", 60, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => null);
  const msgs = cleanMsgs(b?.messages);
  if (!msgs) return json({ error: "Invalid request" }, 400);
  try {
    return json({ reply: await ask(msgs, ADMIN_PROMPT, 1500) });
  } catch (e) {
    const none = e instanceof Error && e.message === "not-configured";
    return json({ error: none ? "ANTHROPIC_API_KEY is not set on the server." : "Claude returned an error. Please try again." }, none ? 503 : 502);
  }
}
