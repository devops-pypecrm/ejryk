import { requireAdmin } from "../../../lib/server-auth";
import { configured, modelName } from "../../../lib/chat";
import AssistantClient from "../_components/AssistantClient";

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <h1 className="adm-h">Claude assistant</h1>
      <AssistantClient ready={configured()} model={modelName()} />
    </>
  );
}
