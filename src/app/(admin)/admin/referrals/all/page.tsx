"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ReferralTable,
  type Referral,
} from "@/components/admin/referrals/ReferralTable";
import {
  getAllReferrals,
  updateReferralStatus,
  updateReferralNote,
} from "@/lib/mock-db";

export default function AllReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAllReferrals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = getAllReferrals();
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

  const handleMarkPaid = async (referral: Referral) => {
    setIsUpdating(true);
    try {
      const result = updateReferralStatus(referral.id, "paid");
      if (!result.ok) {
        throw new Error(result.message);
      }

      // Update local state
      setReferrals((prev) =>
        prev.map((r) =>
          r.id === referral.id
            ? { ...r, payoutStatus: "paid", paidAt: new Date().toISOString() }
            : r,
        ),
      );

      toast.success("Referral marked as paid successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mark as paid";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateNote = async (referralId: string, note: string) => {
    setIsUpdating(true);
    try {
      const result = updateReferralNote(referralId, note);
      if (!result.ok) {
        throw new Error(result.message);
      }

      // Update local state
      setReferrals((prev) =>
        prev.map((r) => (r.id === referralId ? { ...r, adminNote: note } : r)),
      );

      toast.success("Note updated successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update note";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = () => {
    // Convert referrals to CSV
    const headers = [
      "Referrer Name",
      "Referrer Email",
      "Referred Vendor Name",
      "Referred Vendor Email",
      "Bonus Amount",
      "Status",
      "Created At",
      "Paid At",
      "Admin Note",
    ];

    const csvContent = [
      headers.join(","),
      ...referrals.map((referral) =>
        [
          `"${referral.referrer.fullName}"`,
          `"${referral.referrer.email}"`,
          `"${referral.referredVendor.user.fullName}"`,
          `"${referral.referredVendor.user.email}"`,
          referral.bonusAmount,
          referral.payoutStatus,
          `"${referral.createdAt}"`,
          `"${referral.paidAt || ""}"`,
          `"${referral.adminNote || ""}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "referrals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            All Referral Records
          </h1>
          <p className="text-gray-600">
            Manage every referral record, vendor relationship, and payout note.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <ReferralTable
        referrals={referrals}
        isLoading={isLoading}
        onMarkPaid={handleMarkPaid}
        onUpdateNote={handleUpdateNote}
        isUpdating={isUpdating}
      />
    </div>
  );
}
