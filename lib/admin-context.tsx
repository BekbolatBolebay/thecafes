"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { AdminUser, AdminRole } from "./admin-auth"
import {
  getAdminSessionToken,
  storeAdminSessionToken,
  clearAdminSessionToken,
  getAdminUser,
  storeAdminUser,
  clearAdminUser,
  hasPermission,
  canPerformAction,
  generateSessionToken,
  AdminRole as AdminRoleEnum,
} from "./admin-auth"

interface AdminContextType {
  adminUser: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  sessionToken: string | null
  demoModeEnabled: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  updateAdminUser: (updates: Partial<AdminUser>) => Promise<void>
  clearError: () => void
  hasPermission: (permission: string) => boolean
  canPerformAction: (action: string, resource?: string) => boolean | { allowed: boolean; message?: string }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoModeEnabled, setDemoModeEnabled] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = getAdminSessionToken()
        const storedUser = getAdminUser()

        if (storedToken && storedUser) {
          setSessionToken(storedToken)
          setAdminUser(storedUser)
          setDemoModeEnabled(storedUser.demoModeEnabled)
        }
      } catch (err) {
        console.error("[AdminProvider] Auth check error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null)
      setIsLoading(true)

      console.log("[AdminContext] Attempting login for:", email)

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      console.log("[AdminContext] Login response:", data.success ? "SUCCESS" : "FAILED", data.message)

      if (!response.ok) {
        const message = data.message || "Login failed"
        console.error("[AdminContext] Login error:", message)
        setError(message)
        return { success: false, message }
      }

      console.log("[AdminContext] Storing session data...")
      storeAdminSessionToken(data.token)
      storeAdminUser(data.user)

      setAdminUser(data.user)
      setSessionToken(data.token)
      setDemoModeEnabled(data.user.demoModeEnabled)

      console.log("[AdminContext] Login successful!")
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred during login"
      console.error("[AdminContext] Login error:", message)
      setError(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch("/api/admin/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        })
      }

      clearAdminSessionToken()
      clearAdminUser()
      setAdminUser(null)
      setSessionToken(null)
      setDemoModeEnabled(false)
    } catch (err) {
      console.error("[AdminProvider] Logout error:", err)
    }
  }

  const updateAdminUser = async (updates: Partial<AdminUser>) => {
    try {
      const updatedUser = { ...adminUser, ...updates } as AdminUser
      storeAdminUser(updatedUser)
      setAdminUser(updatedUser)

      if (updates.demoModeEnabled !== undefined) {
        setDemoModeEnabled(updates.demoModeEnabled)
      }
    } catch (err) {
      console.error("[AdminProvider] Update error:", err)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AdminContextType = {
    adminUser,
    isAuthenticated: !!adminUser && !!sessionToken,
    isLoading,
    error,
    sessionToken,
    demoModeEnabled,
    login,
    logout,
    updateAdminUser,
    clearError,
    hasPermission: (permission: string) => {
      if (!adminUser) return false
      return hasPermission(adminUser.role, permission)
    },
    canPerformAction: (action: string, resource?: string) => {
      if (!adminUser) return false
      const result = canPerformAction(demoModeEnabled, action, adminUser.role)
      return typeof result === "object" ? result.allowed : result
    },
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

export function usePermission(permission?: string): boolean | { hasPermission: (p: string) => boolean; canPerformAction: (a: string, r?: string) => boolean | { allowed: boolean; message?: string } } {
  const context = useAdmin()
  
  if (permission) {
    return context.hasPermission(permission)
  }
  
  return { 
    hasPermission: context.hasPermission, 
    canPerformAction: context.canPerformAction 
  }
}

export function useDemoMode() {
  const { demoModeEnabled, updateAdminUser } = useAdmin()
  
  const toggleDemoMode = async (enabled: boolean) => {
    await updateAdminUser({ demoModeEnabled: enabled })
  }
  
  return { demoModeEnabled, toggleDemoMode }
}
