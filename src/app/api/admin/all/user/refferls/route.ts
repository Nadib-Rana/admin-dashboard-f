import { getAllUserReferralSummary } from "@/lib/mock-db";

export async function GET() {
  const allUserReferrals = getAllUserReferralSummary();
  return Response.json(allUserReferrals);
}
