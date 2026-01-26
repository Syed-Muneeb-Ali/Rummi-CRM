import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/user"
import Session from "@/lib/db/models/session"
import { verifyPassword } from "@/lib/auth/password"
import { generateSessionToken, getSessionCookieName, getSessionCookieOptions } from "@/lib/auth/token"
import { logLogin } from "@/lib/auth/audit"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    const user = await User.findOne({ email }).select("+passwordHash")
    
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }
    
    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Account is disabled. Please contact HR." },
        { status: 403 },
      )
    }
    
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }
    
    const token = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days
    
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    
    await Session.create({
      userId: user._id,
      token,
      deviceInfo: userAgent,
      ipAddress,
      expiresAt,
      lastActivityAt: new Date(),
    })
    
    await logLogin(user._id, ipAddress, userAgent)
    
    const cookieOptions = getSessionCookieOptions()
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        empId: user.empId,
      },
    })
    
    // Set the session cookie
    response.cookies.set(
      getSessionCookieName(),
      token,
      cookieOptions,
    )
    
    console.log("[login] Session created:", {
      userId: user._id.toString(),
      email: user.email,
      tokenLength: token.length,
      expiresAt,
    })
    
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      )
    }
    
    console.error("[login] error:", error)
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 },
    )
  }
}
