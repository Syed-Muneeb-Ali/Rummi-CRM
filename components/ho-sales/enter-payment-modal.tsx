"use client";

import { useState, useRef, useEffect } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { S3FileUpload } from "@/components/common/s3-file-upload";
import {
  ZodForm,
  type ZodFormRef,
  type FieldsConfig,
  FormItem,
  FormLabel,
} from "@/components/common/zod-form";

const enterPaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  bankTransferRef: z.string().min(1, "Bank transfer reference is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  eRickshawFee: z.number().min(0),
  chargingPointFee: z.number().min(0),
  gpsSparesFee: z.number().min(0),
});

type EnterPaymentFormData = z.infer<typeof enterPaymentSchema>;

interface EnterPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  franchiseDealId: string | null;
  totalFee?: number;
}

const emptyDefaults: EnterPaymentFormData = {
  amount: 0,
  bankTransferRef: "",
  paymentDate: "",
  eRickshawFee: 0,
  chargingPointFee: 0,
  gpsSparesFee: 0,
};

export function EnterPaymentModal({
  open,
  onClose,
  onSuccess,
  franchiseDealId,
  totalFee,
}: EnterPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const formRef = useRef<ZodFormRef<EnterPaymentFormData>>(null);

  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset({
        ...emptyDefaults,
        amount: totalFee || 0,
      });
      setProofUrl(null);
    }
  }, [open, totalFee]);

  const onSubmit = async (data: EnterPaymentFormData) => {
    if (!franchiseDealId) return;
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/ho-sales/franchise-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          franchiseDealId,
          amount: data.amount,
          bankTransferRef: data.bankTransferRef,
          paymentDate: data.paymentDate,
          breakup: {
            eRickshawFee: data.eRickshawFee,
            chargingPointFee: data.chargingPointFee,
            gpsSparesFee: data.gpsSparesFee,
          },
          proofDocument: proofUrl ? { fileUrl: proofUrl } : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to record payment");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to record payment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const fieldsConfig: FieldsConfig<EnterPaymentFormData> = {
    amount: { type: "number", label: "Total Amount Received", colSpan: 2 },
    bankTransferRef: { label: "Bank Transfer Reference", placeholder: "UTR / reference number", colSpan: 1 },
    paymentDate: { type: "date", label: "Payment Date", colSpan: 1 },
    eRickshawFee: { type: "number", label: "E-Rickshaw Fee", colSpan: 1 },
    chargingPointFee: { type: "number", label: "Charging Point Fee", colSpan: 1 },
    gpsSparesFee: { type: "number", label: "GPS / Spares Fee", colSpan: 1 },
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enter Franchise Payment</DialogTitle>
          <DialogDescription>
            Record the bank transfer received from the franchise buyer.
          </DialogDescription>
        </DialogHeader>

        <ZodForm
          schema={enterPaymentSchema}
          defaultValues={emptyDefaults}
          onSubmit={onSubmit}
          formRef={formRef}
          fields={fieldsConfig}
          layout="grid"
          gridCols={2}
          gap="md"
          isSubmitting={isSubmitting}
          showSubmitButton={false}
          showCancelButton={false}
        >
          <FormItem>
            <FormLabel>Proof Document (optional)</FormLabel>
            <S3FileUpload
              onUploaded={({ urls }) => setProofUrl(urls[0] ?? null)}
              accept={{ "image/*": [".png", ".jpg", ".jpeg"], "application/pdf": [".pdf"] }}
              label={proofUrl ? "Replace proof" : "Upload proof"}
            />
          </FormItem>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !franchiseDealId}>
              {isSubmitting ? "Saving..." : "Record Payment"}
            </Button>
          </div>
        </ZodForm>
      </DialogContent>
    </Dialog>
  );
}
