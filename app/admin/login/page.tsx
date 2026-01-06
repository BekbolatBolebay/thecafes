// ============================================================================
// ADMIN LOGIN PAGE
// ============================================================================
// Location: app/admin/login/page.tsx
// Purpose: Login page for admin users with role-based access
// ============================================================================

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminUser, isAuthenticated, isLoading, login, error, clearError } = useAdmin()

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && adminUser) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, adminUser, router])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setLoginError("")

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter email and password")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(email, password)

      if (!result.success) {
        setLoginError(result.message || "Login failed")
      }
      // Success - useEffect will handle redirect
    } catch (err) {
      setLoginError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-lg mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Sign in to manage your restaurants</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          {/* Error Messages */}
          {(error || loginError) && (
            <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || loginError}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2.5 rounded-lg transition"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-xs font-semibold text-slate-300 mb-2">Demo Super Admin Credentials:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>📧 bolebay.bekbolat.25@gmail.com</p>
              <p>🔑 1234Pppp!</p>
              <p className="pt-2 border-t border-slate-600">📧 nugnurd@gmail.com</p>
              <p>🔑 1234Pppp!</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            Back to{" "}
            <Link href="/" className="text-accent hover:underline font-medium">
              client application
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
