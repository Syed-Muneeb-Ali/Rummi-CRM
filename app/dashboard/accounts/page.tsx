"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, CreditCard, Wallet, AlertCircle } from "lucide-react"

export default function AccountsDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Invoice Queue, Cash Deposits, Expense Approvals */}
      <div>
        <h1 className="text-3xl font-bold">Accounts Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Manage
          invoices, cash deposits, and financial operations.
        </p>
      </div>

      {/* Stats Grid - TRD: Invoice queue, overdue deposits, blocked salespersons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Invoice Queue"
          value="--"
          description="Ready for invoice"
          icon={Receipt}
          href="/dashboard/accounts/invoices"
        />
        <StatCard
          title="Deposits Pending Verification"
          value="--"
          description="Awaiting bank confirmation"
          icon={CreditCard}
          href="/dashboard/sales/cash-deposits"
        />
        <StatCard
          title="Overdue Deposits"
          value="--"
          description="Past 12-hour deadline"
          icon={AlertCircle}
          href="/dashboard/sales/cash-deposits"
          variant="alert"
        />
        <StatCard
          title="Blocked Salespersons"
          value="--"
          description="Overdue unverified deposits"
          icon={CreditCard}
        />
      </div>

      {/* Blocking Logic - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Generation Rules</CardTitle>
          <CardDescription>Blocking logic for invoice generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            If a salesperson has an unverified deposit older than 12 hours, Accounts cannot generate
            new invoices for that salesperson until the overdue deposit is verified.
          </p>
          <p className="text-sm text-muted-foreground">
            Unblock happens automatically when overdue deposit is verified in Cash Verification page.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions - TRD */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {can("canGenerateInvoices") && (
            <QuickActionCard
              title="Invoice Queue"
              description="Generate invoice PDF for approved deals"
              href="/dashboard/accounts/invoices"
              icon={Receipt}
            />
          )}
          {can("canVerifyCashDeposits") && (
            <QuickActionCard
              title="Cash Deposits"
              description="Verify uploaded deposit slips"
              href="/dashboard/sales/cash-deposits"
              icon={CreditCard}
            />
          )}
          {can("canApproveExpenses") && (
            <QuickActionCard
              title="Expense Approvals"
              description="Approve/reject expense requests"
              href="/dashboard/accounts/expenses"
              icon={CreditCard}
            />
          )}
          {can("canProcessSalary") && (
            <QuickActionCard
              title="Salary Processing"
              description="Monthly salary and commission calculation"
              href="/dashboard/accounts/salary"
              icon={Wallet}
            />
          )}
        </div>
      </div>
    </div>
  )
}
