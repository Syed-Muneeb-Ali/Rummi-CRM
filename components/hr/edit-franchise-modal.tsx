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

const updateFranchiseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  ownerId: z.string().min(1, "Owner is required"),
  address: addressSchema,
  status: z.enum(["active", "suspended"]),
});

type UpdateFranchiseFormData = z.infer<typeof updateFranchiseSchema>;

interface Owner {
  _id: string;
  name: string;
  empId: string;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Franchise {
  _id: string;
  franchiseCode: string;
  name: string;
  dealType: "A" | "B" | "C";
  ownerId: string | { _id: string; name: string; empId: string };
  address: Address;
  status: "active" | "suspended";
  activatedAt: Date;
  createdAt: Date;
}

interface EditFranchiseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  franchise: Franchise | null;
  owners?: Owner[];
}

export function EditFranchiseModal({
  open,
  onClose,
  onSuccess,
  franchise,
  owners = [],
}: EditFranchiseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<ZodFormRef<UpdateFranchiseFormData>>(null);

  // Load franchise data into form when franchise changes or modal opens
  useEffect(() => {
    if (!franchise || !open) return;

    const resetForm = () => {
      if (!formRef.current) {
        setTimeout(resetForm, 50);
        return;
      }

      const ownerId = typeof franchise.ownerId === 'object' 
        ? franchise.ownerId._id 
        : franchise.ownerId;

      formRef.current.reset({
        name: franchise.name,
        ownerId,
        address: {
          line1: franchise.address.line1,
          line2: franchise.address.line2 || "",
          city: franchise.address.city,
          state: franchise.address.state,
          pincode: franchise.address.pincode,
        },
        status: franchise.status,
      });
    };

    resetForm();
  }, [franchise, open]);

  const onSubmit = async (data: UpdateFranchiseFormData) => {
    if (!franchise) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/hr/franchises/${franchise._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update franchise");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating franchise:", error);
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to update franchise",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!franchise) return null;

  const fieldsConfig: FieldsConfig<UpdateFranchiseFormData> = {
    name: {
      label: "Franchise Name",
      placeholder: "Enter franchise name",
      colSpan: 2,
    },
    ownerId: {
      type: "custom",
      colSpan: 1,
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
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
      colSpan: 1,
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Street address"
                    {...form.register("address.line1")}
                  />
                </FormControl>
                {(form.formState.errors.address as { line1?: { message?: string } })?.line1 && (
                  <p className="text-sm font-medium text-destructive">
                    {(form.formState.errors.address as { line1?: { message?: string } })?.line1?.message}
                  </p>
                )}
              </FormItem>
            </div>
            <div className="col-span-2">
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Apartment, suite, etc."
                    {...form.register("address.line2")}
                  />
                </FormControl>
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>City <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="City"
                  {...form.register("address.city")}
                />
              </FormControl>
              {(form.formState.errors.address as { city?: { message?: string } })?.city && (
                <p className="text-sm font-medium text-destructive">
                  {(form.formState.errors.address as { city?: { message?: string } })?.city?.message}
                </p>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>State <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="State"
                  {...form.register("address.state")}
                />
              </FormControl>
              {(form.formState.errors.address as { state?: { message?: string } })?.state && (
                <p className="text-sm font-medium text-destructive">
                  {(form.formState.errors.address as { state?: { message?: string } })?.state?.message}
                </p>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>Pincode <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  {...form.register("address.pincode")}
                />
              </FormControl>
              {(form.formState.errors.address as { pincode?: { message?: string } })?.pincode && (
                <p className="text-sm font-medium text-destructive">
                  {(form.formState.errors.address as { pincode?: { message?: string } })?.pincode?.message}
                </p>
              )}
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
          <DialogTitle>Edit Franchise - {franchise.franchiseCode}</DialogTitle>
          <DialogDescription>
            Update franchise information. Deal Type: {franchise.dealType}
          </DialogDescription>
        </DialogHeader>

        <ZodForm
          schema={updateFranchiseSchema}
          defaultValues={{
            name: "",
            ownerId: "",
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              pincode: "",
            },
            status: "active",
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
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </ZodForm>
      </DialogContent>
    </Dialog>
  );
}
