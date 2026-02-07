"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Clock, CheckCircle } from "lucide-react"

export default function TransportDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Transport Requests */}
      <div>
        <h1 className="text-3xl font-bold">Transport Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Handle
          incoming requests and track trip history.
        </p>
      </div>

      {/* Stats Grid - TRD: Pending requests, in transit, completed */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Requests"
          value="--"
          description="Awaiting approval"
          icon={Truck}
          href="/dashboard/transport/requests"
        />
        <StatCard
          title="In Transit"
          value="--"
          description="Active trips"
          icon={Clock}
        />
        <StatCard
          title="Completed Today"
          value="--"
          description="Delivered"
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value="--"
          description="This month"
          icon={Truck}
        />
      </div>

      {/* Request Sources - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>Transport Request Sources</CardTitle>
          <CardDescription>Where requests originate</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Inventory transfers (HO → Franchise)</li>
            <li>• Franchise activation (initial vehicle allocation)</li>
            <li>• Customer delivery</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Default transport lead time: 24 hours. Base km allowance: 200.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {can("canManageTransport") && (
            <QuickActionCard
              title="Transport Requests"
              description="Approve/reject requests, add driver, vehicle, cost"
              href="/dashboard/transport/requests"
              icon={Truck}
            />
          )}
        </div>
      </div>
    </div>
  )
}
