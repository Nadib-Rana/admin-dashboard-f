import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminByCredentials } from "@/lib/mock-db";
import { createSessionCookieValue } from "@/lib/session";
import { UserRole } from "@/types/admin";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid credentials payload.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const user = getSuperAdminByCredentials(
    parsed.data.email,
    parsed.data.password,
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = `sa-token-${user.id}`;
  const sessionCookie = createSessionCookieValue({
    token,
    role: UserRole.super_admin,
    userId: user.id,
  });

  const response = NextResponse.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set("super_admin_session", sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
