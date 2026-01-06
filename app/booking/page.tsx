"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Star } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { restaurants } from "@/lib/data"

export default function BookingPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useApp()
  const { t } = useTranslation()
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  // Filter nearby restaurants (mock data, in real app would use geolocation)
  const nearbyRestaurants = restaurants.slice(0, 6)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="hover:opacity-80 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-xl">{t("booking")}</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Near You Section */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">{t("nearYouCafes")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurant/${restaurant.id}`}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition"
              >
                <div className="relative h-40">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {restaurant.badges?.includes("NEW") && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                      NEW
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{restaurant.deliveryTime}</span>
                  </div>
                  <button className="w-full mt-3 bg-accent text-accent-foreground py-2 rounded-lg font-medium hover:opacity-90 transition">
                    {t("bookNow")}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="font-bold text-lg mb-4">{t("myBookings")}</h2>
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No bookings yet</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
