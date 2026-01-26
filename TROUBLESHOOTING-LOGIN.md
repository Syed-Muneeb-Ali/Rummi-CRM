# Troubleshooting Login Issues

## Common Issues and Solutions

### Issue: Login succeeds but redirects back to login page

**Possible Causes:**

1. **Cookie not being set properly**
   - Check browser console for cookie errors
   - Verify browser allows cookies
   - Check if you're in incognito/private mode
   - Ensure you're not blocking third-party cookies

2. **Cookie domain/path mismatch**
   - Cookie is set for `/` path
   - Should work for all routes
   - Check browser DevTools > Application > Cookies

3. **Session not being created in database**
   - Check MongoDB connection
   - Verify Session collection exists
   - Check server logs for errors

4. **Middleware redirecting before cookie is available**
   - Cookie might not be immediately available after setting
   - Using `window.location.href` should fix this (full page reload)

## Debugging Steps

1. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for any errors during login

2. **Check Network tab:**
   - Open DevTools > Network
   - Try logging in
   - Check `/api/auth/login` response
   - Verify `Set-Cookie` header is present
   - Check `/api/auth/session` response after login

3. **Check Cookies:**
   - Open DevTools > Application > Cookies
   - Look for `rummi_session` cookie
   - Verify it has correct domain, path, and httpOnly flag

4. **Check server logs:**
   - Look for `[login] Session created:` log
   - Check for any error messages

## Quick Fixes

### If cookie isn't being set:

1. **Check environment:**
   ```bash
   # Make sure you're running in development
   # In production, secure cookies require HTTPS
   ```

2. **Clear browser cache and cookies:**
   - Clear all cookies for localhost
   - Try again

3. **Try different browser:**
   - Test in Chrome, Firefox, or Edge
   - Some browsers have stricter cookie policies

### If session check fails:

1. **Verify user exists:**
   ```bash
   # Run this to check if admin user exists
   # You can add this to a script or run in MongoDB shell
   db.users.findOne({ email: "admin@rummi.com" })
   ```

2. **Verify role exists:**
   ```bash
   db.roles.findOne({ name: "superadmin" })
   ```

3. **Check session collection:**
   ```bash
   db.sessions.find().sort({ createdAt: -1 }).limit(1)
   ```

## Testing Login Flow

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Navigate to** `http://localhost:3000/login`
4. **Enter credentials** and submit
5. **Check the requests:**
   - `/api/auth/login` should return 200 with `Set-Cookie` header
   - `/api/auth/session` should return 200 with `authenticated: true`
   - `/dashboard` should load (not redirect to `/login`)

## Manual Cookie Test

You can test if cookies work by running this in browser console after login:

```javascript
// Check if cookie exists
document.cookie

// Should include: rummi_session=...
```

Note: Since cookie is httpOnly, you won't see it in `document.cookie`, but you can check in DevTools > Application > Cookies.
