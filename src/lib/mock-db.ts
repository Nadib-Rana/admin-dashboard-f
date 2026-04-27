import { randomUUID } from "crypto";
import {
  AdminSessionUser,
  AdminUserRecord,
  AuditLogRecord,
  DashboardStats,
  UserRole,
} from "@/types/admin";

const superAdminUser: AdminUserRecord = {
  id: "11111111-1111-1111-1111-111111111111",
  fullName: "Super Admin",
  email: "superadmin@demo.com",
  password: "Admin@1234",
  role: UserRole.super_admin,
  isActive: true,
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
    createdAt: "2026-04-08T09:30:00.000Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    fullName: "Customer One",
    email: "customer1@demo.com",
    password: "customer123",
    role: UserRole.customer,
    isActive: true,
    createdAt: "2026-04-09T12:15:00.000Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    fullName: "Staff One",
    email: "staff1@demo.com",
    password: "staff123",
    role: UserRole.staff,
    isActive: false,
    createdAt: "2026-04-11T15:45:00.000Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    fullName: "Vendor Two",
    email: "vendor2@demo.com",
    password: "vendor456",
    role: UserRole.vendor,
    isActive: true,
    createdAt: "2026-04-18T10:20:00.000Z",
  },
];

const seedAuditLogs: AuditLogRecord[] = [
  {
    id: randomUUID(),
    adminId: superAdminUser.id,
    action: "INITIAL_SEED",
    targetId: "SYSTEM",
    details: "Seeded the Super Admin demo workspace.",
    createdAt: "2026-04-20T07:00:00.000Z",
  },
  {
    id: randomUUID(),
    adminId: superAdminUser.id,
    action: "USER_STATUS_UPDATED",
    targetId: "44444444-4444-4444-4444-444444444444",
    details: "Staff account was deactivated for review.",
    createdAt: "2026-04-23T14:22:00.000Z",
  },
];

const state = {
  users: seedUsers,
  auditLogs: seedAuditLogs,
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
      id: randomUUID(),
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
