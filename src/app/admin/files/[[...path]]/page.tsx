import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/server-auth";
import * as files from "../../../../lib/files";
import FolderClient from "../../_components/FolderClient";
import EditorClient from "../../_components/EditorClient";

export const dynamic = "force-dynamic";

export default async function Workspace({ params }: { params: Promise<{ path?: string[] }> }) {
  await requireAdmin();
  const segs = ((await params).path || []).map(decodeURIComponent);
  const rel = segs.join("/");
  let info;
  try { info = await files.stat(rel); } catch { notFound(); }

  const crumbs = [{ name: "zenitzu-ops", href: "/admin/files" }, ...segs.map((s, i) => ({ name: s, href: "/admin/files/" + segs.slice(0, i + 1).map(encodeURIComponent).join("/") }))];
  const trail = (
    <nav className="adm-crumbs">
      {crumbs.map((c, i) => (i < crumbs.length - 1 ? <span key={c.href}><Link href={c.href}>{c.name}</Link> /</span> : <strong key={c.href}>{c.name}</strong>))}
    </nav>
  );

  if (info.st.isDirectory()) {
    return (<><h1 className="adm-h">Workspace</h1>{trail}<FolderClient path={rel} entries={await files.list(rel)} /></>);
  }
  let text: { name: string; size: number; content: string } | null = null;
  try { text = await files.readText(rel); } catch {}
  return (<><h1 className="adm-h">Workspace</h1>{trail}<EditorClient path={rel} initial={text?.content ?? null} size={info.st.size} /></>);
}
