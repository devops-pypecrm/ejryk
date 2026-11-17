import { requireAdmin } from "../../../lib/server-auth";
import { notifyConfigured } from "../../../lib/notify";
import ToolsClient from "../_components/ToolsClient";

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <h1 className="adm-h">SEO &amp; automation</h1>
      <ToolsClient notifyOn={notifyConfigured()} ga={!!process.env.NEXT_PUBLIC_GA_ID} clarity={!!process.env.NEXT_PUBLIC_CLARITY_ID} />
    </>
  );
}
