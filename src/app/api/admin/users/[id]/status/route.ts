import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserById, updateUserStatus } from "@/lib/mock-db";
import { getUserIdFromToken } from "@/lib/session";

export const runtime = "nodejs";

const statusSchema = z.object({
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ?? null;
  const actorId = getUserIdFromToken(token);

  if (!actorId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json();
  const parsed = statusSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid status payload." },
      { status: 400 },
    );
  }

  const currentUser = getUserById(id);

  if (!currentUser) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  const result = updateUserStatus(
    id,
    parsed.data.isActive ?? !currentUser.isActive,
    actorId,
  );

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  const { password, ...user } = result.user;

  return NextResponse.json({ user });
}
