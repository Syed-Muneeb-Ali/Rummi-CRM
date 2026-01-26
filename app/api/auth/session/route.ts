import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 },
      )
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        name: session.name,
        empId: session.empId,
        roleId: session.roleId,
        roleName: session.roleName,
        permissions: session.permissions,
        franchiseId: session.franchiseId,
        locationType: session.locationType,
      },
    })
  } catch (error) {
    console.error("[session] error:", error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 },
    )
  }
}
