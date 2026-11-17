import { promises as fs } from "fs";
import path from "path";

// File access for the admin "Workspace" (the zenitzu-ops folder). Every path from the browser is validated here:
// no "..", no absolute paths, no symlinks, no secrets files, and nothing outside ROOT.
export const ROOT = path.resolve(process.env.OPS_DIR || path.join(process.cwd(), "zenitzu-ops"));

export const TEXT_EXT = new Set([".md", ".txt", ".json", ".yml", ".yaml", ".csv", ".html", ".css"]);
export const UPLOAD_EXT = new Set([...TEXT_EXT, ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf", ".docx", ".pptx", ".xlsx"]);
export const MAX_EDIT_BYTES = 512 * 1024;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const HIDDEN = new Set([".gitkeep", ".DS_Store"]);

export class FsError extends Error { constructor(public status: number, message: string) { super(message); } }

const SEG = /^\.?[A-Za-z0-9][\w .@()\-]{0,99}$/;      // existing names (a single leading dot is allowed, e.g. .claude)
const NEW_SEG = /^[A-Za-z0-9][\w .@()\-]{0,99}$/;     // new names: no leading dot

export function clean(rel: string | null | undefined): string[] {
  const segs = (rel || "").split("/").filter(Boolean);
  for (const s of segs) {
    if (s === "." || s === ".." || !SEG.test(s) || s.toLowerCase().startsWith(".env")) throw new FsError(400, "Invalid path");
  }
  return segs;
}

export function resolve(segs: string[]) {
  const abs = path.join(ROOT, ...segs);
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) throw new FsError(400, "Invalid path");
  return abs;
}

async function ensureNoSymlinks(segs: string[]) {
  let cur = ROOT;
  for (const s of segs) {
    cur = path.join(cur, s);
    try { if ((await fs.lstat(cur)).isSymbolicLink()) throw new FsError(400, "Invalid path"); }
    catch (e) { if (e instanceof FsError) throw e; return; } // doesn't exist yet: fine (caller handles)
  }
}

export interface Entry { name: string; type: "dir" | "file"; size: number; modified: string; editable: boolean }

export async function stat(rel: string) {
  const segs = clean(rel); const abs = resolve(segs);
  await ensureNoSymlinks(segs);
  try { return { segs, abs, st: await fs.stat(abs) }; } catch { throw new FsError(404, "Not found"); }
}

export async function list(rel: string): Promise<Entry[]> {
  const { abs, st } = await stat(rel);
  if (!st.isDirectory()) throw new FsError(400, "Not a folder");
  const names = (await fs.readdir(abs)).filter((n) => !HIDDEN.has(n));
  const out: Entry[] = [];
  for (const name of names) {
    const s = await fs.lstat(path.join(abs, name));
    if (s.isSymbolicLink()) continue;
    out.push({ name, type: s.isDirectory() ? "dir" : "file", size: s.size, modified: s.mtime.toISOString(), editable: s.isFile() && TEXT_EXT.has(path.extname(name).toLowerCase()) && s.size <= MAX_EDIT_BYTES });
  }
  return out.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
}

export async function readText(rel: string) {
  const { abs, st, segs } = await stat(rel);
  if (!st.isFile()) throw new FsError(400, "Not a file");
  if (!TEXT_EXT.has(path.extname(abs).toLowerCase()) || st.size > MAX_EDIT_BYTES) throw new FsError(415, "This file can't be edited here. Download it instead.");
  return { name: segs[segs.length - 1], size: st.size, content: await fs.readFile(abs, "utf8") };
}

export async function writeText(rel: string, content: string) {
  const { abs, st } = await stat(rel);
  if (!st.isFile() || !TEXT_EXT.has(path.extname(abs).toLowerCase())) throw new FsError(415, "Not an editable file");
  if (Buffer.byteLength(content) > MAX_EDIT_BYTES) throw new FsError(413, "File too large");
  await fs.writeFile(abs, content, "utf8");
}

async function parentOf(rel: string, name: string) {
  if (!NEW_SEG.test(name)) throw new FsError(400, "Use letters, numbers, spaces, - _ . only (max 100 chars, no leading dot)");
  const { abs, st } = await stat(rel);
  if (!st.isDirectory()) throw new FsError(400, "Not a folder");
  const target = path.join(abs, name);
  try { await fs.lstat(target); throw new FsError(409, "Already exists"); } catch (e) { if (e instanceof FsError) throw e; }
  return target;
}

export async function createFile(rel: string, name: string) {
  if (!TEXT_EXT.has(path.extname(name).toLowerCase())) throw new FsError(400, `New files must end in ${[...TEXT_EXT].join(" ")}`);
  await fs.writeFile(await parentOf(rel, name), "", "utf8");
}
export async function createDir(rel: string, name: string) { await fs.mkdir(await parentOf(rel, name)); }

export async function saveUpload(rel: string, name: string, data: Buffer) {
  if (!UPLOAD_EXT.has(path.extname(name).toLowerCase())) throw new FsError(415, "That file type is not allowed");
  if (data.length > MAX_UPLOAD_BYTES) throw new FsError(413, "File too large (max 8 MB)");
  await fs.writeFile(await parentOf(rel, name), data);
}

export async function remove(rel: string) {
  const { segs, abs, st } = await stat(rel);
  if (!segs.length) throw new FsError(400, "Can't delete the workspace root");
  if (st.isDirectory()) await fs.rm(abs, { recursive: true }); else await fs.unlink(abs);
}

export async function filePath(rel: string) {
  const { abs, st } = await stat(rel);
  if (!st.isFile()) throw new FsError(400, "Not a file");
  return { abs, size: st.size };
}
