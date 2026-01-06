"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  LogOut,
  Building2,
  Table2,
  Calendar,
  Users,
  Home,
  Loader2,
} from "lucide-react"
import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, logout, isAuthLoading } = useApp()

  // Redirect if not an authenticated admin
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !user?.isAdmin)) {
      router.push("/login")
    }
  }, [isAuthenticated, user, isAuthLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (isAuthLoading || !isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to App</span>
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-semibold text-gray-900">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Role</p>
              <p className="font-semibold text-gray-900">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Administrator
                </span>
              </p>
            </div>
             <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-semibold text-gray-900 text-green-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Restaurants Card */}
          <Link href="/admin/restaurants">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition cursor-pointer h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Restaurants</h3>
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-teal-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Add, edit, and manage restaurants.</p>
            </div>
          </Link>
          
          {/* placeholder cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
             <h3 className="font-semibold text-gray-900">Users</h3>
             <p className="text-sm text-gray-500 mt-4">Manage users (Not implemented)</p>
          </div>
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
             <h3 className="font-semibold text-gray-900">Bookings</h3>
             <p className="text-sm text-gray-500 mt-4">View bookings (Not implemented)</p>
          </div>
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
             <h3 className="font-semibold text-gray-900">Settings</h3>
             <p className="text-sm text-gray-500 mt-4">Admin settings (Not implemented)</p>
          </div>

        </div>
      </main>
    </div>
  )
}
