# ============================================================================
# ADMIN PANEL INTEGRATION GUIDE
# ============================================================================
# Complete guide for integrating the admin panel into your existing client app
# ============================================================================

## TABLE OF CONTENTS
1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [Dependencies Installation](#dependencies-installation)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Integration](#frontend-integration)
6. [Testing & Deployment](#testing--deployment)
7. [Troubleshooting](#troubleshooting)

---

## OVERVIEW

The admin panel provides:
- **Role-Based Access Control (RBAC)** with 3 levels: Super Admin, City Admin, Cafe Admin
- **Demo Mode** for safe testing (restricts destructive actions)
- **Session Management** with JWT tokens
- **Audit Logging** for all admin actions
- **Frontend & Backend protection** with middleware

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                  Next.js Frontend                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Admin Pages (Protected Routes)           │   │
│  │  - Dashboard (/admin/dashboard)                  │   │
│  │  - Cities (/admin/cities)                        │   │
│  │  - Cafes (/admin/cafes)                          │   │
│  │  - Bookings (/admin/bookings)                    │   │
│  └──────────────────────────────────────────────────┘   │
│                        ↑ uses                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Admin Context (lib/admin-context.tsx)       │   │
│  │  - Authentication State                          │   │
│  │  - Permission Checking                           │   │
│  │  - Demo Mode Toggle                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↑ API Calls
┌─────────────────────────────────────────────────────────┐
│               Next.js API Routes                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Authentication APIs                      │   │
│  │  - POST /api/admin/auth/login                    │   │
│  │  - POST /api/admin/auth/verify                   │   │
│  │  - POST /api/admin/auth/logout                   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Resource APIs                            │   │
│  │  - GET/POST /api/admin/cities                    │   │
│  │  - GET/POST /api/admin/cafes                     │   │
│  │  - GET/POST /api/admin/bookings                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Demo Mode API                            │   │
│  │  - POST /api/admin/demo-mode                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                        ↑ Queries
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Core Tables                         │   │
│  │  - admin_users (with roles, hashed passwords)    │   │
│  │  - admin_sessions (JWT tokens, expiration)       │   │
│  │  - cities, cafes, tables, bookings               │   │
│  │  - admin_audit_log (all admin actions)           │   │
│  │  - demo_mode_restrictions                        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## DATABASE SETUP

### Step 1: Run Migration Scripts

Execute SQL migration scripts in order:

```bash
# Run from Supabase SQL Editor or your database client
1. scripts/07-admin-panel-schema.sql
2. scripts/08-seed-admin-users.sql
```

### Step 2: Generate Password Hashes

Create password hashes for the super admin users:

```bash
# In Node.js
node
```

```javascript
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '1234Pppp!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
}

generateHash();
```

Copy the generated hash and update `scripts/08-seed-admin-users.sql` with actual hashes.

### Step 3: Seed Data

Update admin users with real password hashes:

```sql
-- In scripts/08-seed-admin-users.sql
-- Replace the placeholder hashes with actual bcrypt hashes
UPDATE admin_users SET password_hash = '<your-bcrypt-hash>' WHERE email = 'bolebay.bekbolat.25@gmail.com';
UPDATE admin_users SET password_hash = '<your-bcrypt-hash>' WHERE email = 'nugnurd@gmail.com';
```

---

## DEPENDENCIES INSTALLATION

### 1. Install Required Packages

```bash
npm install bcryptjs jsonwebtoken
# or with pnpm
pnpm add bcryptjs jsonwebtoken
```

### 2. Install Type Definitions (Optional but Recommended)

```bash
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 3. Update .env.local

Add these environment variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Admin Session
ADMIN_SESSION_TIMEOUT_HOURS=24

# Database (if not using Supabase)
DATABASE_URL=your-database-url
```

---

## BACKEND IMPLEMENTATION

### Step 1: Implement Authentication Functions

Update `lib/admin-auth-server.ts` with your database:

```typescript
// lib/admin-auth-server.ts

import { getSupabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function getAdminUserByEmail(email: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  return data
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createJWT(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION || '24h',
  })
}

export function verifyJWT(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!)
}
```

### Step 2: Implement API Routes

The following API routes are pre-built and ready to use:

- `app/api/admin/auth/login/route.ts` - Login endpoint
- `app/api/admin/auth/verify/route.ts` - Session verification
- `app/api/admin/auth/logout/route.ts` - Logout endpoint
- `app/api/admin/demo-mode/route.ts` - Toggle demo mode

**Important:** Update the TODO sections in each route with actual database queries.

### Step 3: Create Resource Management APIs

Create these additional routes for CRUD operations:

**File: `app/api/admin/cities/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import {
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  extractTokenFromRequest,
  getAdminSession,
  getAdminUserById,
  logAdminAction,
  isActionRestrictedInDemoMode,
} from '@/lib/admin-auth-server'

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req)
    if (!token) return unauthorizedResponse()

    const session = await getAdminSession(token)
    if (!session) return unauthorizedResponse()

    const user = await getAdminUserById(session.admin_user_id)
    if (!user) return unauthorizedResponse()

    // TODO: Query cities from database
    // Filter by user's city if CITY_ADMIN

    return successResponse({ cities: [] })
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromRequest(req)
    if (!token) return unauthorizedResponse()

    const session = await getAdminSession(token)
    if (!session) return unauthorizedResponse()

    const user = await getAdminUserById(session.admin_user_id)
    if (!user) return unauthorizedResponse()

    // Check permissions
    if (user.role !== 'SUPER_ADMIN') {
      return forbiddenResponse('Only Super Admins can create cities')
    }

    const { name, state } = await req.json()

    // TODO: Create city in database
    await logAdminAction(user.id, 'CREATE_CITY', 'CITY', undefined, undefined, { name, state }, req.ip)

    return successResponse({ success: true }, 201)
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
```

---

## FRONTEND INTEGRATION

### Step 1: Update Layout

The layout has already been updated with `AdminProvider`. It's in `app/layout.tsx`:

```tsx
import { AdminProvider } from '@/lib/admin-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AdminProvider>
          <AppProvider>{children}</AppProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
```

### Step 2: Add Admin Link to Navigation

Update your navigation to include admin link (only visible to admins):

```tsx
// components/bottom-nav.tsx or components/navigation.tsx

import { useAdmin } from '@/lib/admin-context'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export function Navigation() {
  const { adminUser } = useAdmin()

  return (
    <>
      {/* ... existing navigation ... */}
      
      {/* Admin Link - Show only to admin users */}
      {adminUser && (
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
        >
          <Settings className="w-4 h-4" />
          <span>Admin Panel</span>
        </Link>
      )}
    </>
  )
}
```

### Step 3: Create Admin Pages

Use the provided templates for these pages:

- **Dashboard**: `app/admin/dashboard/page.tsx` ✅
- **Login**: `app/admin/login/page.tsx` ✅
- **Cities**: `app/admin/cities/page.tsx` ✅
- **Cafes**: Create similar to cities
- **Tables**: Create similar to cities
- **Bookings**: Create for viewing/managing bookings
- **Users**: Create for managing admin users (Super Admin only)

### Step 4: Use Hooks in Components

Use the provided hooks to build admin features:

```tsx
import { useAdmin, usePermission, useDemoMode, useAdminRole } from '@/lib/admin-context'

export function MyAdminComponent() {
  const { adminUser, logout } = useAdmin()
  const canManageCitites = usePermission('MANAGE_CITIES')
  const demoEnabled = useDemoMode()
  const isSuperAdmin = useAdminRole('SUPER_ADMIN')

  if (!canManageAdmins) {
    return <div>Access Denied</div>
  }

  return (
    <div>
      {demoEnabled && <p>Demo mode is on</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## TESTING & DEPLOYMENT

### Local Testing

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to admin login:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Use test credentials:**
   - Email: `bolebay.bekbolat.25@gmail.com`
   - Password: `1234Pppp!`

4. **Test demo mode toggle** (Super Admin only)

5. **Test role-based access:**
   - Create additional admin users with CITY_ADMIN and CAFE_ADMIN roles
   - Verify they can only access their assigned resources

### Production Deployment Checklist

- [ ] Update `JWT_SECRET` with strong random string
- [ ] Replace password hashes with real bcrypt hashes
- [ ] Test all API endpoints with your database
- [ ] Enable HTTPS for all admin traffic
- [ ] Configure CORS if backend is separate
- [ ] Set up rate limiting on authentication endpoints
- [ ] Enable database RLS (Row Level Security) policies
- [ ] Set up audit log rotation/archival
- [ ] Configure email notifications for admin activities
- [ ] Test session expiration and refresh logic

---

## ADDING NEW ADMIN FEATURES

### Add New Permission

1. Update `lib/admin-auth.ts`:

```typescript
export function hasPermission(role: AdminRole, action: string): boolean {
  const rolePermissions: Record<AdminRole, string[]> = {
    [AdminRole.SUPER_ADMIN]: [
      // ... existing permissions
      "MY_NEW_ACTION",
    ],
    // ...
  }
  return rolePermissions[role]?.includes(action) ?? false
}
```

2. Check permission in component:

```typescript
const canDoAction = usePermission("MY_NEW_ACTION")
```

### Add New Admin User

```sql
-- Insert new admin user
INSERT INTO admin_users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  city_id,
  cafe_id,
  is_active
) VALUES (
  'newadmin@example.com',
  '$2a$10$...',  -- bcrypt hash
  'Admin',
  'User',
  'CITY_ADMIN',
  'city-uuid',
  NULL,
  true
);
```

### Restrict Action in Demo Mode

1. Update `lib/admin-auth.ts`:

```typescript
export const DEMO_MODE_RESTRICTED_ACTIONS = [
  // ... existing
  "MY_DESTRUCTIVE_ACTION",
]
```

2. Check in API route:

```typescript
const restricted = await isActionRestrictedInDemoMode(
  "MY_DESTRUCTIVE_ACTION",
  user.demoModeEnabled
)
if (restricted) {
  return demoModeRestrictionResponse("MY_DESTRUCTIVE_ACTION")
}
```

---

## TROUBLESHOOTING

### "Session expired or invalid"

**Cause**: JWT token is expired or session doesn't exist in database

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Log in again
3. Check JWT_SECRET matches on server and client

### "Only Super Admins can access this"

**Cause**: Your admin user role is not SUPER_ADMIN

**Solution**:
1. Update user role in database: `UPDATE admin_users SET role = 'SUPER_ADMIN' WHERE email = 'your@email.com'`
2. Log out and log back in

### Database queries returning null

**Cause**: Database functions in `lib/admin-auth-server.ts` are not implemented

**Solution**:
1. Uncomment and implement each function with your database client
2. Verify database tables exist: `SELECT * FROM admin_users;`

### CORS errors when calling APIs

**Cause**: Frontend and backend on different origins

**Solution**:
1. Ensure `Authorization` header is sent with requests
2. Add CORS middleware to Next.js: Install `cors` package
3. Configure allowed origins in middleware

### Password hash not matching

**Cause**: Using mismatched bcryptjs rounds or outdated hash

**Solution**:
1. Regenerate hashes with `bcryptjs` at 10 rounds
2. Ensure password is trimmed: `password.trim()`
3. Use same salt rounds everywhere

---

## ADDITIONAL RESOURCES

- [Bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Role-Based Access Control (RBAC)](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

---

## SUPPORT

For issues or questions:
1. Check the troubleshooting section above
2. Review code comments in implementation files
3. Check browser console for errors
4. Review server logs for API errors
