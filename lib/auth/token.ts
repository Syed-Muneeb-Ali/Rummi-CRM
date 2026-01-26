import crypto from "crypto"

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function getSessionCookieName(): string {
  return "rummi_session"
}

export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production"
  
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/",
  }
}
