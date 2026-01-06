"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Star } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { foodItems, restaurants } from "@/lib/data"
import { BottomNav } from "@/components/bottom-nav"
import { useParams } from "next/navigation"

function unslugify(slug: string) {
    return slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export default function CategoryPage() {
  const { toggleFavorite, favorites } = useApp()
  const { t } = useTranslation()
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const categoryName = unslugify(slug || "")

  const filteredFoodItems = foodItems.filter(item => 
    item.categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase())
  )

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10 flex items-center gap-4">
        <Link href="/" className="text-foreground hover:text-accent transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold text-lg">{categoryName}</h1>
      </header>

      <div className="px-4 py-4 space-y-8">
        {filteredRestaurants.length > 0 && (
          <div>
            <h2 className="font-semibold text-xl mb-4">{t("restaurants")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.id}`}
                  className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
                >
                  <div className="relative h-40 bg-muted">
                    <Image
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 text-base">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{restaurant.rating}</span>
                      <span>•</span>
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{restaurant.categories.slice(0, 2).join(" • ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredFoodItems.length > 0 && (
          <div>
            <h2 className="font-semibold text-xl mb-4">{t("foodItems")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredFoodItems.map((item) => (
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
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
        )}

        {filteredRestaurants.length === 0 && filteredFoodItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
