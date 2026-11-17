"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Entry } from "../../../lib/files";

const href = (p: string) => "/admin/files" + (p ? "/" + p.split("/").map(encodeURIComponent).join("/") : "");
const kb = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(1)} MB`);

export default function FolderClient({ path, entries }: { path: string; entries: Entry[] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const join = (n: string) => (path ? `${path}/${n}` : n);

  async function call(url: string, init: RequestInit) {
    const r = await fetch(url, init);
    if (!r.ok) { setErr((await r.json().catch(() => ({}))).error || "Something went wrong"); return false; }
    setErr(""); router.refresh(); return true;
  }
  async function create(kind: "file" | "dir") {
    const name = prompt(kind === "file" ? "New file name (e.g. notes.md)" : "New folder name");
    if (name) await call("/api/admin/files", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, path, name }) });
  }
  async function upload(f: File | undefined) {
    if (!f) return;
    const fd = new FormData(); fd.append("file", f); fd.append("path", path);
    await call("/api/admin/files/upload", { method: "POST", body: fd });
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <div className="adm-toolbar">
        <button className="adm-btn ghost" onClick={() => create("file")}>+ New file</button>
        <button className="adm-btn ghost" onClick={() => create("dir")}>+ New folder</button>
        <label className="adm-btn ghost adm-upload">Upload<input ref={fileRef} type="file" onChange={(e) => upload(e.target.files?.[0])} hidden /></label>
      </div>
      {err && <div className="adm-err">{err}</div>}
      <div className="adm-card adm-files">
        {path && <Link className="adm-frow" href={href(path.split("/").slice(0, -1).join("/"))}><span>↩ ..</span></Link>}
        {entries.map((e) => (
          <div className="adm-frow" key={e.name}>
            <Link href={href(join(e.name))}><span className="ico">{e.type === "dir" ? "📁" : "📄"}</span>{e.name}</Link>
            <small>{e.type === "file" ? kb(e.size) : ""}</small>
            <small>{new Date(e.modified).toLocaleDateString()}</small>
            <span className="adm-fact">
              {e.type === "file" && <a href={`/api/admin/files/download?path=${encodeURIComponent(join(e.name))}`}>Download</a>}
              <button onClick={() => confirm(`Delete "${e.name}"${e.type === "dir" ? " and everything inside it" : ""}?`) && call(`/api/admin/files?path=${encodeURIComponent(join(e.name))}`, { method: "DELETE" })}>Delete</button>
            </span>
          </div>
        ))}
        {!entries.length && <p className="adm-empty">This folder is empty.</p>}
      </div>
    </>
  );
}
