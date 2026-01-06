"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Star } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { foodItems } from "@/lib/data"
import { BottomNav } from "@/components/bottom-nav"

export default function AllFoodsPage() {
  const { toggleFavorite, favorites } = useApp()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/popular" className="text-foreground hover:text-accent transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold text-lg">{t("allFoods")}</h1>
      </header>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {foodItems.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="relative h-40 bg-muted">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(item.id)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.has(item.id) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                  />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold mb-1 text-sm">{item.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{item.rating}</span>
                  <span>•</span>
                  <span>{item.deliveryTime}</span>
                </div>
                <p className="text-foreground font-bold mb-2 text-sm">{item.price.toLocaleString()}₸</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
