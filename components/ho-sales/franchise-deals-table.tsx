"use client";

import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Plus, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, DataTableColumnHeader } from "@/components/common/data-table";
import { CreateLeadModal } from "@/components/ho-sales/create-lead-modal";
import { FranchiseDealDetailSheet } from "@/components/ho-sales/franchise-deal-detail-sheet";

interface DealRow {
  _id: string;
  dealNumber: string;
  buyerName: string;
  buyerPhone: string;
  locationInterest: string;
  source: string;
  stage: string;
  interestLevel?: string;
  dealType?: string;
  fdmId: { name: string; empId: string } | string;
  createdAt: string;
}

const STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  interested: "Interested",
  negotiation: "Negotiation",
  payment_pending: "Payment Pending",
  payment_entered: "Payment Entered",
  verified: "Verified",
  documents_uploaded: "Documents Uploaded",
  hr_setup: "HR Setup",
  inventory_allocated: "Inventory Allocated",
  active: "Active",
  lost: "Lost",
};

interface FranchiseDealsTableProps {
  scope: "leads" | "deals";
}

export function FranchiseDealsTable({ scope }: FranchiseDealsTableProps) {
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ho-sales/franchise-deals?scope=${scope}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error("Error fetching franchise deals:", error);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const columns: ColumnDef<DealRow>[] = [
    {
      accessorKey: "dealNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deal #" />,
      cell: ({ row }) => <span className="font-mono">{row.getValue("dealNumber")}</span>,
    },
    {
      accessorKey: "buyerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Buyer" />,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("buyerName")}</div>
          <div className="text-sm text-muted-foreground">{row.original.buyerPhone}</div>
        </div>
      ),
    },
    scope === "leads"
      ? {
          accessorKey: "locationInterest",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Location Interest" />,
        }
      : {
          accessorKey: "dealType",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
          cell: ({ row }) => {
            const dealType = row.getValue("dealType") as string | undefined;
            return dealType ? <Badge variant="secondary">Type {dealType}</Badge> : "-";
          },
        },
    {
      accessorKey: "stage",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stage" />,
      cell: ({ row }) => {
        const stage = row.getValue("stage") as string;
        return <Badge variant={stage === "lost" ? "destructive" : stage === "active" ? "default" : "outline"}>
          {STAGE_LABELS[stage] || stage}
        </Badge>;
      },
    },
    {
      accessorKey: "fdmId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="FDM" />,
      cell: ({ row }) => {
        const fdm = row.original.fdmId;
        return typeof fdm === "object" ? fdm.name : "-";
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM dd, yyyy"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedDealId(row.original._id);
            setDetailOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{scope === "leads" ? "Franchise Leads" : "Franchise Deals"}</h2>
          <p className="text-muted-foreground mt-1">
            {scope === "leads"
              ? "Prospects being worked before conversion to a deal"
              : "Deals in progress from payment through activation"}
          </p>
        </div>
        {scope === "leads" && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={deals}
        searchKey="buyerName"
        searchPlaceholder="Search by buyer name..."
        loading={loading}
      />

      <CreateLeadModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={fetchDeals} />

      <FranchiseDealDetailSheet
        dealId={selectedDealId}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onChanged={fetchDeals}
      />
    </div>
  );
}
