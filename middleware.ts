import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookieValue } from "@/lib/session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("super_admin_session")?.value;
  const session = sessionCookie
    ? getSessionFromCookieValue(sessionCookie)
    : null;

  if (pathname.startsWith("/api/admin")) {
    if (session?.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (session?.role === "super_admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (session?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/admin/:path*"],
};
