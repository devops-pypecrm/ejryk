import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";
import { getSession } from "../../lib/server-auth";
import { SITE } from "../../data/site";
import LogoutButton from "./_components/LogoutButton";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) return <div className="adm adm-center">{children}</div>;
  return (
    <div className="adm">
      <header className="adm-bar">
        <Link href="/admin" className="adm-brand"><span>⚡</span> {SITE.legal}<small>admin</small></Link>
        <nav>
          <Link href="/admin">Overview</Link>
          <Link href="/admin/leads">Leads</Link>
          <Link href="/admin/tasks">Tasks</Link>
          <Link href="/admin/studio">Studio</Link>
          <Link href="/admin/calendar">Calendar</Link>
          <Link href="/admin/assistant">Chatbots</Link>
          <Link href="/admin/tools">SEO &amp; automation</Link>
          <Link href="/admin/files">Workspace</Link>
          <Link href="/" target="_blank">View site ↗</Link>
        </nav>
        <div className="adm-user"><span>{session.email}</span><LogoutButton /></div>
      </header>
      <main className="adm-main">{children}</main>
    </div>
  );
}
