"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PendingPayout } from "@/store/referralSlice";
import { useAppDispatch } from "@/store";
import {
  updatePayoutInList,
  setMarkingError,
  setMarkingPaid,
} from "@/store/referralSlice";

const markAsPaidSchema = z.object({
  adminNote: z.string(),
});

type MarkAsPaidFormData = {
  adminNote: string;
};

interface MarkAsPaidModalProps {
  isOpen: boolean;
  referral: PendingPayout | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MarkAsPaidModal({
  isOpen,
  referral,
  isLoading,
  error,
  onClose,
  onSuccess,
}: MarkAsPaidModalProps) {
  const dispatch = useAppDispatch();
  const form = useForm<MarkAsPaidFormData>({
    resolver: zodResolver(markAsPaidSchema),
    defaultValues: {
      adminNote: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  if (!referral) {
    return null;
  }

  const onSubmit = async (data: MarkAsPaidFormData) => {
    dispatch(setMarkingPaid(true));

    try {
      const confirmed = await Swal.fire({
        title: "Confirm Payout",
        html: `
          <div class="space-y-4">
            <p><strong>Referrer:</strong> ${referral.referrer.fullName}</p>
            <p><strong>Amount:</strong> $${referral.bonusAmount.toFixed(2)}</p>
            <p><strong>Note:</strong> ${data.adminNote || "No note provided"}</p>
            <p class="text-red-600 font-semibold">This action cannot be undone.</p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, Mark as Paid",
        cancelButtonText: "Cancel",
      });

      if (!confirmed.isConfirmed) {
        dispatch(setMarkingPaid(false));
        return;
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Demo mode: directly update Redux state
      dispatch(updatePayoutInList(referral.id));
      dispatch(setMarkingPaid(false));

      toast.success(
        `Payout marked as paid for ${referral.referrer.fullName}. Bonus balance updated.`,
      );

      form.reset();
      onClose();
      onSuccess();
    } catch (err) {
      const errorMessage = "Failed to mark referral as paid";
      dispatch(setMarkingError(errorMessage));
      dispatch(setMarkingPaid(false));
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Referral as Paid</DialogTitle>
          <DialogDescription>
            Process payout for {referral.referrer.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Referrer</p>
              <p className="font-semibold text-gray-900">
                {referral.referrer.fullName}
              </p>
              <p className="text-xs text-gray-500">{referral.referrer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bonus Amount</p>
              <p className="font-semibold text-green-600">
                ${referral.bonusAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="adminNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Transaction ID: TXN-12345, Bank Transfer Reference, etc."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a note for record keeping (e.g., transaction ID, bank
                      reference)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Processing..." : "Mark as Paid"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
