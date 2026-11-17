import Link from "next/link";
import { requireAdmin } from "../../lib/server-auth";
import { leads, tasks, plans } from "../../lib/store";

export default async function Overview() {
  await requireAdmin();
  const [l, t, pl] = await Promise.all([leads.list(), tasks.list(), plans.list()]);
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
      <div className="adm-grid4" style={{ marginTop: 14 }}>
        <Link href="/admin/studio" className="adm-card adm-stat"><b>✨</b><span>Marketing Studio: blogs, posts, ads, SEO copy</span></Link>
        <Link href="/admin/calendar" className="adm-card adm-stat"><b>{pl.filter((x) => x.status !== "posted").length}</b><span>Content items planned</span></Link>
        <Link href="/admin/automation" className="adm-card adm-stat"><b>⚙️</b><span>Automation: lead autopilot, weekly plans, digests</span></Link>
        <Link href="/admin/assistant" className="adm-card adm-stat"><b>💬</b><span>Claude assistant</span></Link>
        <Link href="/admin/tools" className="adm-card adm-stat"><b>🔎</b><span>SEO checker, UTM links, automation</span></Link>
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
