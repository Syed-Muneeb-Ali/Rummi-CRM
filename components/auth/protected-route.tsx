"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: keyof import("@/types/db").RolePermissions
}

export function ProtectedRoute({ 
  children, 
  requiredPermission 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, can } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null
  }
  
  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">
          You don't have permission to access this page.
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
