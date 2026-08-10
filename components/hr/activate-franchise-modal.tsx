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

const activateFranchiseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  ownerId: z.string().min(1, "Owner is required"),
  address: addressSchema,
});

type ActivateFranchiseFormData = z.infer<typeof activateFranchiseSchema>;

interface Owner {
  _id: string;
  name: string;
  empId: string;
}

interface ActivatableDeal {
  _id: string;
  dealNumber: string;
  buyerName: string;
  dealType?: string;
  buyerAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface ActivateFranchiseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  deal: ActivatableDeal | null;
  owners: Owner[];
}

export function ActivateFranchiseModal({ open, onClose, onSuccess, deal, owners }: ActivateFranchiseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<ZodFormRef<ActivateFranchiseFormData>>(null);

  useEffect(() => {
    if (open && deal && formRef.current) {
      formRef.current.reset({
        name: `${deal.buyerName} Franchise`,
        ownerId: "",
        address: {
          line1: deal.buyerAddress.line1,
          line2: deal.buyerAddress.line2 || "",
          city: deal.buyerAddress.city,
          state: deal.buyerAddress.state,
          pincode: deal.buyerAddress.pincode,
        },
      });
    }
  }, [open, deal]);

  const onSubmit = async (data: ActivateFranchiseFormData) => {
    if (!deal) return;
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/hr/franchises/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ franchiseDealId: deal._id, ...data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to activate franchise");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to activate franchise",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const fieldsConfig: FieldsConfig<ActivateFranchiseFormData> = {
    name: { label: "Franchise Name", colSpan: 2 },
    ownerId: {
      type: "custom",
      colSpan: 2,
      render: ({ field }) => (
        <FormItem>
          <FormLabel>Owner <span className="text-destructive">*</span></FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner._id} value={owner._id}>
                  {owner.name} ({owner.empId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    address: {
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
                    {...form.register("address.line1")}
                  />
                </FormControl>
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>City <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("address.city")}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register("address.state")}
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Pincode <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={6}
                  {...form.register("address.pincode")}
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
          <DialogTitle>Activate Franchise</DialogTitle>
          <DialogDescription>
            {deal ? `From deal ${deal.dealNumber} (Type ${deal.dealType})` : ""} - creates the active franchise
            entity, generates a franchise code, and links the selected owner.
          </DialogDescription>
        </DialogHeader>

        {deal && (
          <ZodForm
            schema={activateFranchiseSchema}
            defaultValues={{
              name: `${deal.buyerName} Franchise`,
              ownerId: "",
              address: deal.buyerAddress,
            }}
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
                {isSubmitting ? "Activating..." : "Activate Franchise"}
              </Button>
            </div>
          </ZodForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
