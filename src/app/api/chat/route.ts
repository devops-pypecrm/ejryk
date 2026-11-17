import { NextRequest } from "next/server";
import { ask, cleanMsgs, configured, SITE_PROMPT } from "../../../lib/chat";
import { clientIp, json, limited, sameOrigin } from "../../../lib/http";

// Public website chatbot (Claude). Visitors never see keys or model details.
export async function GET() {
  return json({ available: configured() });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (limited(`chat:${clientIp(req)}`, 30, 10 * 60 * 1000)) return json({ error: "Too many messages. Please try again soon." }, 429);
  const b = await req.json().catch(() => null);
  const msgs = cleanMsgs(b?.messages);
  if (!msgs) return json({ error: "Invalid request" }, 400);
  try {
    return json({ reply: await ask(msgs, SITE_PROMPT) });
  } catch {
    return json({ error: "The assistant is unavailable right now. Please use WhatsApp or the contact form." }, 503);
  }
}
