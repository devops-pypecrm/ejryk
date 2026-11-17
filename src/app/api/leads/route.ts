import { NextRequest } from "next/server";
import { leads } from "../../../lib/store";
import { clientIp, json, limited, str } from "../../../lib/http";

// Public endpoint used by the contact form.
export async function POST(req: NextRequest) {
  if (limited(`lead:${clientIp(req)}`, 5, 60 * 60 * 1000)) return json({ error: "Too many messages, please try later." }, 429);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return json({ error: "Invalid request" }, 400);
  if (str(b.website, 100)) return json({ ok: true }); // honeypot field: bots fill it, people never see it
  const name = str(b.name, 120), email = str(b.email, 200), phone = str(b.phone, 40), message = str(b.message, 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Please fill in your name, a valid email and a message." }, 400);
  await leads.add({ name, email, phone, message });
  return json({ ok: true }, 201);
}
