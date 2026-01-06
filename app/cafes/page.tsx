"use client"

import Link from "next/link"
import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { restaurants } from "@/lib/data"
import { Star, Clock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CafesPage() {
  const { isAuthenticated } = useApp()
  const { t } = useTranslation()
  const router = useRouter()

  // Кафелер - азықтықтар ішінде ерекше категориясы бар мекеме
  // Әр кафе ресторан деректерінен және категориялары арқылы анықталады
  const cafes = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes("coffee")
  )

  const handleCafeClick = (cafeId: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cafes")
      return
    }
    router.push(`/restaurant/${cafeId}`)
  }

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
          <Link href="/popular" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>📈</span>
            {t("popular")}
          </Link>
          <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-lg transition">
            <span>❤️</span>
            {t("favorites")}
          </Link>
          <Link href="/cafes" className="flex items-center gap-3 px-4 py-3 bg-accent/10 text-accent rounded-lg font-medium transition">
            <span>☕</span>
            Кафелер
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
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold mb-2">☕ Кафелер</h1>
            <p className="text-muted-foreground">{cafes.length} кафе қолжетімді</p>
          </div>
        </div>

        {cafes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => handleCafeClick(cafe.id)}
                className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                {/* Cafe Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                  {cafe.badges && cafe.badges.length > 0 && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      {cafe.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cafe Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{cafe.name}</h3>

                  {/* Rating and Time */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{cafe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{cafe.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {cafe.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {cafe.description}
                    </p>
                  )}

                  {/* Categories */}
                  {cafe.categories && cafe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cafe.categories.slice(0, 2).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-muted text-xs rounded-full text-muted-foreground"
                        >
                          {category}
                        </span>
                      ))}
                      {cafe.categories.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-full text-muted-foreground">
                          +{cafe.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Кафелер табылмады</p>
            <Link href="/" className="text-accent font-semibold hover:underline">
              Басты бетке қайту
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
