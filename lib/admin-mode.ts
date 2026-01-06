// ============================================================================
// ADMIN MODE UTILITIES
// ============================================================================
// Allow admins to manage/customize the entire client panel

import { AdminUser } from "./admin-auth"

export interface AdminModeContext {
  isAdminMode: boolean
  adminUser: AdminUser | null
  canEdit: boolean
  canDelete: boolean
  canCreate: boolean
}

/**
 * Check if user is admin and can edit client content
 */
export function canAdminEditContent(adminUser: AdminUser | null): boolean {
  if (!adminUser) return false
  return ["SUPER_ADMIN", "CITY_ADMIN"].includes(adminUser.role)
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(adminUser: AdminUser | null): boolean {
  return adminUser?.role === "SUPER_ADMIN"
}

/**
 * Check if user is admin (any role)
 */
export function isAdmin(adminUser: AdminUser | null): boolean {
  return adminUser?.role !== undefined
}

/**
 * Get admin mode context for a page
 */
export function getAdminModeContext(adminUser: AdminUser | null): AdminModeContext {
  const isAdminMode = isAdmin(adminUser)
  return {
    isAdminMode,
    adminUser,
    canEdit: canAdminEditContent(adminUser),
    canDelete: isSuperAdmin(adminUser),
    canCreate: canAdminEditContent(adminUser),
  }
}
