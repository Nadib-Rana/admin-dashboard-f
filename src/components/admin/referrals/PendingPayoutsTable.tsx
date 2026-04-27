"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown, DollarSign } from "lucide-react";
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
              <TableHead className="font-semibold">Referred Vendor</TableHead>
              <TableHead className="font-semibold text-right">
                Bonus Amount
              </TableHead>
              <TableHead className="font-semibold">Referred Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map((payout) => (
              <TableRow key={payout.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {payout.referrer.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payout.referrer.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {payout.referredVendor.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payout.referredVendor.user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ${payout.bonusAmount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(payout.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkPaid(payout)}
                    disabled={isMarking}
                    className="w-full sm:w-auto"
                  >
                    <span>Mark as Paid</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
