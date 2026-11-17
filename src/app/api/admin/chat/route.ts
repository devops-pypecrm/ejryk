import { NextRequest } from "next/server";
import { ADMIN_PROMPT, ask, available, cleanMsgs, isProvider } from "../../../../lib/chat";
import { json, limited, sameOrigin } from "../../../../lib/http";

// Guarded by middleware (login required). GET lists configured bots; POST talks to one bot.
export async function GET() {
  return json({ providers: available() });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited("admin-chat", 60, 10 * 60 * 1000)) return json({ error: "Slow down a little." }, 429);
  const b = await req.json().catch(() => null);
  const msgs = cleanMsgs(b?.messages);
  if (!msgs || !isProvider(b?.provider)) return json({ error: "Invalid request" }, 400);
  try {
    return json({ reply: await ask(b.provider, msgs, ADMIN_PROMPT, 1500) });
  } catch (e) {
    const none = e instanceof Error && e.message === "not-configured";
    return json({ error: none ? "This bot has no API key set on the server." : "The provider returned an error. Try again or use the other bot." }, none ? 503 : 502);
  }
}
