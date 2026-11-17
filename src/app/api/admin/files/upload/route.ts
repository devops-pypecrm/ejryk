import { NextRequest } from "next/server";
import * as files from "../../../../../lib/files";
import { json, sameOrigin, str } from "../../../../../lib/http";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (!(f instanceof File)) return json({ error: "No file" }, 400);
    const name = f.name.replace(/[^\w .@()\-]/g, "_");
    await files.saveUpload(str(form.get("path"), 600), name, Buffer.from(await f.arrayBuffer()));
    return json({ ok: true }, 201);
  } catch (e) { return e instanceof files.FsError ? json({ error: e.message }, e.status) : json({ error: "Server error" }, 500); }
}
