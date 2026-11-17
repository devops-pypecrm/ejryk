import { requireAdmin } from "../../../lib/server-auth";
import { leads } from "../../../lib/store";
import { configured } from "../../../lib/chat";
import LeadsClient from "../_components/LeadsClient";

export default async function LeadsPage() {
  await requireAdmin();
  return (<><h1 className="adm-h">Leads</h1><LeadsClient initial={await leads.list()} ai={configured()} /></>);
}
