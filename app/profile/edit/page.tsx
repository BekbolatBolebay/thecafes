"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useApp } from "@/lib/store"
import { BottomNav } from "@/components/bottom-nav"

import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/components/theme-language-toggle"

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useApp()
  const { t } = useTranslation()
  const { toast } = useToast()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        address: user.address || "",
      })
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      await updateUser({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
      })
      toast({
        title: t("profileUpdated"),
      })
      router.push("/profile")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile"
      setError(message)
      toast({
        title: t("saveError"),
        description: message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/profile" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("edit")} Profile</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">{t("name")}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t("phone")}</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t("city")}</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t("address")}</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 min-h-[100px]"
              placeholder={t("deliveryAddressPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? t("saving") : t("saveChanges")}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
