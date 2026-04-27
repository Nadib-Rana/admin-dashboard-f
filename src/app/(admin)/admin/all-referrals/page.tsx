"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AllUserReferralsTable } from "@/components/admin/referrals/AllUserReferralsTable";
import type { UserReferral } from "@/components/admin/referrals/AllUserReferralsTable";

export default function AllReferralsPage() {
  const [referrals, setReferrals] = useState<UserReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReferrals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/all/user/refferls");
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const data = await response.json();
      setReferrals(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch referrals";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReferrals();
  }, [fetchAllReferrals]);

  const handleRefresh = async () => {
    await fetchAllReferrals();
    toast.success("Referrals refreshed successfully");
  };

  const handleExport = () => {
    // Convert referrals to CSV
    const headers = [
      "User Name",
      "Email",
      "Total Referral Vendors",
      "Converted Subscriptions",
      "Bonus",
    ];
    const csvContent = [
      headers.join(","),
      ...referrals.map((r) =>
        [
          r.userName,
          r.email,
          r.totalReferralVendors,
          r.convertedSubscriptions,
          r.bonus,
        ].join(","),
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referrals_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Referrals exported successfully");
  };

  // Calculate summary statistics
  const totalVendors = referrals.reduce(
    (sum, r) => sum + r.totalReferralVendors,
    0,
  );
  const totalConverted = referrals.reduce(
    (sum, r) => sum + r.convertedSubscriptions,
    0,
  );
  const totalBonus = referrals.reduce((sum, r) => sum + parseFloat(r.bonus), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Referral Summary
          </h1>
          <p className="text-gray-600 mt-2">
            See the referral performance summary for every user.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            disabled={isLoading || referrals.length === 0}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      {referrals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Vendors</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {totalVendors}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Referrals from {referrals.length} users
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-medium">
              Total Converted
            </p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {totalConverted}
            </p>
            <p className="text-xs text-green-500 mt-1">
              {((totalConverted / totalVendors) * 100).toFixed(0)}% conversion
              rate
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-600 font-medium">Total Bonus</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              ${totalBonus.toFixed(2)}
            </p>
            <p className="text-xs text-yellow-500 mt-1">
              Paid out to {referrals.length} users
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      <AllUserReferralsTable referrals={referrals} isLoading={isLoading} />
    </div>
  );
}
