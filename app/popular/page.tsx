"use client"

import { Heart, Star, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { foodItems, restaurants } from "@/lib/data"
import { SearchHeader } from "@/components/search-header"
import { useToast } from "@/hooks/use-toast"

export default function PopularPage() {
  const { addToCart, toggleFavorite, favorites, isAuthenticated } = useApp()
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [activeFilter, setActiveFilter] = useState("all") // 'all', 'food', 'cafe'

  const handleToggleFavorite = (item: { id: string; name: string }) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/popular")
      return
    }
    const isFavorite = favorites.has(item.id)
    toggleFavorite(item.id)
    toast({
      title: isFavorite ? t("removedFromFavorites") : t("addedToFavorites"),
      description: item.name,
    })
  }

  const handleAddToCart = (item: (typeof foodItems)[0]) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/popular")
      return
    }
    addToCart(item)
    toast({
      title: t("addedToCart"),
      description: item.name,
    })
  }
  
  const handleRestaurantClick = (restaurantId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/popular")
      return
    }
    router.push(`/restaurant/${restaurantId}`)
  }


  const chainRestaurants = [
    {
      id: "burger-king",
      name: "Burger King",
      image: "/classic-burger-with-cheese-and-fries.jpg",
      rating: 4.5,
      deliveryTime: "20-30 мин",
      reviewCount: 1200,
    },
    {
      id: "kfc",
      name: "KFC",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop",
      rating: 4.4,
      deliveryTime: "25-35 мин",
      reviewCount: 2300,
    },
    {
      id: "hardees",
      name: "Hardee's",
      image: "https://images.unsplash.com/photo-1626082931590-a58392a9b183?q=80&w=600&auto=format&fit=crop",
      rating: 4.6,
      deliveryTime: "15-25 мин",
      reviewCount: 980,
    },
    {
      id: "subway",
      name: "Subway",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&auto=format&fit=crop",
      rating: 4.3,
      deliveryTime: "10-20 мин",
      reviewCount: 1500,
    },
  ]

  const topFoods = foodItems.sort((a, b) => b.rating - a.rating).slice(0, 5)
  const newRestaurants = restaurants.slice(0, 2)


  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <SearchHeader />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border pt-20">
        <nav className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>🏠</span>
            {t("home")}
          </Link>
          <Link href="/popular" className="flex items-center gap-3 px-4 py-3 bg-accent/10 text-accent rounded-lg font-medium">
            <span>📈</span>
            {t("popular")}
          </Link>
          <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>❤️</span>
            {t("favorites")}
          </Link>
          <Link href="/cart" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>🛒</span>
            {t("cart")}
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>👤</span>
            {t("profile")}
          </Link>
        </nav>
      </div>

      <main className="lg:ml-64 lg:mr-4 px-4 py-4 max-w-7xl space-y-8">
        {/* Promo Banners */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex-shrink-0 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-[280px] sm:w-[320px] overflow-hidden snap-start shadow-sm group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            <div className="relative z-10 text-white">
              <h2 className="font-bold text-lg mb-1.5">Жеңілдік -20%</h2>
              <p className="text-sm opacity-90">Барлық пиццаларға</p>
            </div>
          </div>
          <div className="flex-shrink-0 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-[280px] sm:w-[320px] overflow-hidden snap-start shadow-sm group">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            <div className="relative z-10 text-white">
              <h2 className="font-bold text-lg mb-1.5">Комбо 1+1</h2>
              <p className="text-sm opacity-80">Екі бургер бірінің бағасына</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === "all" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Барлығы
          </button>
          <button
            onClick={() => setActiveFilter("food")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === "food" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Тағамдар
          </button>
          <button
            onClick={() => setActiveFilter("cafe")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === "cafe" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Кафелер
          </button>
        </div>


        {/* TOP RATED FOODS */}
        {(activeFilter === "all" || activeFilter === "food") && (
          <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl text-foreground">Үздік тағамдар</h2>
                <Link href="/foods" className="text-accent text-xs sm:text-sm font-medium">
                  Барлығы →
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {topFoods.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[260px] sm:w-[280px] h-[280px] relative rounded-2xl overflow-hidden shadow-sm snap-start group"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.image || "/placeholder.svg"}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleFavorite(item)
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-card transition"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${
                            favorites.has(item.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                    </button>

                    <div className="relative z-10 h-full flex flex-col justify-end p-4">
                      <h3 className="font-bold text-lg text-white mb-0.5">{item.name}</h3>
                      <p className="text-xs text-gray-300 mb-2">{item.restaurant}</p>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-3">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-white">{item.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{item.deliveryTime}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-accent text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-accent/90 transition active:scale-95 backdrop-blur-sm"
                      >
                        Заказать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        )}
        
        {/* NEW CAFES */}
        {(activeFilter === "all" || activeFilter === "cafe") && (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl text-foreground">Жаңа кафелер</h2>
                <Link href="/cafes" className="text-accent text-sm font-medium">
                  Барлығы →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {newRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    className="relative h-[220px] w-full rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${restaurant.image || "/placeholder.svg"}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-bold z-10">
                          NEW
                        </span>
                        <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-white">{restaurant.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{restaurant.reviewCount} пікір</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}


        {/* TOP CHAINS */}
        {(activeFilter === "all" || activeFilter === "cafe") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl text-foreground">Топ желілер</h2>
                <Link href="/cafes?filter=chains" className="text-accent text-sm font-medium">
                  Барлығы →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chainRestaurants.map((chain) => (
                  <div
                    key={chain.id}
                    onClick={() => handleRestaurantClick(chain.id)}
                    className="relative h-[220px] w-full rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${chain.image || "/placeholder.svg"}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">{chain.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-white">{chain.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{chain.reviewCount}+ пікір</span>
                          <span>•</span>
                          <span>{chain.deliveryTime}</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}