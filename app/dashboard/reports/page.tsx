"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileSpreadsheet, TrendingUp } from "lucide-react"

export default function ReportsDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Role-Based Reports P4 */}
      <div>
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Access
          role-based reports and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Sales Reports"
          value="--"
          description="Revenue by franchise, period"
          icon={TrendingUp}
        />
        <StatCard
          title="Performance Reports"
          value="--"
          description="Target vs achievement"
          icon={BarChart3}
        />
        <StatCard
          title="Export Reports"
          value="--"
          description="Download to Excel"
          icon={FileSpreadsheet}
        />
      </div>

      {/* Reports Info - TRD P4 */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Reports</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Reports will include dashboards with additional subtraction logic for P&L, sales by
            franchise, performance metrics, and more. Export to Excel.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
