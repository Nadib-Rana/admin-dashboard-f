export enum UserRole {
  super_admin = "super_admin",
  customer = "customer",
  vendor = "vendor",
  staff = "staff",
}

export type DashboardStats = {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
};

export type AdminUserRecord = {
  id: string;
  fullName: string | null;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  bonusBalance?: number;
  createdAt: string;
};

export type AuditLogRecord = {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  details?: string | null;
  createdAt: string;
};

export type AdminSessionUser = {
  id: string;
  fullName: string | null;
  email: string;
  role: UserRole.super_admin;
};
