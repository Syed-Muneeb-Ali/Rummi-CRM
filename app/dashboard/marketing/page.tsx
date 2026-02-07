"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, CreditCard, Clock, CheckCircle } from "lucide-react"

export default function MarketingDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Marketing Expenses */}
      <div>
        <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Manage
          marketing expense requests and approvals.
        </p>
      </div>

      {/* Stats Grid - TRD: Expense requests */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Requests"
          value="--"
          description="Awaiting HR approval"
          icon={Clock}
        />
        <StatCard
          title="HR Approved"
          value="--"
          description="Awaiting Accounts"
          icon={CreditCard}
        />
        <StatCard
          title="Fully Approved"
          value="--"
          description="Ready for payment"
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value="--"
          description="This month"
          icon={Megaphone}
        />
      </div>

      {/* Approval Flow - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Expense Approval Flow</CardTitle>
          <CardDescription>HR first approval, then Accounts for payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-muted text-sm">Submitted</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1 rounded-full bg-muted text-sm">HR Approval</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1 rounded-full bg-muted text-sm">Accounts Approval</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm">
              Paid
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {can("canManageMarketing") && (
            <QuickActionCard
              title="Manage Expenses"
              description="Create expense requests, upload vendor invoices"
              href="/dashboard/marketing/expenses"
              icon={CreditCard}
            />
          )}
        </div>
      </div>
    </div>
  )
}
