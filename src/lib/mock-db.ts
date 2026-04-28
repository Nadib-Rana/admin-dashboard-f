import {
  AdminSessionUser,
  AdminUserRecord,
  AuditLogRecord,
  DashboardStats,
  UserRole,
} from "@/types/admin";

/**
 * Generate a UUID v4-like string compatible with both browser and server
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createAuditLogEntry(
  adminId: string,
  action: string,
  targetId: string,
  details?: string,
) {
  return {
    id: generateUUID(),
    adminId,
    action,
    targetId,
    details: details ?? null,
    createdAt: new Date().toISOString(),
  };
}

export type ReferralRecord = {
  id: string;
  referrerUserId: string;
  referredVendorId: string;
  bonusAmount: number;
  payoutStatus: "pending" | "paid";
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
};

export type UserWithReferral = AdminUserRecord & {
  referralCount?: number;
  bonusBalance?: number;
};

const superAdminUser: AdminUserRecord = {
  id: "11111111-1111-1111-1111-111111111111",
  fullName: "Super Admin",
  email: "superadmin@demo.com",
  password: "Admin@1234",
  role: UserRole.super_admin,
  isActive: true,
  bonusBalance: 110.0,
  createdAt: "2026-04-01T08:00:00.000Z",
};

const seedUsers: AdminUserRecord[] = [
  superAdminUser,
  {
    id: "22222222-2222-2222-2222-222222222222",
    fullName: "Vendor One",
    email: "vendor1@demo.com",
    password: "vendor123",
    role: UserRole.vendor,
    isActive: true,
    bonusBalance: 25.0,
    createdAt: "2026-04-08T09:30:00.000Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    fullName: "Customer One",
    email: "customer1@demo.com",
    password: "customer123",
    role: UserRole.customer,
    isActive: true,
    bonusBalance: 0,
    createdAt: "2026-04-09T12:15:00.000Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    fullName: "Staff One",
    email: "staff1@demo.com",
    password: "staff123",
    role: UserRole.staff,
    isActive: false,
    bonusBalance: 0,
    createdAt: "2026-04-11T15:45:00.000Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    fullName: "Vendor Two",
    email: "vendor2@demo.com",
    password: "vendor456",
    role: UserRole.vendor,
    isActive: true,
    bonusBalance: 0,
    createdAt: "2026-04-18T10:20:00.000Z",
  },
];

const seedAuditLogs: AuditLogRecord[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    adminId: superAdminUser.id,
    action: "INITIAL_SEED",
    targetId: "SYSTEM",
    details: "Seeded the Super Admin demo workspace.",
    createdAt: "2026-04-20T07:00:00.000Z",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    adminId: superAdminUser.id,
    action: "USER_STATUS_UPDATED",
    targetId: "44444444-4444-4444-4444-444444444444",
    details: "Staff account was deactivated for review.",
    createdAt: "2026-04-23T14:22:00.000Z",
  },
];

const seedReferrals: ReferralRecord[] = [
  {
    id: "ref-1",
    referrerUserId: "11111111-1111-1111-1111-111111111111", // Super Admin
    referredVendorId: "22222222-2222-2222-2222-222222222222", // Vendor One
    bonusAmount: 50.0,
    payoutStatus: "paid",
    adminNote: "First referral bonus paid",
    paidAt: "2026-04-15T10:00:00.000Z",
    createdAt: "2026-04-10T09:00:00.000Z",
  },
  {
    id: "ref-2",
    referrerUserId: "22222222-2222-2222-2222-222222222222", // Vendor One
    referredVendorId: "55555555-5555-5555-5555-555555555555", // Vendor Two
    bonusAmount: 25.0,
    payoutStatus: "pending",
    adminNote: "Awaiting payment confirmation",
    createdAt: "2026-04-20T14:30:00.000Z",
  },
  {
    id: "ref-3",
    referrerUserId: "11111111-1111-1111-1111-111111111111", // Super Admin
    referredVendorId: "55555555-5555-5555-5555-555555555555", // Vendor Two
    bonusAmount: 75.0,
    payoutStatus: "pending",
    createdAt: "2026-04-25T16:45:00.000Z",
  },
  {
    id: "ref-4",
    referrerUserId: "11111111-1111-1111-1111-111111111111", // Super Admin (another referral)
    referredVendorId: "33333333-3333-3333-3333-333333333333", // Customer One
    bonusAmount: 40.0,
    payoutStatus: "paid",
    adminNote: "Bonus verified and paid",
    paidAt: "2026-04-22T14:00:00.000Z",
    createdAt: "2026-04-15T11:00:00.000Z",
  },
  {
    id: "ref-5",
    referrerUserId: "22222222-2222-2222-2222-222222222222", // Vendor One (another referral)
    referredVendorId: "33333333-3333-3333-3333-333333333333", // Customer One
    bonusAmount: 30.0,
    payoutStatus: "paid",
    adminNote: "Payment processed",
    paidAt: "2026-04-21T09:30:00.000Z",
    createdAt: "2026-04-12T08:00:00.000Z",
  },
  {
    id: "ref-6",
    referrerUserId: "11111111-1111-1111-1111-111111111111", // Super Admin (another referral)
    referredVendorId: "44444444-4444-4444-4444-444444444444", // Staff One
    bonusAmount: 35.0,
    payoutStatus: "pending",
    adminNote: "Under review",
    createdAt: "2026-04-26T12:00:00.000Z",
  },
];

const state = {
  users: seedUsers,
  auditLogs: seedAuditLogs,
  referrals: seedReferrals,
  bookingCount: 48,
};

export function getDashboardStats(): DashboardStats {
  return {
    totalUsers: state.users.length,
    totalVendors: state.users.filter((user) => user.role === UserRole.vendor)
      .length,
    totalBookings: state.bookingCount,
  };
}

export function getAllUsers() {
  return [...state.users].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function getAllAuditLogs() {
  return [...state.auditLogs].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

export function getSuperAdminByCredentials(email: string, password: string) {
  const user = state.users.find(
    (record) =>
      record.email.toLowerCase() === email.toLowerCase() &&
      record.password === password &&
      record.role === UserRole.super_admin,
  );

  return user ?? null;
}

export function getUserById(id: string) {
  return state.users.find((user) => user.id === id) ?? null;
}

export function getAdminSessionUser(id: string): AdminSessionUser | null {
  const user = getUserById(id);

  if (!user || user.role !== UserRole.super_admin) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: UserRole.super_admin,
  };
}

export function updateUserStatus(
  userId: string,
  isActive: boolean,
  actorId: string,
) {
  const index = state.users.findIndex((user) => user.id === userId);

  if (index === -1) {
    return { ok: false as const, message: "User not found." };
  }

  if (userId === actorId && !isActive) {
    return { ok: false as const, message: "Self deactivation is blocked." };
  }

  state.users[index] = {
    ...state.users[index],
    isActive,
  };

  state.auditLogs = [
    {
      id: generateUUID(),
      adminId: actorId,
      action: "USER_STATUS_UPDATED",
      targetId: userId,
      details: `User status changed to ${isActive ? "active" : "inactive"}.`,
      createdAt: new Date().toISOString(),
    },
    ...state.auditLogs,
  ];

  return {
    ok: true as const,
    user: state.users[index],
  };
}

// Referral functions
export function getAllReferrals() {
  return state.referrals.map((referral) => ({
    ...referral,
    referrer: {
      id: state.users.find((u) => u.id === referral.referrerUserId)!.id,
      fullName:
        state.users.find((u) => u.id === referral.referrerUserId)!.fullName ||
        "",
      email: state.users.find((u) => u.id === referral.referrerUserId)!.email,
    },
    referredVendor: {
      id: referral.referredVendorId,
      user: {
        fullName:
          state.users.find((u) => u.id === referral.referredVendorId)!
            .fullName || "",
        email: state.users.find((u) => u.id === referral.referredVendorId)!
          .email,
      },
    },
  }));
}

export function updateReferralStatus(
  referralId: string,
  payoutStatus: "pending" | "paid",
) {
  const index = state.referrals.findIndex((r) => r.id === referralId);
  if (index === -1) {
    return { ok: false as const, message: "Referral not found" };
  }

  state.referrals[index] = {
    ...state.referrals[index],
    payoutStatus,
    paidAt: payoutStatus === "paid" ? new Date().toISOString() : undefined,
  };

  return { ok: true as const, referral: state.referrals[index] };
}

export function updateReferralNote(referralId: string, adminNote: string) {
  const index = state.referrals.findIndex((r) => r.id === referralId);
  if (index === -1) {
    return { ok: false as const, message: "Referral not found" };
  }

  state.referrals[index] = {
    ...state.referrals[index],
    adminNote,
  };

  return { ok: true as const, referral: state.referrals[index] };
}

/**
 * Get all referrals for a specific referrer
 * Shows all vendors referred by a particular referrer (one-to-many relationship)
 */
export function getReferralsByReferrer(referrerUserId: string) {
  const referrerReferrals = state.referrals.filter(
    (r) => r.referrerUserId === referrerUserId,
  );

  return referrerReferrals.map((referral) => ({
    ...referral,
    referrer: {
      id: state.users.find((u) => u.id === referral.referrerUserId)!.id,
      fullName:
        state.users.find((u) => u.id === referral.referrerUserId)!.fullName ||
        "",
      email: state.users.find((u) => u.id === referral.referrerUserId)!.email,
    },
    referredVendor: {
      id: referral.referredVendorId,
      user: {
        fullName:
          state.users.find((u) => u.id === referral.referredVendorId)!
            .fullName || "",
        email: state.users.find((u) => u.id === referral.referredVendorId)!
          .email,
      },
    },
  }));
}

/**
 * Get count of vendors referred by a specific referrer
 */
export function getReferredVendorsCountForReferrer(
  referrerUserId: string,
): number {
  return state.referrals.filter((r) => r.referrerUserId === referrerUserId)
    .length;
}

export type UserReferralSummary = {
  userName: string;
  email: string;
  totalReferralVendors: number;
  convertedSubscriptions: number;
  bonus: string;
};

export function getAllUserReferralSummary(): UserReferralSummary[] {
  const referrals = getAllReferrals();
  const grouped = new Map<
    string,
    {
      referrer: {
        id: string;
        fullName: string;
        email: string;
      };
      totalReferralVendors: number;
      convertedSubscriptions: number;
    }
  >();

  referrals.forEach((referral) => {
    const key = referral.referrer.id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        referrer: referral.referrer,
        totalReferralVendors: 0,
        convertedSubscriptions: 0,
      });
    }

    const group = grouped.get(key)!;
    group.totalReferralVendors += 1;
    if (referral.payoutStatus === "paid") {
      group.convertedSubscriptions += 1;
    }
  });

  return Array.from(grouped.values()).map((group) => {
    const user = state.users.find((u) => u.id === group.referrer.id);
    return {
      userName: group.referrer.fullName,
      email: group.referrer.email,
      totalReferralVendors: group.totalReferralVendors,
      convertedSubscriptions: group.convertedSubscriptions,
      bonus: (user?.bonusBalance ?? 0).toFixed(2),
    };
  });
}

export function getReferralStats() {
  const referrals = getAllReferrals();
  const uniqueVendorCount = new Set(
    referrals.map((referral) => referral.referredVendor.id),
  ).size;
  const paidCount = referrals.filter(
    (referral) => referral.payoutStatus === "paid",
  ).length;

  return {
    totalReferrals: referrals.length,
    referralVendors: uniqueVendorCount,
    convertedSubscriptions: paidCount,
  };
}

export function getPendingPayouts() {
  return getAllReferrals()
    .filter((referral) => referral.payoutStatus === "pending")
    .map((referral) => ({
      id: referral.id,
      bonusAmount: referral.bonusAmount,
      payoutStatus: referral.payoutStatus,
      createdAt: referral.createdAt,
      referrer: referral.referrer,
      referredVendor: {
        id: referral.referredVendor.id,
        userId: referral.referredVendor.id,
        user: referral.referredVendor.user,
      },
    }));
}

export function markReferralAsPaid(
  referralId: string,
  adminNote?: string,
  actorId?: string,
) {
  const index = state.referrals.findIndex((r) => r.id === referralId);

  if (index === -1) {
    return { ok: false as const, message: "Referral not found." };
  }

  const existing = state.referrals[index];

  if (existing.payoutStatus === "paid") {
    return {
      ok: false as const,
      message: "Referral is already marked as paid.",
    };
  }

  const referrerIndex = state.users.findIndex(
    (user) => user.id === existing.referrerUserId,
  );

  if (referrerIndex === -1) {
    return { ok: false as const, message: "Referrer user not found." };
  }

  const updatedBonusBalance = Math.max(
    (state.users[referrerIndex].bonusBalance ?? 0) - existing.bonusAmount,
    0,
  );

  state.referrals[index] = {
    ...existing,
    payoutStatus: "paid",
    paidAt: new Date().toISOString(),
    adminNote: adminNote ?? existing.adminNote,
  };

  state.users[referrerIndex] = {
    ...state.users[referrerIndex],
    bonusBalance: updatedBonusBalance,
  };

  if (actorId) {
    state.auditLogs = [
      createAuditLogEntry(
        actorId,
        "referral_marked_paid",
        existing.id,
        adminNote ?? "Referral marked as paid.",
      ),
      ...state.auditLogs,
    ];
  }

  return { ok: true as const, referral: state.referrals[index] };
}
