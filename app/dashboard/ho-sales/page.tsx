"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UserPlus,
  FileText,
  Wallet,
  BarChart3,
  Building2,
  ScrollText,
  AlertCircle,
} from "lucide-react"

export default function HOSalesDashboardPage() {
  const { user, can } = useAuth()
  const [stats, setStats] = useState({
    totalFranchises: 0,
    activeFranchises: 0,
    pendingPayments: 0,
    expiringRentAgreements: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        if (can("canManageFranchises") || can("canViewAllFranchises")) {
          const res = await fetch("/api/hr/franchises?limit=1")
          if (res.ok) {
            const data = await res.json()
            const total = data.pagination?.total ?? 0
            setStats((prev) => ({
              ...prev,
              totalFranchises: total,
              activeFranchises: total,
            }))
          }
        }
        // Placeholder for pending payments and rent agreements
        setStats((prev) => ({
          ...prev,
          pendingPayments: 0,
          expiringRentAgreements: 0,
        }))
      } catch (error) {
        console.error("Error fetching HO Sales stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [can])

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: FDM Dashboard, All Franchises */}
      <div>
        <h1 className="text-3xl font-bold">HO Sales Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>.
          Franchise deal lifecycle: Lead → Deal → Payment → Verification → Active.
        </p>
      </div>

      {/* Stats Grid - TRD: Franchise deals, payments, FDM targets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Franchises"
          value={loading ? "..." : stats.totalFranchises}
          description="All franchise entities"
          icon={Building2}
          href="/dashboard/ho-sales/franchises"
        />
        <StatCard
          title="Active Franchises"
          value={loading ? "..." : stats.activeFranchises}
          description="Operational"
          icon={Building2}
          href="/dashboard/ho-sales/franchises"
        />
        <StatCard
          title="Pending Payments"
          value={loading ? "..." : stats.pendingPayments}
          description="Awaiting verification"
          icon={Wallet}
          href="/dashboard/ho-sales/payments"
          variant={stats.pendingPayments > 0 ? "alert" : "default"}
        />
        <StatCard
          title="Rent Agreements Expiring"
          value={loading ? "..." : stats.expiringRentAgreements}
          description="Within 30 days"
          icon={ScrollText}
          href="/dashboard/ho-sales/rent-agreements"
          variant={stats.expiringRentAgreements > 0 ? "alert" : "default"}
        />
      </div>

      {/* Deal Types - TRD: Type A, B, C with fee structure */}
      <Card>
        <CardHeader>
          <CardTitle>Franchise Deal Types</CardTitle>
          <CardDescription>Fee and commission structure by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Type A</h4>
              <p className="text-sm text-muted-foreground">3 E-Rickshaws</p>
              <p className="font-medium mt-2">₹6,83,000</p>
              <p className="text-xs text-muted-foreground">₹7000 / ₹6000 / ₹5000 per tier</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Type B</h4>
              <p className="text-sm text-muted-foreground">1 E-Rickshaw</p>
              <p className="font-medium mt-2">₹3,83,000</p>
              <p className="text-xs text-muted-foreground">₹9,000 flat</p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Type C</h4>
              <p className="text-sm text-muted-foreground">2 E-Rickshaws</p>
              <p className="font-medium mt-2">₹5,83,000</p>
              <p className="text-xs text-muted-foreground">₹6500 / ₹5000 / ₹4000 per tier</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - TRD Key Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {can("canManageFranchiseLeads") && (
            <QuickActionCard
              title="Franchise Leads"
              description="Create and manage franchise prospects"
              href="/dashboard/ho-sales/leads"
              icon={UserPlus}
            />
          )}
          {can("canCreateFranchiseDeals") && (
            <QuickActionCard
              title="Franchise Deals"
              description="Convert leads to deals, track stages"
              href="/dashboard/ho-sales/deals"
              icon={FileText}
            />
          )}
          {can("canVerifyFranchisePayments") && (
            <QuickActionCard
              title="Franchise Payments"
              description="Verify payments, view breakup"
              href="/dashboard/ho-sales/payments"
              icon={Wallet}
            />
          )}
          <QuickActionCard
            title="FDM Dashboard"
            description="Monthly target, achievement, incentives"
            href="/dashboard/ho-sales/fdm-dashboard"
            icon={BarChart3}
          />
          <QuickActionCard
            title="All Franchises"
            description="Master list with status and details"
            href="/dashboard/ho-sales/franchises"
            icon={Building2}
          />
          <QuickActionCard
            title="Rent Agreements"
            description="Track expiry, upload renewals"
            href="/dashboard/ho-sales/rent-agreements"
            icon={ScrollText}
          />
        </div>
      </div>

      {/* Deal Stages - TRD */}
      {stats.pendingPayments > 0 || stats.expiringRentAgreements > 0 ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Attention Required
            </CardTitle>
            <CardDescription>Items requiring action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingPayments > 0 && (
              <p>
                <span className="font-medium">{stats.pendingPayments}</span> franchise payment(s)
                pending verification.{" "}
                <a href="/dashboard/ho-sales/payments" className="text-primary underline">
                  Verify now
                </a>
              </p>
            )}
            {stats.expiringRentAgreements > 0 && (
              <p>
                <span className="font-medium">{stats.expiringRentAgreements}</span> rent agreement(s)
                expiring within 30 days.{" "}
                <a href="/dashboard/ho-sales/rent-agreements" className="text-primary underline">
                  View agreements
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
