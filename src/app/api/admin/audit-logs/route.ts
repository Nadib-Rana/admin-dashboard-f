import { NextResponse } from "next/server";
import { getAllAuditLogs } from "@/lib/mock-db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ logs: getAllAuditLogs() });
}
