"use client";

import { useEffect, useState } from "react";
import { BellRing, BookOpenCheck, Users } from "lucide-react";
import { api } from "@/lib/api";
import { StatCard } from "./stat-card";

type Stats = {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
};

export function DashboardStatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      const response = await api.get("/admin/stats");
      if (!active) return;
      setStats(response.data as Stats);
    };

    void loadStats();

    return () => {
      active = false;
    };
  }, []);

  if (!stats) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading dashboard overview...
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        description="All registered accounts from the schema"
        icon={Users}
        accent="primary"
        delay={0.05}
      />
      <StatCard
        title="Total Vendors"
        value={stats.totalVendors}
        description="Vendor role users currently active"
        icon={BellRing}
        accent="emerald"
        delay={0.15}
      />
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        description="Booking volume tracked for the dashboard"
        icon={BookOpenCheck}
        accent="amber"
        delay={0.25}
      />
    </div>
  );
}
