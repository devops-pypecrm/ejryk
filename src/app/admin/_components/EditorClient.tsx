"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditorClient({ path, initial, size }: { path: string; initial: string | null; size: number }) {
  const router = useRouter();
  const [text, setText] = useState(initial ?? "");
  const [saved, setSaved] = useState(initial ?? "");
  const [msg, setMsg] = useState("");
  const dl = `/api/admin/files/download?path=${encodeURIComponent(path)}`;
  const dirty = text !== saved;

  if (initial === null) {
    return (<div className="adm-card"><p>This file can&apos;t be edited in the browser ({(size / 1024).toFixed(1)} KB).</p><a className="adm-btn" href={dl}>Download</a></div>);
  }
  return (
    <>
      <div className="adm-toolbar">
        <button className="adm-btn" disabled={!dirty} onClick={async () => {
          const r = await fetch("/api/admin/files", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path, content: text }) });
          if (r.ok) { setSaved(text); setMsg("Saved"); router.refresh(); } else setMsg((await r.json().catch(() => ({}))).error || "Could not save");
        }}>Save</button>
        <a className="adm-btn ghost" href={dl}>Download</a>
        <button className="adm-btn ghost" onClick={() => router.back()}>Back</button>
        <span className="adm-saved">{dirty ? "Unsaved changes" : msg}</span>
      </div>
      <textarea className="adm-editor" value={text} onChange={(e) => { setText(e.target.value); setMsg(""); }} spellCheck={false} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); (e.currentTarget.closest("main")?.querySelector(".adm-toolbar .adm-btn") as HTMLButtonElement | null)?.click(); } }} />
    </>
  );
}
