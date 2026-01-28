"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Card, CardContent } from "@/components/ui/card";
import { PasswordGeneratorInput } from "./password-generator-input";
import {
  ZodForm,
  type ZodFormRef,
  type FieldsConfig,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/zod-form";

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  roleId: z.string().min(1, "Role is required"),
  locationType: z.enum(["ho", "franchise"]),
  franchiseId: z.string().optional(),
  baseSalary: z.coerce.number().positive("Salary must be positive"),
  effectiveFrom: z.string().min(1, "Effective date is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface Role {
  _id: string;
  name: string;
  displayName?: string;
}

interface Franchise {
  _id: string;
  name: string;
  location?: string;
}

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roles?: Role[];
  franchises?: Franchise[];
}

interface NewUser {
  empId: string;
  email: string;
  name: string;
}

export function CreateUserModal({
  open,
  onClose,
  onSuccess,
  roles = [],
  franchises = [],
}: CreateUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [newUser, setNewUser] = useState<NewUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const formRef = useRef<ZodFormRef<CreateUserFormData>>(null);

  // Field configurations for ZodForm
  const fieldsConfig: FieldsConfig<CreateUserFormData> = {
    name: {
      label: "Full Name",
      placeholder: "John Doe",
      colSpan: 1,
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "john@example.com",
      colSpan: 1,
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "9876543210",
      maxLength: 10,
      colSpan: 2,
    },
    roleId: {
      type: "custom",
      colSpan: 1,
      render: ({ field }) => (
        <FormItem>
          <FormLabel>Role <span className="text-destructive">*</span></FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role._id} value={role._id}>
                  {role.displayName || role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    locationType: {
      type: "custom",
      colSpan: 1,
      render: ({ field }) => (
        <FormItem>
          <FormLabel>Location Type <span className="text-destructive">*</span></FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="ho">Head Office</SelectItem>
              <SelectItem value="franchise">Franchise</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    franchiseId: {
      type: "custom",
      colSpan: 2,
      showIf: (values) => values.locationType === "franchise",
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
              {franchises.map((franchise) => (
                <SelectItem key={franchise._id} value={franchise._id}>
                  {franchise.name}
                  {franchise.location && ` - ${franchise.location}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      ),
    },
    baseSalary: {
      type: "number",
      label: "Base Salary (₹)",
      placeholder: "50000",
      min: 0,
      step: 1000,
      colSpan: 1,
    },
    effectiveFrom: {
      type: "date",
      label: "Effective From",
      colSpan: 1,
    },
    password: {
      type: "custom",
      colSpan: 2,
      render: ({ field, form }) => (
        <FormItem>
          <FormControl>
            <PasswordGeneratorInput
              name="password"
              value={field.value as string}
              onChange={field.onChange}
              onGenerate={(pwd) => form.setValue("password", pwd)}
              label="Password"
              required
            />
          </FormControl>
          <FormMessage />
          <p className="text-xs text-muted-foreground mt-2">
            The user will use this password for their first login. They can change it later.
          </p>
        </FormItem>
      ),
    },
  };

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsSubmitting(true);

      // Validate franchise if location type is franchise
      if (data.locationType === "franchise" && !data.franchiseId) {
        formRef.current?.setError("franchiseId", {
          type: "manual",
          message: "Franchise is required for franchise location",
        });
        return;
      }

      const response = await fetch("/api/hr/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          franchiseId:
            data.locationType === "franchise" ? data.franchiseId : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      // Store credentials for display
      setGeneratedPassword(data.password);
      setNewUser({
        empId: result.user.empId,
        email: result.user.email,
        name: result.user.name,
      });

      // Show credentials modal
      setShowCredentials(true);

      // Reset form
      formRef.current?.reset();
    } catch (error) {
      console.error("Error creating user:", error);
      formRef.current?.setError("root", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Failed to create user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (newUser) {
      const text = `Employee ID: ${newUser.empId}\nEmail: ${newUser.email}\nPassword: ${generatedPassword}`;
      navigator.clipboard.writeText(text);
    }
  };

  const closeAndRefresh = () => {
    setShowCredentials(false);
    setNewUser(null);
    setGeneratedPassword("");
    onClose();
    onSuccess?.();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      formRef.current?.reset();
      onClose();
    }
  };

  return (
    <>
      {/* Create User Form Dialog */}
      <Dialog open={open && !showCredentials} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new employee to the system. An empID will be auto-generated.
            </DialogDescription>
          </DialogHeader>

          <ZodForm
            schema={createUserSchema}
            defaultValues={{
              name: "",
              email: "",
              phone: "",
              roleId: "",
              locationType: "ho",
              franchiseId: "",
              baseSalary: 0,
              effectiveFrom: new Date().toISOString().split("T")[0],
              password: "",
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
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </ZodForm>
        </DialogContent>
      </Dialog>

      {/* Success Credentials Dialog */}
      <Dialog open={showCredentials} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Created Successfully</DialogTitle>
            <DialogDescription>
              Save these credentials. The password will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Emp ID:</span>
                    <span className="font-semibold">{newUser?.empId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-semibold">{newUser?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{newUser?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="font-semibold">{generatedPassword}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={copyCredentials}
              variant="outline"
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Credentials
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={closeAndRefresh}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
