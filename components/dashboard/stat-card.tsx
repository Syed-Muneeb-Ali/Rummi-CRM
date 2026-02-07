"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  href?: string
  variant?: "default" | "muted" | "alert"
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  variant = "default",
}: StatCardProps) {
  const content = (
    <Card className={cn(
      "h-full min-h-[120px]",
      variant === "alert" && "border-destructive/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }

  return content
}
