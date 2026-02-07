"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import {
  Users,
  Building2,
  UserPlus,
  Gift,
  HelpCircle,
  AlertCircle,
} from "lucide-react"

export default function HRDashboardPage() {
  const { user, can } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFranchises: 0,
    pendingFreelancers: 0,
    openSupportTickets: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, franchisesRes] = await Promise.all([
          can("canManageUsers") ? fetch("/api/hr/users?limit=1") : null,
          can("canManageFranchises") ? fetch("/api/hr/franchises?limit=1") : null,
        ])

        if (usersRes?.ok) {
          const usersData = await usersRes.json()
          setStats((prev) => ({
            ...prev,
            totalUsers: usersData.pagination?.total ?? 0,
          }))
        }

        if (franchisesRes?.ok) {
          const franchisesData = await franchisesRes.json()
          setStats((prev) => ({
            ...prev,
            totalFranchises: franchisesData.pagination?.total ?? 0,
          }))
        }

        // Pending freelancers and support tickets - placeholder until APIs exist
        setStats((prev) => ({
          ...prev,
          pendingFreelancers: 0,
          openSupportTickets: 0,
        }))
      } catch (error) {
        console.error("Error fetching HR dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [can])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. Manage
          users, franchises, and HR operations.
        </p>
      </div>

      {/* Stats Grid - TRD: Users, Franchises, Freelancer Requests, Support Tickets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {can("canManageUsers") && (
          <StatCard
            title="Total Users"
            value={loading ? "..." : stats.totalUsers}
            description="All CRM users"
            icon={Users}
            href="/dashboard/hr/users"
          />
        )}
        {can("canManageFranchises") && (
          <StatCard
            title="Total Franchises"
            value={loading ? "..." : stats.totalFranchises}
            description="All franchise entities"
            icon={Building2}
            href="/dashboard/hr/franchises"
          />
        )}
        <StatCard
          title="Pending Freelancer Requests"
          value={loading ? "..." : stats.pendingFreelancers}
          description="Awaiting approval"
          icon={UserPlus}
          href="/dashboard/hr/freelancers"
          variant={stats.pendingFreelancers > 0 ? "alert" : "default"}
        />
        <StatCard
          title="Open Support Tickets"
          value={loading ? "..." : stats.openSupportTickets}
          description="Need resolution"
          icon={HelpCircle}
          href="/dashboard/hr/support"
          variant={stats.openSupportTickets > 0 ? "alert" : "default"}
        />
      </div>

      {/* Quick Actions - TRD Key Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {can("canManageUsers") && (
            <QuickActionCard
              title="Manage Users"
              description="Create, edit, and manage all CRM users"
              href="/dashboard/hr/users"
              icon={Users}
            />
          )}
          {can("canManageFranchises") && (
            <QuickActionCard
              title="Manage Franchises"
              description="View and manage franchise entities"
              href="/dashboard/hr/franchises"
              icon={Building2}
            />
          )}
          <QuickActionCard
            title="Freelancer Requests"
            description="Review and approve freelancer ID requests"
            href="/dashboard/hr/freelancers"
            icon={UserPlus}
          />
          <QuickActionCard
            title="Incentive Rules"
            description="Configure commission tiers and targets"
            href="/dashboard/hr/incentives"
            icon={Gift}
          />
          <QuickActionCard
            title="Support Tickets"
            description="View and resolve support tickets"
            href="/dashboard/hr/support"
            icon={HelpCircle}
          />
        </div>
      </div>

      {/* Alerts Section - TRD: Support tickets, Freelancer requests */}
      {(stats.pendingFreelancers > 0 || stats.openSupportTickets > 0) && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Attention Required
            </CardTitle>
            <CardDescription>Items requiring your action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.pendingFreelancers > 0 && (
              <p>
                <span className="font-medium">{stats.pendingFreelancers}</span> freelancer request(s)
                pending approval.{" "}
                <a href="/dashboard/hr/freelancers" className="text-primary underline">
                  Review now
                </a>
              </p>
            )}
            {stats.openSupportTickets > 0 && (
              <p>
                <span className="font-medium">{stats.openSupportTickets}</span> support ticket(s)
                open.{" "}
                <a href="/dashboard/hr/support" className="text-primary underline">
                  View tickets
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
