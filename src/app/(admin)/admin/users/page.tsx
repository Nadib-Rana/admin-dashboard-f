"use client";

import { UsersTable } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          User management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Manage platform accounts
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Review every user, protect the current admin account, and control
          activation status.
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
