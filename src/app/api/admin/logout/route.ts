import { NextRequest } from "next/server";
import { COOKIE, cookieOptions } from "../../../../lib/auth";
import { json, sameOrigin } from "../../../../lib/http";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const res = json({ ok: true });
  res.cookies.set(COOKIE, "", cookieOptions(0));
  return res;
}
