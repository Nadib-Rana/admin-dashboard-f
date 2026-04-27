import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/mock-db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getDashboardStats());
}
