"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Award, Check } from "lucide-react";

export interface UserReferral {
  userName: string;
  email: string;
  totalReferralVendors: number;
  convertedSubscriptions: number;
  bonus: string;
}

interface AllUserReferralsTableProps {
  referrals: UserReferral[];
  isLoading?: boolean;
  onMarkPaid?: (referral: UserReferral) => void;
  isMarking?: boolean;
}

export function AllUserReferralsTable({
  referrals,
  isLoading = false,
  onMarkPaid,
  isMarking = false,
}: AllUserReferralsTableProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading referrals...</p>
        </div>
      </Card>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Users className="w-12 h-12 text-gray-300" />
          <p className="text-gray-500 text-lg">No user referrals found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-900">
              User Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Email</TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Total Referral Vendors
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Converted Subscriptions
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-900">
              Bonus ($)
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-900">
              Mark as Paid
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral, index) => (
            <TableRow
              key={`${referral.email}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                {referral.userName}
              </TableCell>
              <TableCell className="text-gray-600">{referral.email}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <Badge variant="secondary" className="bg-blue-50">
                    {referral.totalReferralVendors}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <Badge variant="secondary" className="bg-green-50">
                    {referral.convertedSubscriptions}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    ${parseFloat(referral.bonus).toFixed(2)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => onMarkPaid?.(referral)}
                  disabled={isMarking}
                  variant="outline"
                  size="sm"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
