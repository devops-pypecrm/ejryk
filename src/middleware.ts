import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "./lib/auth";

// Everything under /admin and /api/admin needs a valid signed session, except the login page and login endpoint.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const open = pathname === "/admin/login" || pathname === "/api/admin/login";
  const session = await verifySession(req.cookies.get(COOKIE)?.value);

  let res: NextResponse;
  if (!open && !session) {
    if (pathname.startsWith("/api/")) {
      res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      res = NextResponse.redirect(url);
    }
  } else if (pathname === "/admin/login" && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    res = NextResponse.redirect(url);
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
