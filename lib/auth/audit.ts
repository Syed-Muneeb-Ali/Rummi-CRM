import connectDB from "@/lib/db/connection"
import AuditLog from "@/lib/db/models/audit-log"
import type { Types } from "mongoose"

export interface AuditLogEntry {
  userId: Types.ObjectId
  action: string
  module: string
  recordId?: Types.ObjectId | string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await connectDB()
    await AuditLog.create({
      ...entry,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("[logAudit] error:", error)
  }
}

export async function logLogin(
  userId: Types.ObjectId,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  await logAudit({
    userId,
    action: "login",
    module: "authentication",
    ipAddress,
    userAgent,
  })
}

export async function logLogout(
  userId: Types.ObjectId,
  ipAddress?: string,
): Promise<void> {
  await logAudit({
    userId,
    action: "logout",
    module: "authentication",
    ipAddress,
  })
}
