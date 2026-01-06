"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Users, MapPin, Check, X } from "lucide-react"
import { useApp } from "@/lib/store"

export default function AdminBookingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useApp()
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="hover:opacity-80 transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-xl">Manage Bookings</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Booking Requests */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-bold text-lg mb-4">Pending Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No booking requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{booking.userName}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {booking.guests} guests
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {booking.restaurant}
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="text-sm mt-2 text-muted-foreground italic">Note: {booking.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition">
                      <Check className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
