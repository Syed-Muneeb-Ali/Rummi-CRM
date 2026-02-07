"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HOSalesFranchisesPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/hr/franchises")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-muted-foreground">Redirecting to All Franchises...</p>
    </div>
  )
}
