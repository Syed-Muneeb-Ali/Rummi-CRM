import { cookies } from "next/headers"
import connectDB from "@/lib/db/connection"
import Session from "@/lib/db/models/session"
import User from "@/lib/db/models/user"
import Role from "@/lib/db/models/role"
import type { IUser, IRole } from "@/types/db"
import { getSessionCookieName } from "./token"

export interface SessionUser {
  userId: string
  email: string
  name: string
  empId: string
  roleId: string
  roleName: string
  permissions: IRole["permissions"]
  franchiseId?: string
  locationType: "ho" | "franchise"
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    await connectDB()
    
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(getSessionCookieName())?.value
    
    if (!sessionToken) return null
    
    const session = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    })
    
    if (!session) return null
    
    const user = await User.findById(session.userId)
    if (!user) {
      await Session.deleteOne({ _id: session._id })
      return null
    }
    
    if (user.status !== "active") {
      await Session.deleteOne({ _id: session._id })
      return null
    }
    
    const role = await Role.findById(user.roleId)
    if (!role) return null
    
    await Session.updateOne(
      { _id: session._id },
      { lastActivityAt: new Date() },
    )
    
    return {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      empId: user.empId,
      roleId: role._id.toString(),
      roleName: role.name,
      permissions: role.permissions,
      franchiseId: user.franchiseId?.toString(),
      locationType: user.locationType,
    }
  } catch (error) {
    console.error("[getSession] error:", error)
    return null
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requirePermission(
  permission: keyof SessionUser["permissions"],
): Promise<SessionUser> {
  const session = await requireSession()
  
  if (!session.permissions[permission]) {
    throw new Error("Forbidden: Insufficient permissions")
  }
  
  return session
}
