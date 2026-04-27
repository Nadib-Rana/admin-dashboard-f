"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PendingPayout } from "@/store/referralSlice";

import { useState, useMemo } from "react";
import { ViewReferredVendorsModal } from "./ViewReferredVendorsModal";
import { DollarSign } from "lucide-react";

type ReferrerGroup = {
  referrer: { id: string; fullName: string; email: string };
  payouts: PendingPayout[];
  totalBonus: number;
  count: number;
};

interface PendingPayoutsTableProps {
  payouts: PendingPayout[];
  isLoading: boolean;
  onMarkPaid: (payout: PendingPayout) => void;
  isMarking: boolean;
}

export function PendingPayoutsTable({
  payouts,
  isLoading,
  onMarkPaid,
  isMarking,
}: PendingPayoutsTableProps) {
  const [selectedReferrer, setSelectedReferrer] =
    useState<ReferrerGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupedPayouts = useMemo(() => {
    const groups = new Map();
    payouts.forEach((payout) => {
      const key = payout.referrer.id;
      if (!groups.has(key)) {
        groups.set(key, {
          referrer: payout.referrer,
          payouts: [],
          totalBonus: 0,
          count: 0,
        });
      }
      const group = groups.get(key);
      group.payouts.push(payout);
      group.totalBonus += payout.bonusAmount;
      group.count += 1;
    });
    // Apply bonus for referrers with more than 10 referrals: $5 per refer
    groups.forEach((group) => {
      if (group.count > 10) {
        group.totalBonus += group.count * 5;
      }
    });
    return Array.from(groups.values());
  }, [payouts]);
  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (payouts.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No Pending Payouts
          </h3>
          <p className="text-gray-500 mt-2">
            All referral payouts have been processed.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Referrer</TableHead>
              <TableHead className="font-semibold text-right">
                Number of Referred Vendors
              </TableHead>
              <TableHead className="font-semibold text-right">
                Total Bonus Amount
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedPayouts.map((group) => (
              <TableRow key={group.referrer.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {group.referrer.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {group.referrer.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{group.count}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ${group.totalBonus.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReferrer(group);
                      setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ViewReferredVendorsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          referrer={selectedReferrer?.referrer}
          payouts={selectedReferrer?.payouts || []}
          onMarkPaid={onMarkPaid}
          isMarking={isMarking}
        />
      </div>
    </Card>
  );
}
