"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  Briefcase,
  ClipboardList,
  Users,
  CreditCard,
  TrendingUp,
  Target,
  CircleDollarSign,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SalesDashboardPage() {
  const { user, can } = useAuth()

  const quickActions = [
    ...((can("canViewOwnLeads") || can("canCreateLeads"))
      ? [{ title: "My Sales", description: "Manage your assigned leads and deals", href: "/dashboard/sales/my-sales", icon: Briefcase }]
      : []),
    ...(can("canViewAllLeads")
      ? [{ title: "Sales Management", description: "Pipeline overview, reassign leads", href: "/dashboard/sales/management", icon: ClipboardList }]
      : []),
    { title: "Customers", description: "Converted customers with purchase details", href: "/dashboard/sales/customers", icon: Users },
    { title: "Cash Deposits", description: "Upload slips or verify deposits", href: "/dashboard/sales/cash-deposits", icon: CreditCard },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales & Customers Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>.{" "}
          {can("canViewAllLeads")
            ? "Monitor sales pipeline and customer conversions across all franchises."
            : "Manage your leads and track your sales performance."}
        </p>
      </div>

      {/* Stats Grid - equal height cards, balanced layout */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value="--"
          description="All stages"
          icon={Briefcase}
          href={can("canViewOwnLeads") || can("canViewAllLeads") ? "/dashboard/sales/my-sales" : undefined}
        />
        <StatCard
          title="Conversion Rate"
          value="--"
          description="Leads to sold"
          icon={TrendingUp}
        />
        <StatCard
          title="This Month Sales"
          value="--"
          description="Units sold"
          icon={Target}
        />
        <StatCard
          title="Commission Earned"
          value="--"
          description="This month"
          icon={CircleDollarSign}
        />
      </div>

      {/* Quick Actions - consistent card layout */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="block h-full">
              <Card className="h-full transition-colors hover:bg-muted/50 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "hsl(214, 82%, 95%)" }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: "hsl(214, 82%, 48%)" }} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-1">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {action.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deal Pipeline Stages</CardTitle>
          <CardDescription>Lead → Interested → Documents → Loan → Approved → Sold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium">Lead</span>
            <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium">Interested</span>
            <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium">Documents Submitted</span>
            <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium">Loan in Progress</span>
            <span className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium">Approved</span>
            <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              Sold
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
