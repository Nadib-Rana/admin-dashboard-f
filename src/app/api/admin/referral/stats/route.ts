import { NextRequest, NextResponse } from "next/server";
import { getReferralStats } from "@/lib/mock-db";
import { getAdminSessionUser } from "@/lib/mock-db";
import { getSessionUserIdFromAuthorizationOrCookie } from "@/lib/session";

export const runtime = "nodejs";

function getAuthorizedSuperAdmin(request: NextRequest) {
  const sessionUserId = getSessionUserIdFromAuthorizationOrCookie(
    request.headers.get("authorization"),
    request.cookies.get("super_admin_session")?.value ?? null,
  );

  return sessionUserId ? getAdminSessionUser(sessionUserId) : null;
}

export async function GET(request: NextRequest) {
  const currentUser = getAuthorizedSuperAdmin(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const stats = getReferralStats();
  return NextResponse.json(stats);
}
