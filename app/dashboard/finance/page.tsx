"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, FileText, AlertCircle } from "lucide-react"

export default function FinanceDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Finance Queue */}
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Manage
          loan options and due letters for approved sales.
        </p>
      </div>

      {/* Stats Grid - TRD: Documents Submitted, Loan Selected */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Documents Submitted"
          value="--"
          description="Awaiting loan options"
          icon={ClipboardList}
          href="/dashboard/finance/queue"
        />
        <StatCard
          title="Loan Selected"
          value="--"
          description="Due letter pending"
          icon={FileText}
          href="/dashboard/finance/queue"
        />
        <StatCard
          title="Approved Today"
          value="--"
          description="Deals moved to Approved"
          icon={ClipboardList}
        />
        <StatCard
          title="Overdue"
          value="--"
          description="Past SLA"
          icon={AlertCircle}
          variant="alert"
        />
      </div>

      {/* Finance Queue Actions - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Queue Actions</CardTitle>
          <CardDescription>Two types of actions on deals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold">1. Assign Loan Options</h4>
            <p className="text-sm text-muted-foreground">
              When deal is at &quot;Documents Submitted&quot; stage — assign 3 loan options from
              available financers.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold">2. Upload Due Letter</h4>
            <p className="text-sm text-muted-foreground">
              When salesperson has selected a loan option — upload due letter document to move deal
              to &quot;Approved&quot; stage.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(can("canAssignLoanOptions") || can("canUploadDueLetters")) && (
            <QuickActionCard
              title="Finance Queue"
              description="Assign options, upload due letters"
              href="/dashboard/finance/queue"
              icon={ClipboardList}
            />
          )}
        </div>
      </div>
    </div>
  )
}
