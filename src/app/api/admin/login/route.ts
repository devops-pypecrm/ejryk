import { NextRequest } from "next/server";
import crypto from "crypto";
import { COOKIE, authConfigured, cookieOptions, createSession } from "../../../../lib/auth";
import { clientIp, json, limited, sameOrigin, str } from "../../../../lib/http";

const h = (s: string) => crypto.createHash("sha256").update(s).digest();

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  if (!authConfigured()) return json({ error: "Admin login is not configured on this server." }, 503);
  if (limited(`login:${clientIp(req)}`, 5, 15 * 60 * 1000)) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);

  const body = await req.json().catch(() => ({}));
  const user = str(body.username, 200).toLowerCase();
  const password = str(body.password, 200);
  const okEmail = crypto.timingSafeEqual(h(user), h((process.env.ADMIN_USER || "").toLowerCase()));
  const okPass = crypto.timingSafeEqual(h(password), h(process.env.ADMIN_PASSWORD || ""));
  await new Promise((r) => setTimeout(r, 400)); // slows down guessing
  if (!(okEmail && okPass)) return json({ error: "Wrong username or password." }, 401);

  const res = json({ ok: true });
  res.cookies.set(COOKIE, await createSession(process.env.ADMIN_USER!), cookieOptions());
  return res;
}
