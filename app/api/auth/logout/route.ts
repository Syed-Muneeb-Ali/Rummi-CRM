import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/db/connection"
import Session from "@/lib/db/models/session"
import { getSessionCookieName } from "@/lib/auth/token"
import { getSession } from "@/lib/auth/session"
import { logLogout } from "@/lib/auth/audit"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const session = await getSession()
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get(getSessionCookieName())?.value
    
    if (sessionToken) {
      await Session.deleteOne({ token: sessionToken })
      
      if (session) {
        const ipAddress = request.headers.get("x-forwarded-for") || 
                          request.headers.get("x-real-ip") || 
                          "unknown"
        await logLogout(session.userId as any, ipAddress)
      }
    }
    
    const response = NextResponse.json({ success: true })
    response.cookies.delete(getSessionCookieName())
    
    return response
  } catch (error) {
    console.error("[logout] error:", error)
    
    const response = NextResponse.json({ success: true })
    response.cookies.delete(getSessionCookieName())
    
    return response
  }
}
