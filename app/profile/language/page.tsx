"use client"

import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"

export default function LanguagePage() {
  const { t, language: currentLanguage } = useTranslation()
  const { setLanguage } = useApp()

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "kk", name: "Қазақша" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/profile" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("language")}</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          {languages.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => setLanguage(code as "en" | "ru" | "kk")}
              className="w-full flex items-center justify-between bg-card rounded-xl p-4 border border-border hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{name}</span>
              {currentLanguage === code && <Check className="w-5 h-5 text-accent" />}
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
