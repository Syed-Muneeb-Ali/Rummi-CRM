"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "hsl(68, 45%, 93%)" }}
          >
            <Icon className="w-5 h-5" style={{ color: "hsl(68, 60%, 27%)" }} />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={href}>
            Open
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
    </Card>
  )
}
