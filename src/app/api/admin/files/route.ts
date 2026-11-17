import { NextRequest } from "next/server";
import * as files from "../../../../lib/files";
import { json, sameOrigin, str } from "../../../../lib/http";

const fail = (e: unknown) => (e instanceof files.FsError ? json({ error: e.message }, e.status) : json({ error: "Server error" }, 500));

export async function GET(req: NextRequest) {
  try { return json(await files.readText(req.nextUrl.searchParams.get("path") || "")); } catch (e) { return fail(e); }
}

// Save edited text
export async function PUT(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const b = await req.json().catch(() => ({}));
  if (typeof b.content !== "string") return json({ error: "Bad request" }, 400);
  try { await files.writeText(str(b.path, 600), b.content); return json({ ok: true }); } catch (e) { return fail(e); }
}

// Create a file or folder inside a folder
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  const b = await req.json().catch(() => ({}));
  try {
    if (b.kind === "dir") await files.createDir(str(b.path, 600), str(b.name, 120));
    else if (b.kind === "file") await files.createFile(str(b.path, 600), str(b.name, 120));
    else return json({ error: "Bad request" }, 400);
    return json({ ok: true }, 201);
  } catch (e) { return fail(e); }
}

export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Bad request" }, 403);
  try { await files.remove(req.nextUrl.searchParams.get("path") || ""); return json({ ok: true }); } catch (e) { return fail(e); }
}
