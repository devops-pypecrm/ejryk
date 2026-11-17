import { requireAdmin } from "../../../lib/server-auth";
import AutomationClient from "../_components/AutomationClient";

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <h1 className="adm-h">Marketing automation</h1>
      <p className="adm-sub">Switch on workflows that run by themselves: on every new lead, or on a daily or weekly schedule. Everything they create (drafts, ideas, tasks) is left for you to review; nothing is published or sent to customers automatically.</p>
      <AutomationClient />
    </>
  );
}
