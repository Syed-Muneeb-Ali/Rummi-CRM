"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Calendar,
  Key,
  Trash,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { CreateUserModal } from "@/components/hr/create-user-modal";
import { EditUserModal } from "@/components/hr/edit-user-modal";

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
  createdAt: Date;
}

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

function UsersManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalInitialTab, setEditModalInitialTab] = useState<"details" | "attendance" | "password">("details");

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "empId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emp ID" />
      ),
      cell: ({ row }) => (
        <div className="font-mono font-medium">{row.getValue("empId")}</div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      enableSorting: false,
    },
    {
      id: "role",
      accessorFn: (row) => typeof row.roleId === 'object' ? row.roleId?.displayName || row.roleId?.name : null,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const roleData = row.original.roleId;
        const displayName = typeof roleData === 'object'
          ? (roleData?.displayName || roleData?.name)
          : "N/A";
        return <Badge variant="outline">{displayName}</Badge>;
      },
      filterFn: (row, id, value) => {
        const roleId = typeof row.original.roleId === 'object'
          ? row.original.roleId._id
          : row.original.roleId;
        return value.includes(roleId);
      },
    },
    {
      accessorKey: "locationType",
      header: "Location",
      cell: ({ row }) => (
        <div>
          <Badge
            variant={
              row.getValue("locationType") === "ho" ? "default" : "secondary"
            }
          >
            {row.getValue("locationType") === "ho"
              ? "Head Office"
              : "Franchise"}
          </Badge>
          {typeof row.original.franchiseId === 'object' && row.original.franchiseId && (
            <div className="text-xs text-muted-foreground mt-1">
              {row.original.franchiseId.name}
            </div>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue("status") === "active" ? "default" : "destructive"
          }
        >
          {row.getValue("status")}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) =>
        format(new Date(row.getValue("createdAt")), "MMM dd, yyyy"),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setEditModalInitialTab("details");
                  setEditModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setEditModalInitialTab("attendance");
                  setEditModalOpen(true);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Attendance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleStatus(user)}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                {user.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchFranchises();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hr/users?limit=100");
      if (!response.ok) {
        console.error("Failed to fetch users:", response.status);
        return;
      }
      const result = await response.json();
      setUsers(result.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        console.warn("Roles API not available");
        return;
      }
      const result = await response.json();
      setRoles(result.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchFranchises = async () => {
    try {
      const response = await fetch("/api/franchises");
      if (!response.ok) {
        console.warn("Franchises API not available");
        return;
      }
      const result = await response.json();
      setFranchises(result.franchises || []);
    } catch (error) {
      console.error("Error fetching franchises:", error);
    }
  };

  const handleResetPassword = async (user: User) => {
    const newPassword = prompt(
      `Enter new password for ${user.name} (${user.empId}):`
    );

    if (!newPassword) return;

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch(`/api/hr/users/${user._id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        alert("Password reset successfully");
      } else {
        const result = await response.json();
        alert(result.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const confirmMessage =
      newStatus === "inactive"
        ? `Are you sure you want to deactivate ${user.name}? They will no longer be able to log in.`
        : `Are you sure you want to activate ${user.name}?`;

    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/hr/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Users Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage employees across all locations
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchKey="globalFilter"
        searchPlaceholder="Search by name, email, phone, or emp ID..."
        filterableColumns={[
          {
            id: "role",
            title: "Role",
            options: roles.map((role) => ({
              label: role.displayName || role.name,
              value: role._id,
            })),
          },
          {
            id: "locationType",
            title: "Location",
            options: [
              { label: "Head Office", value: "ho" },
              { label: "Franchise", value: "franchise" },
            ],
          },
          {
            id: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        initialPageSize={10}
      />

      {/* Modals */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchUsers}
        roles={roles}
        franchises={franchises}
      />

      <EditUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={fetchUsers}
        user={selectedUser}
        roles={roles}
        franchises={franchises}
        initialTab={editModalInitialTab}
      />
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <ProtectedRoute requiredPermission="canManageUsers">
      <UsersManagementContent />
    </ProtectedRoute>
  );
}
