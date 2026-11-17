import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySession } from "./auth";

export async function getSession() {
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

// Defence in depth: middleware already blocks these routes, every admin page checks again.
export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  return s;
}
