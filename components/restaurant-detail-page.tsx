"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react"
import { useApp } from "@/lib/store"
import type { Restaurant, FoodItem } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { FoodCard } from "@/components/food-card"
import { useToast } from "@/hooks/use-toast"

// Mock data for tables, in a real scenario this would come from the backend
const restaurantTables = [
  { id: "tbl_001", name: "Table for 2 by the window" },
  { id: "tbl_002", name: "Cozy booth for 4" },
  { id: "tbl_003", name: "Large group table (6-8)" },
  { id: "tbl_004", name: "Bar seating" },
  { id: "tbl_005", name: "Outdoor patio table" },
]

interface RestaurantDetailPageClientProps {
  restaurant: Restaurant;
  menu: FoodItem[];
}

export default function RestaurantDetailPageClient({ restaurant, menu: restaurantMenu }: RestaurantDetailPageClientProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useApp()
  const { t } = useTranslation()
  const { toast } = useToast()

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today
    time: "19:00", // Default to 7 PM
    guests: 2,
    tableId: restaurantTables[0].id, // Default to the first table
    notes: "",
  })

  const handleBookTableClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a table.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/restaurant/${restaurant.id}`)
      return
    }
    setShowBookingForm(true)
  }

  const confirmBooking = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Could not identify user. Please log in again.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)

    const bookingDetails = {
      restaurant_id: restaurant.id,
      date: bookingData.date,
      time: bookingData.time,
      guests: bookingData.guests,
      table_id: bookingData.tableId,
      user_name: user.name,
      restaurant_name: restaurant.name,
      restaurant_image: restaurant.image,
      notes: bookingData.notes,
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create booking.")
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your table at ${restaurant.name} has been booked.`,
      })
      setShowBookingForm(false)
    } catch (error) {
      console.error("Booking failed:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Restaurant Info */}
        <div className="bg-card rounded-2xl p-6 -mt-12 relative z-10 border border-border mb-6">
          <h1 className="font-bold text-2xl mb-2">{restaurant.name}</h1>
          <p className="text-muted-foreground mb-4">{restaurant.description}</p>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-muted-foreground text-sm">({restaurant.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">{restaurant.address || "Almaty, Kazakhstan"}</span>
          </div>

          <button
            onClick={handleBookTableClick}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {t("bookTable")}
          </button>
        </div>

        {/* Menu Section */}
        <div className="mb-6">
          <h2 className="font-bold text-xl mb-4">{t("menu")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantMenu.map((item) => (
              <FoodCard key={item.id} item={item} variant="grid" />
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-6">{t("bookTable")}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                <input
                  type="date"
                  value={bookingData.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("selectTime")}</label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("numberOfGuests")}</label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {t(num === 1 ? "guest" : "guests")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                <select
                  value={bookingData.tableId}
                  onChange={(e) => setBookingData({ ...bookingData, tableId: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background"
                >
                  {restaurantTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("specialRequests")}</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg bg-background resize-none"
                  rows={3}
                  placeholder={t("specialRequestsPlaceholder")}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 py-3 border border-border rounded-lg font-medium hover:bg-muted transition"
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={isSubmitting || !bookingData.date || !bookingData.time || !bookingData.tableId}
                  className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("booking") + "..." : t("confirmBooking")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
