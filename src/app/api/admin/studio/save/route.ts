import { NextRequest } from "next/server";
import * as files from "../../../../../lib/files";
import { toolById } from "../../../../../lib/studio";
import { json, sameOrigin, str } from "../../../../../lib/http";

// Save a generated piece into the workspace: zenitzu-ops/outputs/<folder>/YYYY-MM-DD-<tool>-<time>.md
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  const b = await req.json().catch(() => ({}));
  const tool = toolById(b.tool), content = str(b.content, 60000);
  if (!tool || !content) return json({ error: "Bad request" }, 400);
  const d = new Date(), pad = (n: number) => String(n).padStart(2, "0");
  const by = b.by === "grok" ? "grok" : "gemini";
  const name = `${d.toISOString().slice(0, 10)}-${tool.id}-${by}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.md`;
  const dir = `outputs/${tool.folder}`;
  try {
    await files.createFile(dir, name);
    await files.writeText(`${dir}/${name}`, content);
    return json({ path: `${dir}/${name}` }, 201);
  } catch (e) { return e instanceof files.FsError ? json({ error: e.message }, e.status) : json({ error: "Server error" }, 500); }
}
