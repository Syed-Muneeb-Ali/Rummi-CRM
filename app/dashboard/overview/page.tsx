"use client"

import { useState } from "react"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Briefcase,
  Building2,
  MapPin,
  Mail,
  Server,
  Shield,
  TrendingUp,
  User
} from "lucide-react"

function DashboardOverviewContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen" style={{ 
      background: "linear-gradient(to bottom right, hsl(210, 20%, 98%), hsl(210, 20%, 98%), hsl(214, 82%, 98%))"
    }}>
      {/* Header */}
      <header className="border-b shadow-sm sticky top-0 z-10" style={{ backgroundColor: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "hsl(214, 82%, 48%)", color: "white" }}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Rummi CRM</h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: "hsl(210, 20%, 96%)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "hsl(214, 82%, 95%)" }}>
                <User className="w-4 h-4" style={{ color: "hsl(214, 82%, 48%)" }} />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.roleName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Overall Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Role-based overview for Superadmin / HO with dummy data.
          </p>
        </div>

        {/* Compact user summary row */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">You are viewing</CardTitle>
              <CardDescription>Current context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.roleName}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {user?.locationType === "ho" ? "Head Office" : "Franchise"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overview Tabs Section */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white shadow-sm rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Overview
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                System Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Total Sales Across Franchises */}
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">Total Sales across franchises</CardTitle>
                        <CardDescription>QTD performance</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                      Superadmin / HO
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight">₹3.8Cr</p>
                      <span className="text-xs text-muted-foreground">vs target ₹4.0Cr</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[76%] bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    </div>
                    <dl className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Active franchises</dt>
                        <dd className="font-semibold">18</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">This month</dt>
                        <dd className="font-semibold">₹82L</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Conversion</dt>
                        <dd className="font-semibold">31%</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                {/* Pending Approvals Count */}
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">Pending approvals</CardTitle>
                        <CardDescription>Across FDM, finance & HR</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-xs">
                      Attention
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight">23</p>
                      <span className="text-xs text-muted-foreground">items waiting on HO</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Franchise deals</span>
                        <span className="font-semibold">9</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expenses</span>
                        <span className="font-semibold">6</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Salary batches</span>
                        <span className="font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Invoice approvals</span>
                        <span className="font-semibold">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overdue Cash Deposits */}
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50">
                        <Activity className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">Overdue cash deposits</CardTitle>
                        <CardDescription>Beyond 12‑hour SLA</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600 text-xs">
                      Risk
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight">5</p>
                      <span className="text-xs text-muted-foreground">sales blocked</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[40%] bg-gradient-to-r from-red-500 via-orange-400 to-amber-300" />
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Oldest overdue</dt>
                        <dd className="font-semibold">27h</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Blocked salespeople</dt>
                        <dd className="font-semibold">3</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Expiring Rent Agreements */}
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-sky-50">
                        <Building2 className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">Expiring rent agreements</CardTitle>
                        <CardDescription>Next 30 days</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700 text-xs">
                      Real estate
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight">4</p>
                      <span className="text-xs text-muted-foreground">locations require renewal</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lucknow HO</span>
                        <span className="font-semibold">7 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Kanpur Franchise A</span>
                        <span className="font-semibold">12 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Varanasi Franchise B</span>
                        <span className="font-semibold">19 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Prayagraj Franchise C</span>
                        <span className="font-semibold">27 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health Summary */}
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                        <Server className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">System health</CardTitle>
                        <CardDescription>Uptime & error budget</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                      98.7% uptime
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight">A</p>
                      <span className="text-xs text-muted-foreground">Overall grade</span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">API latency</span>
                        <span className="font-semibold text-emerald-700">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">DB connections</span>
                        <span className="font-semibold text-emerald-700">Stable</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Error rate</span>
                        <span className="font-semibold text-amber-600">Minor spikes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    Detailed system health
                  </CardTitle>
                  <CardDescription>
                    Dummy environment view summarising uptime and recent alerts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last 24h uptime</p>
                      <p className="text-xl font-semibold">99.3%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Active users</p>
                      <p className="text-xl font-semibold">214</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Critical alerts</p>
                      <p className="text-xl font-semibold text-emerald-600">0</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Data shown here is sample data for UI validation. Integrate with monitoring later as per TRD (System Configuration and Audit Logs).
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}

export default function DashboardOverviewPage() {
  return (
    <ProtectedRoute>
      <DashboardOverviewContent />
    </ProtectedRoute>
  )
}

