import Link from "next/link";
import { requireAdmin } from "../../lib/server-auth";
import { leads, tasks } from "../../lib/store";

export default async function Overview() {
  await requireAdmin();
  const [l, t] = await Promise.all([leads.list(), tasks.list()]);
  const stat = (n: number, label: string, href: string) => (
    <Link href={href} className="adm-card adm-stat"><b>{n}</b><span>{label}</span></Link>
  );
  return (
    <>
      <h1 className="adm-h">Overview</h1>
      <div className="adm-grid4">
        {stat(l.filter((x) => x.status === "new").length, "New leads", "/admin/leads")}
        {stat(l.length, "All leads", "/admin/leads")}
        {stat(t.filter((x) => x.status !== "done").length, "Open tasks", "/admin/tasks")}
        {stat(t.filter((x) => x.status === "done").length, "Done tasks", "/admin/tasks")}
      </div>
      <Link href="/admin/files" className="adm-card adm-stat adm-wide"><b>📁</b><span>Workspace: brand context, templates, SOPs, skills, agents and outputs (zenitzu-ops)</span></Link>
      <h2 className="adm-h2">Latest leads</h2>
      <div className="adm-card">
        {l.slice(0, 5).map((x) => (
          <Link key={x.id} href="/admin/leads" className="adm-row">
            <strong>{x.name}</strong><span>{x.email}</span><em className={`pill ${x.status}`}>{x.status}</em>
          </Link>
        ))}
        {!l.length && <p className="adm-empty">No enquiries yet. They will appear here when someone uses the contact form.</p>}
      </div>
    </>
  );
}
