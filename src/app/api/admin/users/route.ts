import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/mock-db";
import { getUserIdFromToken } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ?? null;
  const currentUserId = getUserIdFromToken(token);

  return NextResponse.json({
    currentUserId,
    users: getAllUsers().map(({ password, ...user }) => user),
  });
}
