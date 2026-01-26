import { NextResponse } from "next/server"
import { getSession, requireSession, requirePermission } from "./session"
import type { RolePermissions } from "@/types/db"

export async function withAuth<T>(
  handler: (session: Awaited<ReturnType<typeof getSession>>) => Promise<T>,
): Promise<T | NextResponse> {
  try {
    const session = await requireSession()
    return await handler(session)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }
    throw error
  }
}

export async function withPermission<T>(
  permission: keyof RolePermissions,
  handler: (session: Awaited<ReturnType<typeof getSession>>) => Promise<T>,
): Promise<T | NextResponse> {
  try {
    const session = await requirePermission(permission)
    return await handler(session)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        )
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json(
          { error: "Forbidden: Insufficient permissions" },
          { status: 403 },
        )
      }
    }
    throw error
  }
}
