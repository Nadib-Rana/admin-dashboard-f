import { getPendingPayouts } from "@/lib/mock-db";

export async function GET() {
  const payouts = getPendingPayouts();
  return Response.json(payouts);
}
