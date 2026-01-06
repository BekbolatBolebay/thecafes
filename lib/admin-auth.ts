// ============================================================================
// ADMIN AUTHENTICATION & RBAC
// ============================================================================

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CITY_ADMIN = "CITY_ADMIN",
  CAFE_ADMIN = "CAFE_ADMIN",
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  isActive: boolean
  demoModeEnabled: boolean
  cityId?: string | null
  cafeId?: string | null
  lastLogin?: Date
  createdAt: Date
  password_hash?: string
}

// ============================================================================
// PERMISSIONS BY ROLE
// ============================================================================

const ROLE_PERMISSIONS: Record<AdminRole, Set<string>> = {
  [AdminRole.SUPER_ADMIN]: new Set([
    // Admin management
    "MANAGE_ADMINS",
    "VIEW_ADMIN_LOGS",
    "MANAGE_ROLES",
    
    // Cities
    "MANAGE_CITIES",
    "VIEW_CITIES",
    
    // Restaurants/Cafes
    "MANAGE_RESTAURANTS",
    "VIEW_RESTAURANTS",
    "MANAGE_CATEGORIES",
    
    // Menu items
    "MANAGE_MENU_ITEMS",
    "VIEW_MENU_ITEMS",
    
    // Orders
    "VIEW_ORDERS",
    "MANAGE_ORDERS",
    "CANCEL_ORDERS",
    
    // Bookings
    "VIEW_BOOKINGS",
    "MANAGE_BOOKINGS",
    "CANCEL_BOOKINGS",
    
    // Tables
    "MANAGE_TABLES",
    "VIEW_TABLES",
    
    // Users
    "VIEW_USERS",
    "MANAGE_USERS",
    "BAN_USERS",
    
    // Analytics
    "VIEW_ANALYTICS",
    "EXPORT_DATA",
    
    // Settings
    "MODIFY_SETTINGS",
    "MODIFY_DEMO_MODE",
  ]),

  [AdminRole.CITY_ADMIN]: new Set([
    "VIEW_CITIES",
    "MANAGE_RESTAURANTS", // Can manage restaurants in their city
    "VIEW_RESTAURANTS",
    "MANAGE_MENU_ITEMS",
    "VIEW_MENU_ITEMS",
    "VIEW_ORDERS", // Can view orders in their city
    "MANAGE_ORDERS",
    "VIEW_BOOKINGS",
    "MANAGE_BOOKINGS",
    "VIEW_USERS",
    "VIEW_ANALYTICS",
  ]),

  [AdminRole.CAFE_ADMIN]: new Set([
    "VIEW_RESTAURANTS",
    "MANAGE_MENU_ITEMS", // Only their own cafe
    "VIEW_MENU_ITEMS",
    "VIEW_ORDERS", // Only their cafe orders
    "MANAGE_ORDERS",
    "VIEW_BOOKINGS", // Only their cafe bookings
    "MANAGE_BOOKINGS",
    "MANAGE_TABLES", // Only their cafe tables
    "VIEW_TABLES",
  ]),
}

// ============================================================================
// ACTIONS RESTRICTED IN DEMO MODE
// ============================================================================

const DEMO_MODE_RESTRICTED_ACTIONS = new Set([
  "MANAGE_ADMINS",
  "MANAGE_ROLES",
  "MANAGE_CITIES",
  "MANAGE_RESTAURANTS",
  "MANAGE_CATEGORIES",
  "MANAGE_MENU_ITEMS",
  "CANCEL_ORDERS",
  "CANCEL_BOOKINGS",
  "MANAGE_USERS",
  "BAN_USERS",
  "MODIFY_SETTINGS",
  "MODIFY_DEMO_MODE",
  "MANAGE_TABLES",
])

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

export function hasPermission(role: AdminRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.has(permission) : false
}

export function canPerformAction(
  demoModeEnabled: boolean,
  action: string,
  role: AdminRole
): { allowed: boolean; message?: string } {
  // Check role-based permission first
  if (!hasPermission(role, action)) {
    return {
      allowed: false,
      message: `You don't have permission to perform this action`,
    }
  }

  // Check demo mode restrictions
  if (demoModeEnabled && DEMO_MODE_RESTRICTED_ACTIONS.has(action)) {
    return {
      allowed: false,
      message: "This action is restricted in demo mode",
    }
  }

  return { allowed: true }
}

// ============================================================================
// SESSION STORAGE
// ============================================================================

export function getAdminSessionToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_session_token")
  }
  return null
}

export function storeAdminSessionToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_session_token", token)
  }
}

export function clearAdminSessionToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_session_token")
  }
}

export function getAdminUser(): AdminUser | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("admin_user")
    if (stored) {
      try {
        return JSON.parse(stored) as AdminUser
      } catch (err) {
        console.error("Error parsing stored admin user:", err)
        return null
      }
    }
  }
  return null
}

export function storeAdminUser(user: AdminUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_user", JSON.stringify(user))
  }
}

export function clearAdminUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_user")
  }
}

export function generateSessionToken(): string {
  // Generate a simple token (in production, use JWT from server)
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}
