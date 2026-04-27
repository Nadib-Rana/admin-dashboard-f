import { getReferralStats } from "@/lib/mock-db";

export async function GET() {
  const stats = getReferralStats();
  return Response.json(stats);
}
