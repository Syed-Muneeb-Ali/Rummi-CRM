"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { RolePermissions } from "@/types/db"

interface AuthUser {
  userId: string
  email: string
  name: string
  empId: string
  roleId: string
  roleName: string
  permissions: RolePermissions
  franchiseId?: string
  locationType: "ho" | "franchise"
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  can: (permission: keyof RolePermissions) => boolean
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  async function fetchSession() {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
          return
        }
      }
      
      setUser(null)
    } catch (error) {
      console.error("[AuthProvider] fetchSession error:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSession()
  }, [])
  
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("[AuthProvider] logout error:", error)
    } finally {
      setUser(null)
      router.push("/login")
      router.refresh()
    }
  }
  
  function can(permission: keyof RolePermissions): boolean {
    if (!user) return false
    return user.permissions[permission] === true
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        can,
        logout,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
