"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Ban,
  Building2,
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
import { CreateFranchiseModal } from "@/components/hr/create-franchise-modal";
import { EditFranchiseModal } from "@/components/hr/edit-franchise-modal";

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
  ownerId: string | {
    _id: string;
    name: string;
    empId: string;
    email?: string;
    phone?: string;
  };
  address: Address;
  status: "active" | "suspended";
  activatedAt: Date;
  createdAt: Date;
}

interface Owner {
  _id: string;
  name: string;
  empId: string;
}

function FranchisesManagementContent() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);

  // Define columns
  const columns: ColumnDef<Franchise>[] = [
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
      accessorKey: "franchiseCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.getValue("franchiseCode")}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "dealType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deal Type" />
      ),
      cell: ({ row }) => {
        const dealType = row.getValue("dealType") as string;
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          A: "default",
          B: "secondary",
          C: "outline",
        };
        const descriptions: Record<string, string> = {
          A: "3 E-Rickshaws",
          B: "1 E-Rickshaw",
          C: "2 E-Rickshaws",
        };
        return (
          <Badge variant={variants[dealType] || "default"}>
            Type {dealType} ({descriptions[dealType]})
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "ownerId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Owner" />
      ),
      cell: ({ row }) => {
        const owner = row.original.ownerId;
        if (typeof owner === "object" && owner !== null) {
          return (
            <div>
              <div className="font-medium">{owner.name}</div>
              <div className="text-sm text-muted-foreground">{owner.empId}</div>
            </div>
          );
        }
        return <span className="text-muted-foreground">Unknown</span>;
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      cell: ({ row }) => {
        const address = row.original.address;
        return (
          <div className="max-w-[200px]">
            <div className="truncate">{address.city}, {address.state}</div>
            <div className="text-sm text-muted-foreground">{address.pincode}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "active" ? "default" : "destructive"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "activatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Activated" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("activatedAt");
        if (!date) return <span className="text-muted-foreground">-</span>;
        return format(new Date(date as string), "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const franchise = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedFranchise(franchise);
                  setEditModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleSuspend(franchise._id)}
                disabled={franchise.status === "suspended"}
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchFranchises = async () => {
    try {
      const response = await fetch("/api/hr/franchises?limit=100");
      if (!response.ok) {
        console.error("Failed to fetch franchises:", response.status);
        return;
      }
      const data = await response.json();
      setFranchises(data.franchises || []);
    } catch (error) {
      console.error("Error fetching franchises:", error);
    }
  };

  const fetchOwners = async () => {
    try {
      // Fetch users who can be franchise owners
      const response = await fetch("/api/hr/users?limit=100");
      if (!response.ok) {
        console.error("Failed to fetch users:", response.status);
        return;
      }
      const data = await response.json();
      // Map to owner format
      const ownerList = (data.users || []).map((user: { _id: string; name: string; empId: string }) => ({
        _id: user._id,
        name: user.name,
        empId: user.empId,
      }));
      setOwners(ownerList);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const handleSuspend = async (franchiseId: string) => {
    if (!confirm("Are you sure you want to suspend this franchise?")) return;

    try {
      const response = await fetch(`/api/hr/franchises/${franchiseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to suspend franchise");
      }

      fetchFranchises();
    } catch (error) {
      console.error("Error suspending franchise:", error);
      alert("Failed to suspend franchise");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFranchises(), fetchOwners()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter options for DataTable
  const filterableColumns = [
    {
      id: "dealType",
      title: "Deal Type",
      options: [
        { label: "Type A (3 E-Rickshaws)", value: "A" },
        { label: "Type B (1 E-Rickshaw)", value: "B" },
        { label: "Type C (2 E-Rickshaws)", value: "C" },
      ],
    },
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Franchises Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage franchise entities and their details
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Franchise
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={franchises}
        searchKey="name"
        searchPlaceholder="Search franchises..."
        filterableColumns={filterableColumns}
        loading={loading}
      />

      {/* Modals */}
      <CreateFranchiseModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchFranchises}
        owners={owners}
      />

      <EditFranchiseModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedFranchise(null);
        }}
        onSuccess={fetchFranchises}
        franchise={selectedFranchise}
        owners={owners}
      />
    </div>
  );
}

export default function FranchisesPage() {
  return (
    <ProtectedRoute requiredPermission="canManageFranchises">
      <FranchisesManagementContent />
    </ProtectedRoute>
  );
}
