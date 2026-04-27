"use client";

import { DashboardStatsGrid } from "@/components/admin/dashboard-stats";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Admin dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Live operational metrics for the Super Admin workflow are shown below.
        </p>
      </div>
      <DashboardStatsGrid />
    </div>
  );
}
