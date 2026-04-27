"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferralStatsCards } from "@/components/admin/referrals/ReferralStatsCards";
import { PendingPayoutsTable } from "@/components/admin/referrals/PendingPayoutsTable";
import { MarkAsPaidModal } from "@/components/admin/referrals/MarkAsPaidModal";
import { api } from "@/lib/api";
import {
  setStatsLoading,
  setStatsData,
  setStatsError,
  setPayoutsLoading,
  setPayoutsData,
  setPayoutsError,
  setSelectedReferral,
  resetMarkingState,
} from "@/store/referralSlice";
import type { PendingPayout } from "@/store/referralSlice";

export default function ReferralsPage() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.referral.stats);
  const payouts = useAppSelector((state) => state.referral.pendingPayouts);
  const selectedReferral = useAppSelector(
    (state) => state.referral.selectedReferral,
  );
  const isMarkingPaid = useAppSelector((state) => state.referral.isMarkingPaid);
  const markingError = useAppSelector((state) => state.referral.markingError);
  const isModalOpen = selectedReferral !== null;

  const fetchStats = useCallback(async () => {
    dispatch(setStatsLoading(true));
    try {
      const { data } = await api.get("/admin/referral/stats");
      dispatch(setStatsData(data));
    } catch (error) {
      const err = error as { response?: { data?: { error: string } } };
      const errorMessage =
        err?.response?.data?.error || "Failed to fetch referral stats";
      dispatch(setStatsError(errorMessage));
      toast.error(errorMessage);
    }
  }, [dispatch]);

  const fetchPayouts = useCallback(async () => {
    dispatch(setPayoutsLoading(true));
    try {
      const { data } = await api.get("/admin/referral/payouts");
      dispatch(setPayoutsData(data.data || data));
    } catch (error) {
      const err = error as { response?: { data?: { error: string } } };
      const errorMessage =
        err?.response?.data?.error || "Failed to fetch pending payouts";
      dispatch(setPayoutsError(errorMessage));
      toast.error(errorMessage);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStats();
    fetchPayouts();
  }, [fetchStats, fetchPayouts]);

  const handleMarkPaid = (payout: PendingPayout) => {
    dispatch(resetMarkingState());
    dispatch(setSelectedReferral(payout));
  };

  const handleModalClose = () => {
    dispatch(setSelectedReferral(null));
    dispatch(resetMarkingState());
  };

  const handleMarkPaidSuccess = () => {
    fetchPayouts();
  };

  const handleRefresh = async () => {
    await Promise.all([fetchStats(), fetchPayouts()]);
    toast.success("Data refreshed successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Referral Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage vendor referrals and process payouts
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={stats.loading || payouts.loading}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <ReferralStatsCards stats={stats.data} isLoading={stats.loading} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Pending Payouts</h2>
        <PendingPayoutsTable
          payouts={payouts.data}
          isLoading={payouts.loading}
          onMarkPaid={handleMarkPaid}
          isMarking={isMarkingPaid}
        />
      </div>

      <MarkAsPaidModal
        isOpen={isModalOpen}
        referral={selectedReferral}
        isLoading={isMarkingPaid}
        error={markingError}
        onClose={handleModalClose}
        onSuccess={handleMarkPaidSuccess}
      />
    </div>
  );
}
