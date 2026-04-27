"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown, DollarSign, Edit, Check, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export interface Referral {
  id: string;
  referrer: {
    id: string;
    fullName: string;
    email: string;
  };
  referredVendor: {
    id: string;
    user: {
      fullName: string;
      email: string;
    };
  };
  bonusAmount: number;
  payoutStatus: "pending" | "paid";
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
}

interface ReferralTableProps {
  referrals: Referral[];
  isLoading: boolean;
  onMarkPaid: (referral: Referral) => void;
  onUpdateNote: (referralId: string, note: string) => void;
  onViewReferrerVendors?: (referrerId: string) => void;
  isUpdating: boolean;
}

export function ReferralTable({
  referrals,
  isLoading,
  onMarkPaid,
  onUpdateNote,
  onViewReferrerVendors,
  isUpdating,
}: ReferralTableProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedReferrer, setSelectedReferrer] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleEditNote = (referral: Referral) => {
    setEditingNote(referral.id);
    setNoteText(referral.adminNote || "");
  };

  const handleSaveNote = (referralId: string) => {
    onUpdateNote(referralId, noteText);
    setEditingNote(null);
    setNoteText("");
  };

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

  if (referrals.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No Referrals Found
          </h3>
          <p className="text-gray-500 mt-2">No referral records available.</p>
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
              <TableHead className="font-semibold text-center">
                Referred Vendors
              </TableHead>
              <TableHead className="font-semibold">Referred Vendor</TableHead>
              <TableHead className="font-semibold text-right">
                Bonus Amount
              </TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">Paid At</TableHead>
              <TableHead className="font-semibold">Admin Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral, index) => {
              // Count unique referrals for this referrer (avoid duplicates)
              const referrersCount = referrals.filter(
                (r) => r.referrer.id === referral.referrer.id,
              ).length;
              // Check if this is the first occurrence of this referrer
              const isFirstReferrer =
                index === 0 ||
                referrals[index - 1].referrer.id !== referral.referrer.id;

              return (
                <TableRow key={referral.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {referral.referrer.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {referral.referrer.email}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedReferrer({
                                id: referral.referrer.id,
                                name: referral.referrer.fullName,
                              })
                            }
                            title="View all vendors referred by this referrer"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              All Vendors Referred by {selectedReferrer?.name}
                            </DialogTitle>
                          </DialogHeader>
                          <ReferrerVendorsModal
                            referrerId={selectedReferrer?.id || ""}
                            allReferrals={referrals}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800"
                    >
                      {referrersCount} vendor
                      {referrersCount !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {referral.referredVendor.user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {referral.referredVendor.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ${referral.bonusAmount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        referral.payoutStatus === "paid"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        referral.payoutStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {referral.payoutStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(referral.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {referral.paidAt ? (
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(referral.paidAt), {
                          addSuffix: true,
                        })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingNote === referral.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add admin note..."
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveNote(referral.id)}
                            disabled={isUpdating}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNote(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {referral.adminNote || "No note"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNote(referral)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {referral.payoutStatus === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkPaid(referral)}
                        disabled={isUpdating}
                        className="w-full sm:w-auto"
                      >
                        <span>Mark as Paid</span>
                        <Check className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/**
 * Modal component to display all vendors referred by a specific referrer
 * Shows one-to-many relationship: one referrer can refer multiple vendors
 */
interface ReferrerVendorsModalProps {
  referrerId: string;
  allReferrals: Referral[];
}

function ReferrerVendorsModal({
  referrerId,
  allReferrals,
}: ReferrerVendorsModalProps) {
  // Filter all referrals for this specific referrer
  const referrerVendors = allReferrals.filter(
    (r) => r.referrer.id === referrerId,
  );

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Total Vendors Referred:</strong> {referrerVendors.length} |{" "}
          <strong>Total Bonus:</strong> $
          {referrerVendors
            .reduce((sum, r) => sum + r.bonusAmount, 0)
            .toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Referred Vendor</TableHead>
              <TableHead className="font-semibold text-right">
                Bonus Amount
              </TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Referred Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrerVendors.map((referral) => (
              <TableRow key={referral.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {referral.referredVendor.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {referral.referredVendor.user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ${referral.bonusAmount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      referral.payoutStatus === "paid" ? "default" : "secondary"
                    }
                    className={
                      referral.payoutStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {referral.payoutStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(referral.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
