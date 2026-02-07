"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Warehouse, ArrowRightLeft, MapPin, AlertTriangle } from "lucide-react"

export default function InventoryDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: All Units, Transfer Requests, Stock by Location */}
      <div>
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Manage
          e-rickshaws, spare parts, and transfers.
        </p>
      </div>

      {/* Stats Grid - TRD: Unit-level inventory, transfers, stock levels */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Units"
          value="--"
          description="E-rickshaws & spare parts"
          icon={Warehouse}
          href="/dashboard/inventory/units"
        />
        <StatCard
          title="Available Stock"
          value="--"
          description="Ready for sale"
          icon={Warehouse}
        />
        <StatCard
          title="Pending Transfers"
          value="--"
          description="Awaiting approval"
          icon={ArrowRightLeft}
          href="/dashboard/inventory/transfers"
        />
        <StatCard
          title="Low Stock Alerts"
          value="--"
          description="Items needing attention"
          icon={AlertTriangle}
        />
      </div>

      {/* Quick Actions - TRD Key Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {can("canManageInventory") && (
            <QuickActionCard
              title="All Units"
              description="E-rickshaws by engine/chassis, spare parts by SKU"
              href="/dashboard/inventory/units"
              icon={Warehouse}
            />
          )}
          <QuickActionCard
            title="Transfer Requests"
            description="Approve/reject requests, track status"
            href="/dashboard/inventory/transfers"
            icon={ArrowRightLeft}
          />
          <QuickActionCard
            title="Stock by Location"
            description="View stock at HO and each franchise"
            href="/dashboard/inventory/stock-location"
            icon={MapPin}
          />
        </div>
      </div>

      {/* Transfer Status Flow - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Request Status</CardTitle>
          <CardDescription>Request lifecycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-muted text-sm">Pending</span>
            <span className="px-3 py-1 rounded-full bg-muted text-sm">Approved</span>
            <span className="px-3 py-1 rounded-full bg-muted text-sm">In Transit</span>
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm">
              Delivered
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            10% commission due to franchise owner on transferred items.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
