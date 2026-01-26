"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { refreshSession, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  
  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setError(null)
    
    console.log("[LoginPage] Attempting login for:", data.email)
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
      
      console.log("[LoginPage] Login response status:", response.status)
      
      let result
      try {
        result = await response.json()
        console.log("[LoginPage] Login response data:", result)
      } catch (jsonError) {
        console.error("[LoginPage] Failed to parse response:", jsonError)
        setError("Invalid response from server. Please try again.")
        setIsLoading(false)
        return
      }
      
      if (!response.ok) {
        const errorMessage = result.error || "Login failed. Please try again."
        console.error("[LoginPage] Login failed:", errorMessage)
        setError(errorMessage)
        setIsLoading(false)
        return
      }
      
      console.log("[LoginPage] Login successful, verifying session...")
      
      // Small delay to ensure cookie is processed
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Verify session was created by checking it
      try {
        const sessionResponse = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        })
        
        console.log("[LoginPage] Session check status:", sessionResponse.status)
        
        const sessionData = await sessionResponse.json()
        console.log("[LoginPage] Session data:", sessionData)
        
        if (!sessionResponse.ok || !sessionData.authenticated) {
          console.error("[LoginPage] Session check failed:", sessionData)
          setError("Session could not be established. Please check your browser settings and try again.")
          setIsLoading(false)
          return
        }
        
        console.log("[LoginPage] Session verified, refreshing auth context...")
        
        // Refresh auth context
        await refreshSession()
        
        console.log("[LoginPage] Redirecting to dashboard...")
        
        // Use window.location for a hard redirect (full page reload)
        // This ensures cookies are included in the request
        window.location.href = "/dashboard"
      } catch (sessionError) {
        console.error("[LoginPage] Session verification error:", sessionError)
        // Still try to redirect - cookie might be set even if verification failed
        console.log("[LoginPage] Attempting redirect despite session check error...")
        await refreshSession()
        window.location.href = "/dashboard"
      }
    } catch (err) {
      console.error("[LoginPage] Unexpected error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ 
      background: 'linear-gradient(to bottom right, hsl(210, 20%, 98%), hsl(210, 20%, 98%), hsl(214, 82%, 98%))'
    }}>
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ backgroundColor: 'hsl(214, 82%, 48%)', color: 'white' }}>
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(222, 47%, 11%)' }}>Rummi CRM</h1>
          <p className="text-muted-foreground">Franchise Sales & Operations Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    {...register("email")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all"
                style={{ 
                  backgroundColor: isLoading ? 'hsl(214, 82%, 65%)' : 'hsl(214, 82%, 48%)',
                  color: 'white'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Need help? Contact your system administrator
        </p>
      </div>
    </div>
  )
}
