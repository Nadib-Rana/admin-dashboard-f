"use client";

import { AuditLogsTable } from "@/components/admin/audit-logs-table";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Audit logs
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Administrative activity feed
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every important admin action is tracked for accountability and review.
        </p>
      </div>
      <AuditLogsTable />
    </div>
  );
}
