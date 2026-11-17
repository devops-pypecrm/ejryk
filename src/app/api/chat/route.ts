import { NextRequest } from "next/server";
import { ask, available, cleanMsgs, isProvider, SITE_PROMPT } from "../../../lib/chat";
import { clientIp, json, limited, sameOrigin } from "../../../lib/http";

// Public website chatbots. Each provider is a separate bot; visitors only ever see ids and labels.
export async function GET() {
  return json({ bots: available().map(({ id, label }) => ({ id, label })) });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited(`chat:${clientIp(req)}`, 30, 10 * 60 * 1000)) return json({ error: "Too many messages. Please try again soon." }, 429);
  const b = await req.json().catch(() => null);
  const msgs = cleanMsgs(b?.messages);
  if (!msgs || !isProvider(b?.provider)) return json({ error: "Invalid request" }, 400);
  try {
    return json({ reply: await ask(b.provider, msgs, SITE_PROMPT) });
  } catch {
    return json({ error: "This assistant is unavailable right now. Try the other one, WhatsApp or the contact form." }, 503);
  }
}
