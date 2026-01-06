// ============================================================================
// ADMIN PROTECTED ROUTE WRAPPER
// ============================================================================
// Location: components/admin/protected-admin-route.tsx
// Purpose: Higher-order component to protect admin routes with role checks
// Usage: Wrap admin pages with this component for permission-based access
// ============================================================================

"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import type { AdminRole } from "@/lib/admin-auth"

interface ProtectedAdminRouteProps {
  children: ReactNode
  requiredRoles?: AdminRole[]
  requiredPermission?: string
}

/**
 * Protected route wrapper for admin pages
 *
 * @example
 * // Require specific roles
 * <ProtectedAdminRoute requiredRoles={["SUPER_ADMIN", "CITY_ADMIN"]}>
 *   <AdminPage />
 * </ProtectedAdminRoute>
 *
 * @example
 * // Require specific permission
 * <ProtectedAdminRoute requiredPermission="MANAGE_ADMINS">
 *   <AdminUsersPage />
 * </ProtectedAdminRoute>
 */
export function ProtectedAdminRoute({
  children,
  requiredRoles,
  requiredPermission,
}: ProtectedAdminRouteProps) {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading, hasPermission } = useAdmin()

  useEffect(() => {
    if (isLoading) return

    // Check if user is authenticated
    if (!isAuthenticated || !adminUser) {
      router.push("/admin/login")
      return
    }

    // Check required roles
    if (requiredRoles && !requiredRoles.includes(adminUser.role)) {
      router.push("/admin/dashboard")
      return
    }

    // Check required permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/admin/dashboard")
      return
    }
  }, [isAuthenticated, adminUser, isLoading, requiredRoles, requiredPermission, hasPermission, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !adminUser) {
    return null
  }

  if (requiredRoles && !requiredRoles.includes(adminUser.role)) {
    return null
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  return <>{children}</>
}

/**
 * Hook-based alternative for inline permission checks
 *
 * @example
 * const canAccess = useAdminAccess("MANAGE_ADMINS")
 * if (!canAccess) return <AccessDenied />
 */
export function useAdminAccess(requiredPermission: string): boolean {
  const { adminUser, hasPermission } = useAdmin()
  return !!adminUser && hasPermission(requiredPermission)
}

/**
 * Component for showing access denied message
 */
export function AdminAccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 mb-6">You don't have permission to access this page.</p>
        <a
          href="/admin/dashboard"
          className="inline-block px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
