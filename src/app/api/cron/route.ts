import { NextRequest } from "next/server";
import crypto from "crypto";
import { tick } from "../../../lib/automation";
import { json } from "../../../lib/http";

// External scheduler hook (cron-job.org, GitHub Actions, system cron):
//   curl -X POST https://your-site/api/cron -H "Authorization: Bearer $CRON_SECRET"
// Disabled unless CRON_SECRET (16+ chars) is set.
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET || "";
  const got = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
  const h = (s: string) => crypto.createHash("sha256").update(s).digest();
  if (secret.length < 16 || !crypto.timingSafeEqual(h(got), h(secret))) return json({ error: "Unauthorized" }, 401);
  return json(await tick());
}
