"use client"

import { useState } from "react"
import { Search, Bell, MapPin, ChevronDown } from "lucide-react"
import { useApp } from "@/lib/store"
import { ThemeToggle, LanguageToggle, useTranslation } from "./theme-language-toggle"
import { CartDropdown } from "./cart-dropdown"

export function SearchHeader() {
  const { location, setLocation, searchQuery, setSearchQuery } = useApp()
  const [showCities, setShowCities] = useState(false)
  const { t } = useTranslation()

  const cities = [
    "Алматы",
    "Астана",
    "Атырау",
    "Ақтөбе",
    "Қарағанды",
    "Қызылорда",
    "Павлодар",
    "Петропавл",
    "Семей",
    "Тараз",
    "Талдықорған",
    "Теміртау",
    "Түркістан",
    "Шымкент",
  ]

  return (
    <header className="bg-card border-b border-border px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <button
            onClick={() => setShowCities(!showCities)}
            className="flex items-center gap-1 sm:gap-2 text-accent font-semibold hover:opacity-80 transition text-sm sm:text-base"
          >
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="max-w-[120px] sm:max-w-none truncate">{location}</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <CartDropdown />
            <button className="text-muted-foreground hover:text-foreground transition p-1.5 sm:p-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {showCities && (
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-14 sm:top-16 bg-card border border-border rounded-xl shadow-lg p-2 sm:p-3 max-h-60 overflow-auto z-50">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setLocation(city)
                  setShowCities(false)
                }}
                className={`block w-full text-left px-3 py-2 hover:bg-muted rounded-lg transition text-sm ${
                  location === city ? "bg-muted font-medium" : ""
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="search"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-9 sm:pl-10 bg-muted border border-border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}
