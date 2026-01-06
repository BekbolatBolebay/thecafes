# ADMIN PANEL QUICK START GUIDE

## What Was Created

### Database Schema (PostgreSQL)
- `admin_users` - Stores admin users with roles
- `admin_sessions` - JWT session management
- `admin_audit_log` - Tracks all admin actions
- `cities`, `cafes`, `tables`, `bookings` - Core entities

**Files:**
- `scripts/07-admin-panel-schema.sql` - Create tables
- `scripts/08-seed-admin-users.sql` - Seed initial admins

### Authentication & Authorization
- **RBAC System** with 3 roles:
  - `SUPER_ADMIN` - Full access, can manage admins
  - `CITY_ADMIN` - Manage cafes in their city
  - `CAFE_ADMIN` - Manage tables and bookings

**Files:**
- `lib/admin-auth.ts` - Role definitions & permissions
- `lib/admin-auth-server.ts` - Server-side auth helpers
- `lib/admin-context.tsx` - Global state management

### API Routes (Already Created)
- `app/api/admin/auth/login/route.ts` - Login
- `app/api/admin/auth/verify/route.ts` - Verify session
- `app/api/admin/auth/logout/route.ts` - Logout
- `app/api/admin/demo-mode/route.ts` - Toggle demo mode

### Frontend Pages (Already Created)
- `app/admin/login/page.tsx` - Login form
- `app/admin/dashboard/page.tsx` - Main dashboard
- `app/admin/cities/page.tsx` - Manage cities
- `app/admin/page.tsx` - Main redirect

### Components & Utilities
- `components/admin/protected-admin-route.tsx` - Route protection
- `app/layout.tsx` - Updated with AdminProvider

---

## IMMEDIATE NEXT STEPS

### 1. Install Dependencies ⚠️ REQUIRED
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 2. Generate Password Hashes
```bash
node
```
```javascript
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '1234Pppp!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Hash:', hash);
}

generateHash();
```

Copy the hash and update `scripts/08-seed-admin-users.sql`

### 3. Run Database Migrations

In Supabase SQL Editor, run:
```sql
-- 1. Create tables
\i scripts/07-admin-panel-schema.sql

-- 2. Seed admin users (UPDATE HASHES FIRST!)
\i scripts/08-seed-admin-users.sql
```

### 4. Update Environment Variables

Add to `.env.local`:
```env
JWT_SECRET=your-random-secret-key-min-32-chars
JWT_EXPIRATION=24h
ADMIN_SESSION_TIMEOUT_HOURS=24
```

### 5. Implement Database Functions

In `lib/admin-auth-server.ts`, uncomment and implement:
- `getAdminUserByEmail()` - Query admin user
- `createAdminSession()` - Create JWT session
- `getAdminSession()` - Verify session
- `invalidateAdminSession()` - Logout
- `logAdminAction()` - Audit logging

Example implementation (using Supabase):
```typescript
import { getSupabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function getAdminUserByEmail(email: string) {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  return data
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
```

### 6. Test It Out

1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin/login`
3. Use credentials:
   - Email: `bolebay.bekbolat.25@gmail.com`
   - Password: `1234Pppp!`

---

## ROLE-BASED PERMISSIONS

### SUPER_ADMIN
- ✅ Manage all admins
- ✅ Manage all cities
- ✅ Manage all cafes
- ✅ Manage bookings everywhere
- ✅ Toggle demo mode
- ✅ View audit logs

### CITY_ADMIN
- ✅ Manage cafes in their city
- ✅ Manage tables in their cafes
- ✅ Manage bookings in their cafes
- ❌ Cannot create/delete cities
- ❌ Cannot create other admins

### CAFE_ADMIN
- ✅ Manage tables in their cafe
- ✅ Manage bookings for their cafe
- ❌ Cannot manage cafes
- ❌ Cannot create/delete tables

---

## DEMO MODE

Demo mode RESTRICTS these actions (Super Admin only):
- ❌ Delete cafes
- ❌ Delete cities
- ❌ Delete bookings
- ❌ Disable admin users
- ❌ Export data

**Purpose**: Safe testing without losing data

**Usage**:
```typescript
import { useAdmin, useDemoMode } from '@/lib/admin-context'

function MyComponent() {
  const { setDemoMode } = useAdmin()
  const demoEnabled = useDemoMode()

  return (
    <button onClick={() => setDemoMode(!demoEnabled)}>
      Demo: {demoEnabled ? 'ON' : 'OFF'}
    </button>
  )
}
```

---

## USING HOOKS IN COMPONENTS

### Check Authentication
```typescript
import { useAdmin } from '@/lib/admin-context'

const { adminUser, isAuthenticated, logout } = useAdmin()

if (!isAuthenticated) return <LoginPage />
```

### Check Permissions
```typescript
import { usePermission } from '@/lib/admin-context'

const canDeleteCity = usePermission('DELETE_CITY')

if (!canDeleteCity) return <AccessDenied />
```

### Check Role
```typescript
import { useAdminRole } from '@/lib/admin-context'

const isSuperAdmin = useAdminRole('SUPER_ADMIN')
```

### Check Demo Mode
```typescript
import { useDemoMode } from '@/lib/admin-context'

const demoEnabled = useDemoMode()

if (demoEnabled && action === 'DELETE_CAFE') {
  alert('Deletions restricted in demo mode')
  return
}
```

---

## PROTECTING ROUTES

### Option 1: Entire Page
```tsx
// app/admin/special/page.tsx
import { ProtectedAdminRoute } from '@/components/admin/protected-admin-route'

export default function SpecialPage() {
  return (
    <ProtectedAdminRoute requiredRoles={['SUPER_ADMIN']}>
      <YourContent />
    </ProtectedAdminRoute>
  )
}
```

### Option 2: Component-Level
```tsx
import { usePermission } from '@/lib/admin-context'

function DeleteButton() {
  const canDelete = usePermission('DELETE_CITY')

  if (!canDelete) return null

  return <button>Delete</button>
}
```

---

## API ROUTE TEMPLATE

Use this for all admin API routes:

```typescript
// app/api/admin/[feature]/route.ts
import { NextRequest } from 'next/server'
import {
  unauthorizedResponse,
  forbiddenResponse,
  successResponse,
  errorResponse,
  extractTokenFromRequest,
  getAdminSession,
  getAdminUserById,
  logAdminAction,
  isActionRestrictedInDemoMode,
} from '@/lib/admin-auth-server'

export async function POST(req: NextRequest) {
  try {
    // 1. Extract token
    const token = extractTokenFromRequest(req)
    if (!token) return unauthorizedResponse()

    // 2. Verify session
    const session = await getAdminSession(token)
    if (!session?.is_active) return unauthorizedResponse()

    // 3. Get user
    const user = await getAdminUserById(session.admin_user_id)
    if (!user?.is_active) return unauthorizedResponse()

    // 4. Check permission
    if (user.role !== 'SUPER_ADMIN') {
      return forbiddenResponse('Super Admin required')
    }

    // 5. Check demo mode
    const isRestricted = await isActionRestrictedInDemoMode(
      'ACTION_NAME',
      user.demo_mode_enabled
    )
    if (isRestricted) {
      return forbiddenResponse('Action restricted in demo mode')
    }

    // 6. Process request
    const { data } = await req.json()
    // ... do something ...

    // 7. Log action
    await logAdminAction(
      user.id,
      'ACTION_NAME',
      'ENTITY_TYPE',
      entityId,
      oldValues,
      newValues,
      req.ip
    )

    // 8. Return response
    return successResponse({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return errorResponse('Internal server error', 500)
  }
}
```

---

## FILES STRUCTURE

```
/food-delivery-app
├── app/
│   ├── admin/
│   │   ├── page.tsx                    ← Main redirect
│   │   ├── login/page.tsx              ← Login form
│   │   ├── dashboard/page.tsx          ← Dashboard
│   │   ├── cities/page.tsx             ← Manage cities
│   │   └── (create: cafes, tables, bookings, users)
│   │
│   ├── api/admin/
│   │   ├── auth/
│   │   │   ├── login/route.ts          ← Login API
│   │   │   ├── verify/route.ts         ← Verify session
│   │   │   └── logout/route.ts         ← Logout API
│   │   │
│   │   ├── demo-mode/route.ts          ← Toggle demo mode
│   │   └── (create: cities, cafes, tables, bookings, users)
│   │
│   └── layout.tsx                      ← Updated with AdminProvider
│
├── components/
│   └── admin/
│       └── protected-admin-route.tsx   ← Route protection wrapper
│
├── lib/
│   ├── admin-auth.ts                   ← Role definitions & permissions
│   ├── admin-auth-server.ts            ← Server-side auth helpers
│   └── admin-context.tsx               ← Global state management
│
├── scripts/
│   ├── 07-admin-panel-schema.sql       ← Database schema
│   └── 08-seed-admin-users.sql         ← Seed admins
│
└── ADMIN_PANEL_INTEGRATION_GUIDE.md    ← Full integration guide
```

---

## TROUBLESHOOTING

### "Module not found" error for bcryptjs
```bash
npm install bcryptjs @types/bcryptjs
```

### Session not persisting
- Check localStorage in browser DevTools
- Verify JWT_SECRET in .env.local
- Clear localStorage and log in again

### Login failing
- Check password hash is correct
- Verify admin_users table exists
- Check database connection

### Routes returning 401
- Verify Authorization header is sent
- Check token hasn't expired
- Verify session exists in database

---

## NEXT: CREATE REMAINING PAGES

Copy the template from `app/admin/cities/page.tsx` to create:

1. **Cafes** (`app/admin/cafes/page.tsx`)
2. **Tables** (`app/admin/tables/page.tsx`)
3. **Bookings** (`app/admin/bookings/page.tsx`)
4. **Admin Users** (`app/admin/users/page.tsx`) - Super Admin only

Then create corresponding API routes in `app/api/admin/`

---

## PRODUCTION CHECKLIST

- [ ] Install bcryptjs & jsonwebtoken
- [ ] Generate real password hashes
- [ ] Run database migrations
- [ ] Set strong JWT_SECRET
- [ ] Test login with real credentials
- [ ] Test all permissions
- [ ] Test demo mode
- [ ] Deploy to production
- [ ] Monitor audit logs
- [ ] Set up admin notifications
