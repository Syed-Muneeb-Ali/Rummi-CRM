import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login"]
const authRoutes = ["/api/auth/login", "/api/auth/logout", "/api/auth/session"]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next()
  }
  
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  const sessionCookie = request.cookies.get("rummi_session")
  
  if (!sessionCookie) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }
    
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}