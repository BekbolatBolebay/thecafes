"use client"

import { useRouter } from "next/navigation"
import { Settings, LogOut } from "lucide-react"
import { getAdminUser, clearAdminSessionToken, clearAdminUser } from "@/lib/admin-auth"

export function AdminFooter() {
  const router = useRouter()
  const adminUser = typeof window !== "undefined" ? getAdminUser() : null

  if (!adminUser) {
    return null
  }

  const handleLogout = () => {
    clearAdminSessionToken()
    clearAdminUser()
    router.push("/")
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-accent/10 border-t border-accent/20 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-accent font-semibold">👤 Admin:</span>
        <span className="text-foreground">{adminUser.firstName} {adminUser.lastName}</span>
        <span className="text-xs bg-accent/20 px-2 py-1 rounded text-accent font-medium">{adminUser.role}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 px-3 py-1 bg-accent text-white rounded text-sm hover:bg-accent/90 transition"
        >
          <Settings className="w-4 h-4" />
          Panel
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Exit
        </button>
      </div>
    </div>
  )
}
