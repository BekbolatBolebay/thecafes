"use client"

import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"

export default function NotificationsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/profile" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("notifications")}</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="text-center py-16">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-semibold text-xl mb-2">No Notifications Yet</h2>
          <p className="text-muted-foreground">You don't have any notifications right now.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
