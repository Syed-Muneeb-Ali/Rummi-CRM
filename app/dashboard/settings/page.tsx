"use client"

import { useAuth } from "@/contexts/auth-context"
import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Settings, ScrollText } from "lucide-react"

export default function SettingsDashboardPage() {
  const { user, can } = useAuth()

  return (
    <div className="space-y-6">
      {/* Page Header - TRD: Settings (Superadmin) */}
      <div>
        <h1 className="text-3xl font-bold">Settings Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>. System
          configuration and administration.
        </p>
      </div>

      {/* Quick Actions - TRD: Roles, System Config, Audit Logs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {can("canManageRoles") && (
            <QuickActionCard
              title="Roles & Permissions"
              description="Dynamic role management with granular permission flags"
              href="/dashboard/settings/roles"
              icon={Shield}
            />
          )}
          {can("canConfigureSystem") && (
            <QuickActionCard
              title="System Configuration"
              description="Cash deposit deadline, transport lead time, session timeout"
              href="/dashboard/settings/config"
              icon={Settings}
            />
          )}
          {can("canViewAuditLogs") && (
            <QuickActionCard
              title="Audit Logs"
              description="Action-level audit trail viewer"
              href="/dashboard/settings/audit-logs"
              icon={ScrollText}
            />
          )}
        </div>
      </div>

      {/* System Config - TRD */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration Parameters</CardTitle>
          <CardDescription>Global system parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Cash deposit deadline: 12 hours</li>
            <li>• Transport lead time: 24 hours</li>
            <li>• Base transport km allowance: 200</li>
            <li>• Session timeout: 30 minutes</li>
            <li>• Inventory transfer commission: 10%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
