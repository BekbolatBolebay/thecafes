"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"

interface AdminGuardProps {
  children: ReactNode
  requiredPermission?: string
}

export function AdminGuard({ children, requiredPermission }: AdminGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, adminUser, hasPermission } = useAdmin()

  useEffect(() => {
    if (isLoading) return

    // Check authentication
    if (!isAuthenticated || !adminUser) {
      router.push("/admin/login")
      return
    }

    // Check permission if required
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/admin/dashboard")
      return
    }
  }, [isAuthenticated, isLoading, adminUser, requiredPermission, router, hasPermission])

  // Show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !adminUser) {
    return null
  }

  // Check permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page</p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 bg-accent text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
