"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PendingPayout } from "@/store/referralSlice";

interface ViewReferredVendorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrer?: { id: string; fullName: string; email: string };
  payouts: PendingPayout[];
  onMarkPaid: (payout: PendingPayout) => void;
  isMarking: boolean;
}

export function ViewReferredVendorsModal({
  isOpen,
  onClose,
  referrer,
  payouts,
  onMarkPaid,
  isMarking,
}: ViewReferredVendorsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Referred Vendors for {referrer?.fullName}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
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
      </DialogContent>
    </Dialog>
  );
}
