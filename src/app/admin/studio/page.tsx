import { requireAdmin } from "../../../lib/server-auth";
import { configured } from "../../../lib/chat";
import { TOOLS } from "../../../lib/studio";
import StudioClient from "../_components/StudioClient";

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <h1 className="adm-h">Marketing Studio</h1>
      <p className="adm-sub">Write blogs, social posts, ads, SEO copy, emails, proposals and case studies in our brand voice. Powered by Claude.</p>
      <StudioClient ready={configured()} tools={TOOLS.map(({ id, label, hint }) => ({ id, label, hint }))} />
    </>
  );
}
