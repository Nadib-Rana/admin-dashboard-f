export async function GET() {
  // Mock data for all user referrals
  const allUserReferrals = [
    {
      userName: "John Doe",
      email: "john@example.com",
      totalReferralVendors: 5,
      convertedSubscriptions: 5,
      bonus: "25.00",
    },
    {
      userName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      totalReferralVendors: 8,
      convertedSubscriptions: 7,
      bonus: "42.50",
    },
    {
      userName: "Ahmed Hassan",
      email: "ahmed.hassan@example.com",
      totalReferralVendors: 12,
      convertedSubscriptions: 10,
      bonus: "75.00",
    },
    {
      userName: "Maria Garcia",
      email: "maria.garcia@example.com",
      totalReferralVendors: 6,
      convertedSubscriptions: 4,
      bonus: "28.75",
    },
    {
      userName: "Michael Chen",
      email: "michael.chen@example.com",
      totalReferralVendors: 9,
      convertedSubscriptions: 8,
      bonus: "58.50",
    },
    {
      userName: "Emma Wilson",
      email: "emma.wilson@example.com",
      totalReferralVendors: 15,
      convertedSubscriptions: 13,
      bonus: "89.25",
    },
  ];

  return Response.json(allUserReferrals);
}
