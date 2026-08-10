"use client";

import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Check, Flag } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PaymentRow {
  _id: string;
  amount: number;
  bankTransferRef: string;
  paymentDate: string;
  breakup: { eRickshawFee: number; chargingPointFee: number; gpsSparesFee: number };
  status: "pending" | "verified" | "flagged";
  flagReason?: string;
  franchiseDealId: {
    dealNumber: string;
    buyerName: string;
    buyerPhone: string;
    dealType?: string;
    fdmId?: { name: string; empId: string };
  };
  createdAt: string;
}

function PaymentsQueueContent() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"pending" | "all">("pending");
  const [flagTarget, setFlagTarget] = useState<PaymentRow | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ho-sales/franchise-payments?status=${statusFilter}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  async function handleVerify(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/ho-sales/franchise-payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to verify payment");
      }
      fetchPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to verify payment");
    } finally {
      setBusy(false);
    }
  }

  async function handleFlag() {
    if (!flagTarget || !flagReason.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/ho-sales/franchise-payments/${flagTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", flagReason }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to flag payment");
      }
      setFlagTarget(null);
      setFlagReason("");
      fetchPayments();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to flag payment");
    } finally {
      setBusy(false);
    }
  }

  const columns: ColumnDef<PaymentRow>[] = [
    {
      accessorKey: "franchiseDealId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deal" />,
      cell: ({ row }) => {
        const deal = row.original.franchiseDealId;
        return (
          <div>
            <div className="font-mono text-sm">{deal?.dealNumber}</div>
            <div className="text-sm text-muted-foreground">{deal?.buyerName}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => `₹${(row.getValue("amount") as number).toLocaleString("en-IN")}`,
    },
    {
      accessorKey: "bankTransferRef",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bank Ref" />,
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Date" />,
      cell: ({ row }) => format(new Date(row.getValue("paymentDate")), "MMM dd, yyyy"),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "verified" ? "default" : status === "flagged" ? "destructive" : "outline"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;
        if (payment.status !== "pending") return null;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => handleVerify(payment._id)}>
              <Check className="h-4 w-4 mr-1" /> Verify
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setFlagTarget(payment)}>
              <Flag className="h-4 w-4 mr-1" /> Flag
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Franchise Payments</h2>
          <p className="text-muted-foreground mt-1">Verify franchise payments against bank statements</p>
        </div>
        <div className="flex gap-2">
          <Button variant={statusFilter === "pending" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("pending")}>
            Pending
          </Button>
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>
            All
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={payments} loading={loading} />

      <Dialog open={!!flagTarget} onOpenChange={(o) => !o && setFlagTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Payment Issue</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Describe the discrepancy..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={busy || !flagReason.trim()} onClick={handleFlag}>
              Flag Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FranchisePaymentsPage() {
  return (
    <ProtectedRoute requiredPermission="canVerifyFranchisePayments">
      <PaymentsQueueContent />
    </ProtectedRoute>
  );
}
