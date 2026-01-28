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

const createFranchiseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  dealType: z.enum(["A", "B", "C"], { message: "Deal type is required" }),
  ownerId: z.string().min(1, "Owner is required"),
  address: addressSchema,
});

type CreateFranchiseFormData = z.infer<typeof createFranchiseSchema>;

interface Owner {
  _id: string;
  name: string;
  empId: string;
}

interface CreateFranchiseModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  owners?: Owner[];
}

export function CreateFranchiseModal({
  open,
  onClose,
  onSuccess,
  owners = [],
}: CreateFranchiseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<ZodFormRef<CreateFranchiseFormData>>(null);

  useEffect(() => {
    if (open && formRef.current) {
      formRef.current.reset({
        name: "",
        dealType: undefined,
        ownerId: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
        },
      });
    }
  }, [open]);

  const onSubmit = async (data: CreateFranchiseFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/hr/franchises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create franchise");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating franchise:", error);
      formRef.current?.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to create franchise",
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

  const fieldsConfig: FieldsConfig<CreateFranchiseFormData> = {
    name: {
      label: "Franchise Name",
      placeholder: "Enter franchise name",
      colSpan: 2,
    },
    dealType: {
      type: "select",
      label: "Deal Type",
      options: [
        { label: "Type A (3 E-Rickshaws)", value: "A" },
        { label: "Type B (1 E-Rickshaw)", value: "B" },
        { label: "Type C (2 E-Rickshaws)", value: "C" },
      ],
      colSpan: 1,
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
          <DialogTitle>Create New Franchise</DialogTitle>
          <DialogDescription>
            Add a new franchise to the system. A franchise code will be auto-generated.
          </DialogDescription>
        </DialogHeader>

        <ZodForm
          schema={createFranchiseSchema}
          defaultValues={{
            name: "",
            dealType: undefined,
            ownerId: "",
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              pincode: "",
            },
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
              {isSubmitting ? "Creating..." : "Create Franchise"}
            </Button>
          </div>
        </ZodForm>
      </DialogContent>
    </Dialog>
  );
}
