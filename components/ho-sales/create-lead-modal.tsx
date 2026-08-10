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
import {
  ZodForm,
  type ZodFormRef,
  type FieldsConfig,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/common/zod-form";

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});

const createLeadSchema = z.object({
  buyerName: z.string().min(2, "Name must be at least 2 characters").max(100),
  buyerPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  buyerEmail: z.string().email().optional().or(z.literal("")),
  locationInterest: z.string().min(1, "Location interest is required"),
  source: z.enum(["walk_in", "referral", "campaign", "website", "other"], {
    message: "Source is required",
  }),
  buyerAddress: addressSchema,
});

type CreateLeadFormData = z.infer<typeof createLeadSchema>;

interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const emptyDefaults: CreateLeadFormData = {
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  locationInterest: "",
  source: undefined as unknown as CreateLeadFormData["source"],
  buyerAddress: { line1: "", line2: "", city: "", state: "", pincode: "" },
};

export function CreateLeadModal({ open, onClose, onSuccess }: CreateLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<ZodFormRef<CreateLeadFormData>>(null);

  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset(emptyDefaults);
    }
  }, [open]);

  const onSubmit = async (data: CreateLeadFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/ho-sales/franchise-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create franchise lead");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to create franchise lead",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const fieldsConfig: FieldsConfig<CreateLeadFormData> = {
    buyerName: { label: "Buyer Name", placeholder: "Enter buyer's full name", colSpan: 2 },
    buyerPhone: { label: "Phone", placeholder: "10-digit phone number", colSpan: 1 },
    buyerEmail: { label: "Email", placeholder: "Optional email", colSpan: 1 },
    locationInterest: { label: "Location Interest", placeholder: "City/area of interest", colSpan: 1 },
    source: {
      type: "select",
      label: "Source",
      options: [
        { label: "Walk In", value: "walk_in" },
        { label: "Referral", value: "referral" },
        { label: "Campaign", value: "campaign" },
        { label: "Website", value: "website" },
        { label: "Other", value: "other" },
      ],
      colSpan: 1,
    },
    buyerAddress: {
      type: "custom",
      colSpan: 2,
      render: ({ form }) => (
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormItem>
                <FormLabel>Address Line 1 <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Street address"
                    {...form.register("buyerAddress.line1")}
                  />
                </FormControl>
              </FormItem>
            </div>
            <div className="col-span-2">
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Apartment, suite, etc."
                    {...form.register("buyerAddress.line2")}
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
                  {...form.register("buyerAddress.city")}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="State"
                  {...form.register("buyerAddress.state")}
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
                  {...form.register("buyerAddress.pincode")}
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
          <DialogTitle>New Franchise Lead</DialogTitle>
          <DialogDescription>
            Add a new franchise prospect. A deal number will be auto-generated.
          </DialogDescription>
        </DialogHeader>

        <ZodForm
          schema={createLeadSchema}
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
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Lead"}
            </Button>
          </div>
        </ZodForm>
      </DialogContent>
    </Dialog>
  );
}
