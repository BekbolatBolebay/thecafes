"use client"

import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { foodItems } from "@/lib/data"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
  const { favorites, toggleFavorite, addToCart, isAuthenticated } = useApp()
  const { t } = useTranslation()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"food" | "cafes">("food")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/favorites")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const favoriteFoods = foodItems.filter((item) => favorites.has(item.id))

  const handleAddToCart = (item: (typeof foodItems)[0]) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/favorites")
      return
    }
    addToCart(item)
  }

  const handleToggleFavorite = (itemId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/favorites")
      return
    }
    toggleFavorite(itemId)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("favorites")}</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-4 flex gap-6 max-w-2xl mx-auto">
        <button onClick={() => setActiveTab("food")} className={`py-4 font-medium text-sm border-b-2 ${{ "food": "border-accent text-accent", "cafes": "border-transparent" }[activeTab]}`}>Food</button>
        <button onClick={() => setActiveTab("cafes")} className={`py-4 font-medium text-sm border-b-2 ${{ "food": "border-transparent", "cafes": "border-accent text-accent" }[activeTab]}`}>Cafes</button>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {activeTab === "food" && favoriteFoods.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">{t("noFavorites")}</p>
            <Link href="/" className="text-accent hover:underline text-sm">
              Browse food
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteFoods.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card rounded-xl p-3 border border-border relative">
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 pr-10">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.restaurant}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>⭐ {item.rating}</span>
                    <span>•</span>
                    <span>{item.deliveryTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-accent font-bold">{item.price}₸</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-accent hover:bg-accent/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      {t("add")}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFavorite(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition"
                >
                  <Heart className="w-5 h-5 fill-accent text-accent" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
