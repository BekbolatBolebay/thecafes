"use client"

import { useApp } from "@/lib/store"
import { translations, type Language } from "@/lib/translations"
import { Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full"
      suppressHydrationWarning
    >
      {mounted && (theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
    </Button>
  )
}

export function LanguageToggle() {
  const { language, setLanguage } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "kk", name: "Қазақша", flag: "🇰🇿" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          suppressHydrationWarning
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${mounted && language === lang.code ? "bg-accent text-accent-foreground" : ""}`}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useTranslation() {
  const { language } = useApp()

  const t = (key: keyof typeof translations.en) => {
    try {
      return translations[language]?.[key] || translations.kk[key] || key
    } catch (error) {
      console.error("[v0] Translation error:", error)
      return key
    }
  }

  return {
    t,
    language,
  }
}
