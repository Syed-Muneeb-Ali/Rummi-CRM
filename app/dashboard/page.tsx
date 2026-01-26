"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  LogOut, 
  Settings, 
  Users, 
  Building2, 
  FileText, 
  BarChart3,
  Shield,
  MapPin,
  Mail,
  Briefcase
} from "lucide-react"

function DashboardContent() {
  const { user, can, logout } = useAuth()
  
  const activePermissions = user?.permissions 
    ? Object.entries(user.permissions).filter(([_, value]) => value === true).length 
    : 0
  
  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(to bottom right, hsl(210, 20%, 98%), hsl(210, 20%, 98%), hsl(214, 82%, 98%))'
    }}>
      {/* Header */}
      <header className="border-b shadow-sm sticky top-0 z-10" style={{ backgroundColor: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(214, 82%, 48%)', color: 'white' }}>
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Rummi CRM</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg" style={{ backgroundColor: 'hsl(210, 20%, 96%)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(214, 82%, 95%)' }}>
                  <User className="w-4 h-4" style={{ color: 'hsl(214, 82%, 48%)' }} />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.roleName}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground mt-1">
                Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Info Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(214, 82%, 95%)' }}>
                  <User className="w-5 h-5" style={{ color: 'hsl(214, 82%, 48%)' }} />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Information</CardTitle>
                  <CardDescription>Your profile details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="font-medium text-sm truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Employee ID</p>
                    <p className="font-medium text-sm">{user?.empId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                    <Badge variant="secondary" className="mt-0.5" style={{ backgroundColor: 'hsl(240, 10%, 45%)', color: 'white' }}>
                      {user?.roleName}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                    <p className="font-medium text-sm">
                      {user?.locationType === "ho" ? "Head Office" : "Franchise"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(29, 100%, 95%)' }}>
                  <Settings className="w-5 h-5" style={{ color: 'hsl(29, 100%, 55%)' }} />
                </div>
                <div>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Based on your permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {can("canViewDashboard") && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(29, 100%, 95%)'
                    e.currentTarget.style.borderColor = 'hsl(29, 100%, 55%)'
                    e.currentTarget.style.color = 'hsl(29, 100%, 35%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Dashboard
                </Button>
              )}
              {can("canManageUsers") && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(29, 100%, 95%)'
                    e.currentTarget.style.borderColor = 'hsl(29, 100%, 55%)'
                    e.currentTarget.style.color = 'hsl(29, 100%, 35%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Button>
              )}
              {can("canManageFranchises") && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(29, 100%, 95%)'
                    e.currentTarget.style.borderColor = 'hsl(29, 100%, 55%)'
                    e.currentTarget.style.color = 'hsl(29, 100%, 35%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  Manage Franchises
                </Button>
              )}
              {can("canCreateLeads") && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(29, 100%, 95%)'
                    e.currentTarget.style.borderColor = 'hsl(29, 100%, 55%)'
                    e.currentTarget.style.color = 'hsl(29, 100%, 35%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Create Lead
                </Button>
              )}
              {can("canViewReports") && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(29, 100%, 95%)'
                    e.currentTarget.style.borderColor = 'hsl(29, 100%, 55%)'
                    e.currentTarget.style.color = 'hsl(29, 100%, 35%)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Reports
                </Button>
              )}
              {!can("canViewDashboard") && 
              !can("canManageUsers") && 
              !can("canManageFranchises") && 
              !can("canCreateLeads") && 
              !can("canViewReports") && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No quick actions available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
