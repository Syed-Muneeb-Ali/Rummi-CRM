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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { S3FileUpload } from "@/components/common/s3-file-upload";
import {
  ZodForm,
  type ZodFormRef,
  type FieldsConfig,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/zod-form";

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});

const createRentAgreementSchema = z.object({
  franchiseId: z.string().min(1, "Franchise is required"),
  landlordName: z.string().min(1, "Landlord name is required"),
  landlordPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  landlordEmail: z.string().email().optional().or(z.literal("")),
  monthlyRent: z.number().positive("Monthly rent must be positive"),
  securityDeposit: z.number().min(0).optional(),
  agreementStartDate: z.string().min(1, "Start date is required"),
  agreementEndDate: z.string().min(1, "End date is required"),
  annualIncrementPercent: z.number().min(0),
  paidBy: z.enum(["company", "franchise_owner"], { message: "Required" }),
  propertyAddress: addressSchema,
});

type RentAgreementFormData = z.infer<typeof createRentAgreementSchema>;

interface Franchise {
  _id: string;
  name: string;
  franchiseCode: string;
}

interface RentAgreementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  franchises: Franchise[];
}

const emptyDefaults: RentAgreementFormData = {
  franchiseId: "",
  landlordName: "",
  landlordPhone: "",
  landlordEmail: "",
  monthlyRent: 0,
  securityDeposit: 0,
  agreementStartDate: "",
  agreementEndDate: "",
  annualIncrementPercent: 5,
  paidBy: undefined as unknown as RentAgreementFormData["paidBy"],
  propertyAddress: { line1: "", line2: "", city: "", state: "", pincode: "" },
};

export function RentAgreementModal({ open, onClose, onSuccess, franchises }: RentAgreementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const formRef = useRef<ZodFormRef<RentAgreementFormData>>(null);

  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset(emptyDefaults);
      setDocUrl(null);
    }
  }, [open]);

  const onSubmit = async (data: RentAgreementFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/ho-sales/rent-agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          agreementDocument: docUrl ? { fileUrl: docUrl } : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create rent agreement");
      onClose();
      onSuccess?.();
    } catch (error) {
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to create rent agreement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const fieldsConfig: FieldsConfig<RentAgreementFormData> = {
    franchiseId: {
      type: "custom",
      colSpan: 2,
      render: ({ field }) => (
        <FormItem>
          <FormLabel>Franchise <span className="text-destructive">*</span></FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select franchise" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {franchises.map((f) => (
                <SelectItem key={f._id} value={f._id}>
                  {f.name} ({f.franchiseCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    landlordName: { label: "Landlord Name", colSpan: 1 },
    landlordPhone: { label: "Landlord Phone", colSpan: 1 },
    landlordEmail: { label: "Landlord Email", colSpan: 1 },
    monthlyRent: { type: "number", label: "Monthly Rent", colSpan: 1 },
    securityDeposit: { type: "number", label: "Security Deposit", colSpan: 1 },
    annualIncrementPercent: { type: "number", label: "Annual Increment %", colSpan: 1 },
    agreementStartDate: { type: "date", label: "Start Date", colSpan: 1 },
    agreementEndDate: { type: "date", label: "End Date", colSpan: 1 },
    paidBy: {
      type: "select",
      label: "Rent Paid By",
      options: [
        { label: "Company", value: "company" },
        { label: "Franchise Owner", value: "franchise_owner" },
      ],
      colSpan: 1,
    },
    propertyAddress: {
      type: "custom",
      colSpan: 2,
      render: ({ form }) => (
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Property Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormItem>
                <FormLabel>Address Line 1 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Street address"
                    {...form.register("propertyAddress.line1")}
                  />
                </FormControl>
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>City <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="City"
                  {...form.register("propertyAddress.city")}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="State"
                  {...form.register("propertyAddress.state")}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Pincode <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  {...form.register("propertyAddress.pincode")}
                />
              </FormControl>
            </FormItem>
          </div>
        </div>
      ),
    },
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Rent Agreement</DialogTitle>
          <DialogDescription>Track a franchise location&apos;s rent agreement.</DialogDescription>
        </DialogHeader>

        <ZodForm
          schema={createRentAgreementSchema}
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
            <FormLabel>Agreement Document (optional)</FormLabel>
            <S3FileUpload
              onUploaded={({ urls }) => setDocUrl(urls[0] ?? null)}
              accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] }}
              label={docUrl ? "Replace document" : "Upload document"}
            />
          </FormItem>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Agreement"}
            </Button>
          </div>
        </ZodForm>
      </DialogContent>
    </Dialog>
  );
}
