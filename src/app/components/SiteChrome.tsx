"use client";
import { usePathname } from "next/navigation";

// The public header/footer/WhatsApp button are hidden inside the private /admin area.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/admin" || path.startsWith("/admin/")) return null;
  return <>{children}</>;
}
