"use client"

import Image from "next/image"
import { Heart, Star, Clock, Plus } from "lucide-react"
import { type FoodItem, useApp } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/theme-language-toggle"

interface FoodCardProps {
  item: FoodItem
  variant?: "grid" | "list"
}

export function FoodCard({ item, variant = "grid" }: FoodCardProps) {
  const { addToCart, toggleFavorite, favorites, cart, isAuthenticated } = useApp()
  const router = useRouter()
  const { t } = useTranslation()
  const isFavorite = favorites.has(item.id)
  const cartItem = cart.find((i) => i.id === item.id)
  const inCart = !!cartItem

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/")
      return
    }
    addToCart(item)
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/")
      return
    }
    toggleFavorite(item.id)
  }

  const discountedPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price

  if (variant === "list") {
    return (
      <div className="flex gap-3 bg-card rounded-2xl p-3 border border-border hover:shadow-md transition">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          {item.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
              -{item.discount}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{item.name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {item.rating}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.deliveryTime}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {item.discount && <span className="text-xs text-muted-foreground line-through mr-2">{item.price}₸</span>}
              <span className="font-bold text-accent">{Math.round(discountedPrice)}₸</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition ${isFavorite ? "bg-red-50 dark:bg-red-900/20 text-red-500" : "bg-muted text-muted-foreground"}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              {inCart ? (
                <div className="flex items-center gap-2 bg-accent text-accent-foreground rounded-full px-3 py-1">
                  <span className="text-sm font-medium">{cartItem.quantity}</span>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition">
      <div className="relative h-48">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${
            isFavorite
              ? "bg-white/90 dark:bg-gray-800/90 text-red-500"
              : "bg-white/70 dark:bg-gray-800/70 text-muted-foreground"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
        {item.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
            -{item.discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.deliveryTime}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {item.discount && <span className="text-sm text-muted-foreground line-through mr-2">{item.price}₸</span>}
            <span className="font-bold text-lg text-accent">{Math.round(discountedPrice)}₸</span>
          </div>
          {inCart ? (
            <div className="flex items-center gap-2 bg-accent text-accent-foreground rounded-full px-4 py-2">
              <span className="font-medium">{cartItem.quantity}</span>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
            >
              {t("add")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
