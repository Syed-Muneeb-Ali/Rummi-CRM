"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar, Eye, EyeOff, Key } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ZodForm,
  type ZodFormRef,
  type FieldsConfig,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/zod-form";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  roleId: z.string().min(1, "Role is required"),
  franchiseId: z.string().optional(),
  baseSalary: z.number().positive("Salary must be positive"),
  effectiveFrom: z.string().min(1, "Effective date is required"),
  status: z.enum(["active", "inactive"]),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

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

interface User {
  _id: string;
  empId: string;
  name: string;
  email: string;
  phone: string;
  roleId: string | {
    _id: string;
    name: string;
    displayName?: string;
  };
  franchiseId?: string | {
    _id: string;
    name: string;
    franchiseCode?: string;
  };
  locationType: "ho" | "franchise";
  salary: {
    baseSalary: number;
    effectiveFrom: Date;
  };
  status: "active" | "inactive";
}

interface AttendanceRecord {
  _id: string;
  date: string;
  loginTime: string;
}

interface AttendanceStats {
  totalDays: number;
  thisMonth: number;
  thisYear: number;
}

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user: User | null;
  roles?: Role[];
  franchises?: Franchise[];
  initialTab?: "details" | "attendance" | "password";
}

export function EditUserModal({
  open,
  onClose,
  onSuccess,
  user,
  roles = [],
  franchises = [],
  initialTab = "details",
}: EditUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalDays: 0,
    thisMonth: 0,
    thisYear: 0,
  });
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const formRef = useRef<ZodFormRef<UpdateUserFormData>>(null);

  // Reset active tab when modal opens or initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Load user data into form when user changes or modal opens
  useEffect(() => {
    if (!user || !open) return;

    const resetForm = () => {
      if (!formRef.current) {
        // Ref not ready yet, try again shortly
        setTimeout(resetForm, 50);
        return;
      }

      // Extract string IDs from populated fields
      const roleId = typeof user.roleId === 'object' ? user.roleId._id : user.roleId;
      const franchiseId = typeof user.franchiseId === 'object'
        ? user.franchiseId._id
        : user.franchiseId || "";

      formRef.current.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        roleId,
        franchiseId,
        baseSalary: user.salary?.baseSalary || 0,
        effectiveFrom: user.salary?.effectiveFrom
          ? new Date(user.salary.effectiveFrom).toISOString().split("T")[0]
          : "",
        status: user.status,
      });
    };

    resetForm();
  }, [user, open]);

  // Field configurations for ZodForm
  const fieldsConfig: FieldsConfig<UpdateUserFormData> = {
    name: {
      label: "Full Name",
      placeholder: "Enter full name",
      colSpan: 1,
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "Enter email address",
      colSpan: 1,
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "Enter 10-digit phone",
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
    franchiseId: {
      type: "custom",
      colSpan: 1,
      showIf: () => user?.locationType === "franchise",
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
      placeholder: "Enter base salary",
      min: 0,
      step: 1000,
      colSpan: 1,
    },
    effectiveFrom: {
      type: "date",
      label: "Effective From",
      colSpan: 1,
    },
    status: {
      type: "select",
      label: "Account Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      colSpan: 2,
    },
  };

  const fetchAttendance = useCallback(async () => {
    if (!user) return;

    setIsLoadingAttendance(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `/api/hr/attendance/${user._id}?${params.toString()}`
      );
      if (!response.ok) {
        console.error("Failed to fetch attendance:", response.status);
        return;
      }
      const result = await response.json();
      setAttendanceRecords(result.attendance || []);
      setAttendanceStats(result.stats || { totalDays: 0, thisMonth: 0, thisYear: 0 });
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsLoadingAttendance(false);
    }
  }, [user, startDate, endDate]);

  // Fetch attendance when tab changes to attendance
  useEffect(() => {
    if (activeTab === "attendance" && user && open) {
      fetchAttendance();
    }
  }, [activeTab, user, open, fetchAttendance]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/hr/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          franchiseId:
            user.locationType === "franchise" ? data.franchiseId : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating user:", error);
      formRef.current?.setError("root", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Failed to update user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user || !newPassword) return;

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      setIsResettingPassword(true);

      const response = await fetch(`/api/hr/users/${user._id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      alert("Password reset successfully");
      setShowResetPassword(false);
      setNewPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setActiveTab("details");
      setAttendanceRecords([]);
      setStartDate("");
      setEndDate("");
      onClose();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Edit User Dialog */}
      <Dialog open={open && !showResetPassword} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit User - {user.empId}</DialogTitle>
            <DialogDescription>
              Update user information or view attendance history
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "details" | "attendance" | "password")}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attendance">
                <Calendar className="h-4 w-4 mr-2" />
                Attendance History
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent
              value="details"
              className="space-y-4 overflow-y-auto flex-1 mt-4"
            >
              <ZodForm
                schema={updateUserSchema}
                defaultValues={{
                  name: "",
                  email: "",
                  phone: "",
                  roleId: "",
                  franchiseId: "",
                  baseSalary: 0,
                  effectiveFrom: "",
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
                {/* Custom footer with Reset Password button */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResetPassword(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>

                  <div className="space-x-2">
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
                </div>
              </ZodForm>
            </TabsContent>

            {/* Attendance History Tab */}
            <TabsContent
              value="attendance"
              className="space-y-4 overflow-y-auto flex-1 mt-4"
            >
              {/* Date Range Filter */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <Button onClick={fetchAttendance} disabled={isLoadingAttendance}>
                  {isLoadingAttendance ? "Loading..." : "Filter"}
                </Button>
              </div>

              {/* Attendance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.thisMonth}
                    </div>
                    <p className="text-xs text-muted-foreground">days present</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">This Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.thisYear}
                    </div>
                    <p className="text-xs text-muted-foreground">days present</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">All Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {attendanceStats.totalDays}
                    </div>
                    <p className="text-xs text-muted-foreground">days present</p>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Records Table */}
              <div className="border rounded-md">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Date</th>
                        <th className="text-left p-3 text-sm font-medium">
                          First Login
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingAttendance ? (
                        <tr>
                          <td colSpan={2} className="text-center p-8 text-muted-foreground">
                            Loading attendance records...
                          </td>
                        </tr>
                      ) : attendanceRecords.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center p-8 text-muted-foreground">
                            No attendance records found
                          </td>
                        </tr>
                      ) : (
                        attendanceRecords.map((record) => (
                          <tr key={record._id} className="border-t">
                            <td className="p-3 text-sm">
                              {format(new Date(record.date), "EEE, MMM dd, yyyy")}
                            </td>
                            <td className="p-3 text-sm">
                              {format(new Date(record.loginTime), "hh:mm:ss a")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {user.name} ({user.empId})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetPassword(false);
                setNewPassword("");
              }}
              disabled={isResettingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={isResettingPassword || newPassword.length < 8}
            >
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
