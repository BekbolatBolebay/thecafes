"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit2, User, Globe, Bell, History, Trash2, LogOut, MoreVertical, Shield } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { BookingHistory } from "@/components/booking-history"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useApp()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    if (confirm(t("logout") + "?")) {
      logout()
      router.push("/")
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account?")) {
      logout()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="text-foreground hover:text-accent transition">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        <h1 className="font-bold text-lg sm:text-xl">{t("profile")}</h1>
        <button className="text-foreground">
          <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </header>

      <div className="px-4 py-6 sm:py-8 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 sm:mb-4 bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
            {user.avatar ? (
              <img src={user.avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl sm:text-4xl md:text-5xl text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-1">{user.name}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{user.email}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{user.phone}</p>
          <Link
            href="/profile/edit"
            className="mt-2 sm:mt-3 flex items-center gap-2 text-accent font-medium text-xs sm:text-sm hover:underline"
          >
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
            {t("edit")}
          </Link>
        </div>

        {/* User Info Card */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-border mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">Account Information</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-start text-xs sm:text-sm">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-medium text-right">{user.name}</span>
            </div>
            <div className="flex justify-between items-start text-xs sm:text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-right break-all">{user.email}</span>
            </div>
            <div className="flex justify-between items-start text-xs sm:text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium text-right">{user.phone}</span>
            </div>
            <div className="flex justify-between items-start text-xs sm:text-sm">
              <span className="text-muted-foreground">City:</span>
              <span className="font-medium text-right">{user.city}</span>
            </div>
            {user.address && (
              <div className="flex justify-between items-start text-xs sm:text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium text-right max-w-[60%]">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Panel Access */}
        {user.isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 hover:from-purple-600 hover:to-purple-800 transition"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="font-semibold text-sm sm:text-base">Admin Panel</span>
            </div>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}

        {/* Menu Items */}
        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/profile/bookmarks"
            className="flex items-center justify-between bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-colors border border-border"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm sm:text-base">{t("myBookmarks")}</span>
            </div>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/profile/language"
            className="flex items-center justify-between bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-colors border border-border"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm sm:text-base">{t("language")}</span>
            </div>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/profile/notifications"
            className="flex items-center justify-between bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-colors border border-border"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm sm:text-base">{t("notifications")}</span>
            </div>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/profile/orders"
            className="flex items-center justify-between bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-muted/50 transition-colors border border-border"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center">
                <History className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm sm:text-base">{t("orderHistory")}</span>
            </div>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Booking History */}
        <div className="mt-6 sm:mt-8">
          <BookingHistory />
        </div>

        {/* Danger Zone */}
        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-2 text-destructive py-3 sm:py-4 hover:bg-destructive/10 rounded-lg sm:rounded-xl transition border border-transparent hover:border-destructive/20"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">{t("deleteAccount")}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-destructive py-3 sm:py-4 hover:bg-destructive/10 rounded-lg sm:rounded-xl transition border border-transparent hover:border-destructive/20"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">{t("logout")}</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
