import { requireAdmin } from "../../../lib/server-auth";
import { available } from "../../../lib/chat";
import AssistantClient from "../_components/AssistantClient";

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <h1 className="adm-h">Chatbots</h1>
      <AssistantClient providers={available()} />
    </>
  );
}
