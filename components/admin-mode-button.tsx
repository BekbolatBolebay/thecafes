"use client"

import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"

export function AdminModeButton() {
  const router = useRouter()
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return null
  }

  return (
    <button
      onClick={() => router.push("/admin/dashboard")}
      className="fixed bottom-24 right-4 bg-accent hover:bg-accent/90 text-white rounded-full p-3 shadow-lg transition z-40"
      title="Admin Panel"
    >
      <Settings className="w-6 h-6" />
    </button>
  )
}
