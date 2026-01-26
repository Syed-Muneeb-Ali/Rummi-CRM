# Authentication & Session Management System

This document describes the authentication and session management system for Rummi CRM.

## Overview

The system uses:
- **Next.js App Router** with server-side sessions
- **MongoDB** for session storage (not JWT-only)
- **bcrypt** for password hashing
- **HTTP-only secure cookies** for session tokens
- **Role-based access control (RBAC)** for permissions

## Architecture

### Core Components

1. **Authentication Utilities** (`lib/auth/`)
   - `password.ts` - Password hashing and verification
   - `token.ts` - Session token generation and cookie management
   - `session.ts` - Session validation and user loading
   - `permissions.ts` - Permission checking utilities
   - `audit.ts` - Audit logging for authentication events
   - `api-helpers.ts` - Helper functions for API routes

2. **API Routes** (`app/api/auth/`)
   - `/api/auth/login` - User login endpoint
   - `/api/auth/logout` - User logout endpoint
   - `/api/auth/session` - Get current session

3. **Frontend Components**
   - `app/login/page.tsx` - Login page
   - `contexts/auth-context.tsx` - React context for auth state
   - `components/auth/protected-route.tsx` - Route protection component
   - `middleware.ts` - Next.js middleware for route protection

4. **Database Models**
   - `Session` - Stores session tokens and metadata
   - `AuditLog` - Logs authentication and other actions
   - `User` - User accounts with passwordHash (not selected by default)

## Flow

### Login Flow

1. User submits email + password on `/login`
2. Frontend sends POST to `/api/auth/login`
3. Backend:
   - Validates email/password format
   - Finds user by email (with passwordHash selected)
   - Checks if user is active
   - Verifies password with bcrypt
   - Creates session record in MongoDB
   - Sets HTTP-only cookie with session token
   - Logs login event to audit log
   - Returns user info (without sensitive data)

4. Frontend receives success response
5. AuthContext fetches session from `/api/auth/session`
6. User is redirected to `/dashboard`

### Session Validation Flow

On each request:

1. **Middleware** (`middleware.ts`):
   - Checks for `rummi_session` cookie
   - Redirects to `/login` if missing (for pages)
   - Returns 401 if missing (for API routes)

2. **Server-side** (when `getSession()` is called):
   - Reads session token from cookie
   - Finds session in MongoDB
   - Checks expiration
   - Loads user and role
   - Checks if user is active (force logout if disabled)
   - Updates `lastActivityAt`
   - Returns session user with permissions

3. **Frontend** (AuthContext):
   - Fetches session on mount
   - Provides `can(permission)` helper
   - Handles logout

### Logout Flow

1. User clicks logout
2. Frontend calls `/api/auth/logout`
3. Backend:
   - Deletes session from MongoDB
   - Logs logout event
   - Clears cookie
4. Frontend clears auth state and redirects to `/login`

## Security Features

### Session Management

- **HTTP-only cookies**: Prevents XSS attacks
- **Secure cookies**: Enabled in production
- **SameSite: lax**: CSRF protection
- **7-day expiration**: Configurable session lifetime
- **Instant revocation**: Delete session from DB to force logout
- **Auto-cleanup**: MongoDB TTL index removes expired sessions

### Password Security

- **bcrypt hashing**: 10 salt rounds
- **Not stored in plain text**: Always hashed
- **Not selected by default**: passwordHash excluded from queries

### User Status Enforcement

- **Active check**: Disabled users cannot login
- **Force logout**: If user becomes inactive, session is invalidated
- **Status check**: Validated on every session access

### Audit Logging

All authentication events are logged:
- Login (with IP and user agent)
- Logout (with IP)
- Can be extended for other actions

## Usage Examples

### Server-Side (API Routes)

```typescript
import { getSession, requireSession, requirePermission } from "@/lib/auth/session"

// Get session (returns null if not authenticated)
const session = await getSession()

// Require authentication (throws if not authenticated)
const session = await requireSession()

// Require specific permission
const session = await requirePermission("canManageUsers")

// Using helper wrapper
import { withAuth, withPermission } from "@/lib/auth/api-helpers"

export async function GET() {
  return withAuth(async (session) => {
    // session is guaranteed to exist here
    return NextResponse.json({ user: session })
  })
}

export async function POST() {
  return withPermission("canManageUsers", async (session) => {
    // User has permission
    // ... your logic
  })
}
```

### Client-Side (React Components)

```typescript
"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

function MyComponent() {
  const { user, isAuthenticated, can, logout } = useAuth()
  
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return (
    <div>
      <p>Hello, {user?.name}</p>
      {can("canManageUsers") && (
        <button>Manage Users</button>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Protect entire page
export default function AdminPage() {
  return (
    <ProtectedRoute requiredPermission="canManageUsers">
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### Protecting Routes

The middleware automatically protects routes. Public routes are defined in `middleware.ts`:

```typescript
const publicRoutes = ["/login"]
```

All other routes require authentication.

## Environment Variables

No additional environment variables are required beyond your existing MongoDB setup.

## Dependencies to Install

```bash
pnpm add bcrypt @types/bcrypt
```

## Session Cookie Configuration

- **Name**: `rummi_session`
- **HttpOnly**: `true` (prevents JavaScript access)
- **Secure**: `true` in production (HTTPS only)
- **SameSite**: `lax` (CSRF protection)
- **MaxAge**: 7 days
- **Path**: `/` (available site-wide)

## Session Expiration

Sessions expire after 7 days. The expiration is checked:
1. On every session access
2. By MongoDB TTL index (auto-cleanup)

## Force Logout

To force logout a user:
1. Set user status to "inactive" in database
2. Or delete their session(s) from MongoDB
3. Next request will invalidate the session

## Audit Logging

Audit logs are stored in the `AuditLog` collection:

```typescript
import { logAudit, logLogin, logLogout } from "@/lib/auth/audit"

// Log custom action
await logAudit({
  userId: user._id,
  action: "create",
  module: "users",
  recordId: newUser._id,
  details: { name: newUser.name },
  ipAddress: request.headers.get("x-forwarded-for"),
  userAgent: request.headers.get("user-agent"),
})

// Log login
await logLogin(user._id, ipAddress, userAgent)

// Log logout
await logLogout(user._id, ipAddress)
```

## Permission System

Permissions are defined in the `Role` model and checked using:

- **Server-side**: `requirePermission(permission)`
- **Client-side**: `can(permission)` from `useAuth()`

Available permissions are defined in `types/db.ts` as `RolePermissions`.

## Troubleshooting

### Session not persisting
- Check cookie settings (secure, httpOnly)
- Verify MongoDB connection
- Check browser console for cookie errors

### User can't login
- Verify user exists and has passwordHash
- Check user status is "active"
- Verify password is correct
- Check audit logs for login attempts

### Permission denied
- Verify role has the required permission
- Check `can()` function is called correctly
- Ensure session includes role data

### Force logout not working
- Verify user status is set to "inactive"
- Check session is being validated on each request
- Manually delete session from MongoDB if needed
