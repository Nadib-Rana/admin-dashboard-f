import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionUser, markReferralAsPaid } from "@/lib/mock-db";
import { getSessionUserIdFromAuthorizationOrCookie } from "@/lib/session";

export const runtime = "nodejs";

function getAuthorizedSuperAdmin(request: NextRequest) {
  const sessionUserId = getSessionUserIdFromAuthorizationOrCookie(
    request.headers.get("authorization"),
    request.cookies.get("super_admin_session")?.value ?? null,
  );

  return sessionUserId ? getAdminSessionUser(sessionUserId) : null;
}

const markPaidSchema = z.object({
  adminNote: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const currentUser = getAuthorizedSuperAdmin(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();
  const parsed = markPaidSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid mark-paid payload.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = markReferralAsPaid(id, parsed.data.adminNote, currentUser.id);

  if (!result.ok) {
    const status = result.message === "Referral not found." ? 404 : 400;
    return NextResponse.json({ message: result.message }, { status });
  }

  return NextResponse.json(result.referral);
}
