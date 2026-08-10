"use client";

import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format, differenceInCalendarDays } from "date-fns";
import { Plus, AlertTriangle } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { RentAgreementModal } from "@/components/ho-sales/rent-agreement-modal";

interface Franchise {
  _id: string;
  name: string;
  franchiseCode: string;
}

interface RentAgreementRow {
  _id: string;
  franchiseId: Franchise | string;
  landlordName: string;
  landlordPhone: string;
  monthlyRent: number;
  agreementEndDate: string;
  paidBy: "company" | "franchise_owner";
  status: "active" | "expired" | "renewed";
}

function RentAgreementsContent() {
  const [agreements, setAgreements] = useState<RentAgreementRow[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ho-sales/rent-agreements");
      if (res.ok) {
        const data = await res.json();
        setAgreements(data.agreements || []);
      }
    } catch (error) {
      console.error("Error fetching rent agreements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFranchises = useCallback(async () => {
    try {
      const res = await fetch("/api/franchises");
      if (res.ok) {
        const data = await res.json();
        setFranchises(data.franchises || []);
      }
    } catch (error) {
      console.error("Error fetching franchises:", error);
    }
  }, []);

  useEffect(() => {
    fetchAgreements();
    fetchFranchises();
  }, [fetchAgreements, fetchFranchises]);

  const expiringSoon = agreements.filter(
    (a) => a.status === "active" && differenceInCalendarDays(new Date(a.agreementEndDate), new Date()) <= 30
  );

  const columns: ColumnDef<RentAgreementRow>[] = [
    {
      accessorKey: "franchiseId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Franchise" />,
      cell: ({ row }) => {
        const f = row.original.franchiseId;
        return typeof f === "object" ? `${f.name} (${f.franchiseCode})` : "-";
      },
    },
    {
      accessorKey: "landlordName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Landlord" />,
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("landlordName")}</div>
          <div className="text-sm text-muted-foreground">{row.original.landlordPhone}</div>
        </div>
      ),
    },
    {
      accessorKey: "monthlyRent",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Monthly Rent" />,
      cell: ({ row }) => `₹${(row.getValue("monthlyRent") as number).toLocaleString("en-IN")}`,
    },
    {
      accessorKey: "agreementEndDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry" />,
      cell: ({ row }) => {
        const endDate = new Date(row.getValue("agreementEndDate") as string);
        const days = differenceInCalendarDays(endDate, new Date());
        const expiringSoon = row.original.status === "active" && days <= 30;
        return (
          <div className="flex items-center gap-2">
            <span>{format(endDate, "MMM dd, yyyy")}</span>
            {expiringSoon && (
              <Badge variant="destructive" className="text-xs">
                {days <= 0 ? "Expired" : `${days}d left`}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "paidBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Paid By" />,
      cell: ({ row }) => (
        <span className="capitalize">{(row.getValue("paidBy") as string).replace("_", " ")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Rent Agreements</h2>
          <p className="text-muted-foreground mt-1">Track franchise location rent agreements and renewals</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </div>

      {expiringSoon.length > 0 && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-2 py-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            {expiringSoon.length} agreement(s) expiring within 30 days.
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={agreements} loading={loading} />

      <RentAgreementModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchAgreements}
        franchises={franchises}
      />
    </div>
  );
}

export default function RentAgreementsPage() {
  return (
    <ProtectedRoute requiredPermission="canManageFranchises">
      <RentAgreementsContent />
    </ProtectedRoute>
  );
}
