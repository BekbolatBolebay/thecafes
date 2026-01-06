"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, X } from "lucide-react"
import { useState } from "react"

import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { restaurants, foodItems } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { addToCart, searchQuery, isAuthenticated } = useApp()
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const handleCategoryClick = (name: string) => {
    if (name === "Барлығы") {
      setActiveCategory(null)
    } else {
      setActiveCategory(name.replace("\n", " "))
    }
  }

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
    const matchesCategory = activeCategory
      ? r.categories.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()))
      : true
    return matchesSearch && matchesCategory
  })

  const filteredFood = foodItems.filter((f) => {
    const matchesSearch = searchQuery
      ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesCategory = activeCategory
      ? f.categories.some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()))
      : true
    return matchesSearch && matchesCategory
  })

  const displayedFood = (searchQuery || activeCategory) ? filteredFood : filteredFood.slice(0, 4)
  const displayedRestaurants = (searchQuery || activeCategory) ? filteredRestaurants : filteredRestaurants.slice(0, 6)

  const handleAddToCart = (item: (typeof foodItems)[0]) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/")
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
      router.push("/login?redirect=/")
      return
    }
    router.push(`/restaurant/${restaurantId}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <SearchHeader />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border pt-20">
        <nav className="p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-accent/10 text-accent rounded-lg font-medium">
            <span>🏠</span>
            {t("home")}
          </Link>
          <Link href="/popular" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
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

      <div className="lg:ml-64 lg:mr-4 px-4 py-4 max-w-7xl">
        {/* Promo Banners */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <Link href="/categories/fast-food" className="flex-shrink-0 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-[280px] sm:w-[320px] overflow-hidden snap-start shadow-sm group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-white font-bold text-base sm:text-lg mb-1.5">
                <span className="text-lg">🔥</span>
                Бургерге -20%
              </div>
              <p className="text-white/95 text-xs sm:text-sm">Аптаның соңына дейін</p>
            </div>
          </Link>

          <Link href="/popular" className="flex-shrink-0 relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-[280px] sm:w-[320px] overflow-hidden snap-start shadow-sm group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
            
            <div className="relative z-10">
              <div className="text-white font-bold text-base sm:text-lg mb-1.5">Антал +1</div>
              <p className="text-white/95 text-xs sm:text-sm">Бірінші тапсырысқа</p>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-4 text-foreground">Категориялар</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
            {[
              { name: "Фаст-фұд", image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=200&auto=format&fit=crop", slug: "fast-food" },
              { name: "Ұлттық\nтағамдар", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=200&auto=format&fit=crop", slug: "national-dishes" },
              { name: "Сусындар", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=200&auto=format&fit=crop", slug: "drinks" },
              { name: "Кешкі\nасқа", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=200&auto=format&fit=crop", slug: "dinner" },
              { name: "Комболар", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&auto=format&fit=crop", slug: "combos" },
              { name: "Десерттер", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=200&auto=format&fit=crop", slug: "desserts" },
              { name: "Диеталық\nтағамдар", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop", slug: "dietary" },
              { name: "Барлығы", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop", slug: "/categories" },
            ].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition border ${activeCategory === cat.name.replace("\n", " ") ? "border-accent ring-2 ring-accent/30" : "border-border"}`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition" />
                </div>
                <span className={`text-[10px] sm:text-xs text-center leading-tight whitespace-pre-line font-medium ${activeCategory === cat.name.replace("\n", " ") ? "text-accent" : "text-muted-foreground"}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Today */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xl text-foreground">
              {activeCategory ? `${activeCategory}` : "Популярно сегодня"}
            </h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-xs text-muted-foreground flex items-center gap-1">
                <X className="w-3 h-3" /> Тазарту
              </button>
            )}
            <Link href="/popular" className="text-accent text-xs sm:text-sm font-medium">
              Все →
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {displayedFood.length > 0 ? (
              displayedFood.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[260px] sm:w-[280px] h-[280px] relative rounded-2xl overflow-hidden shadow-sm snap-start group"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.image || "/placeholder.svg"}')` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

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
            ))
            ) : (
              <div className="px-4 text-muted-foreground text-sm">Бұл категорияда тағамдар табылмады.</div>
            )}
          </div>
        </div>

        {/* Restaurants Near You */}
        <div>
          <h2 className="font-bold text-xl mb-4 text-foreground">
            {(searchQuery || activeCategory) ? "Табылған мейрамханалар" : "Жақын жерде"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedRestaurants.length > 0 ? (
              displayedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.id)}
                className="relative h-[200px] w-full rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${restaurant.image || "/placeholder.svg"}')` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <h3 className="font-bold text-lg text-white mb-1">{restaurant.name}</h3>
                  <p className="text-xs text-gray-300 mb-2 line-clamp-1">
                    {restaurant.description || "Кофе Хауз предлагает вам лучшие кофе просто в..."}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-white">{restaurant.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{restaurant.reviewCount} пікір</span>
                    <span>•</span>
                    <span>10-15 мин</span>
                  </div>
                </div>

                {restaurant.badges && (
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-20">
                    {restaurant.badges.includes("Тапсырыс") && (
                      <span className="bg-accent/90 text-white text-[10px] px-2.5 py-1 rounded-lg font-medium backdrop-blur-sm shadow-sm">
                        Тапсырыс
                      </span>
                    )}
                    {restaurant.badges.includes("Брондау") && (
                      <span className="bg-[#FFB800]/90 text-white text-[10px] px-2.5 py-1 rounded-lg font-medium backdrop-blur-sm shadow-sm">
                        Брондау
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                Бұл сұраныс бойынша мейрамханалар табылмады.
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}