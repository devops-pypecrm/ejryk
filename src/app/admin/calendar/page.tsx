import { requireAdmin } from "../../../lib/server-auth";
import { plans } from "../../../lib/store";
import CalendarClient from "../_components/CalendarClient";

export default async function Page() {
  await requireAdmin();
  return (<><h1 className="adm-h">Content calendar</h1><CalendarClient initial={await plans.list()} /></>);
}
