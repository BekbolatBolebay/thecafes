"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Users, AlertTriangle, Loader2 } from "lucide-react"

// This interface should match the data returned by our GET /api/bookings endpoint
interface Booking {
  id: string
  restaurant_id: string
  restaurant_name: string
  restaurant_image: string
  booking_date: string
  booking_time: string
  number_of_guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
  created_at: string
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/bookings')
        if (!response.ok) {
          if (response.status === 401) {
            // If user is not logged in, the API returns 401.
            // We can treat this as an empty list of bookings for the guest user.
            setBookings([])
            return
          }
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm mt-2">Loading your bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-destructive/10 rounded-xl border border-dashed border-destructive/30">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="text-destructive text-sm mt-2">Error: {error}</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
        <h3 className="text-lg font-semibold">No Bookings Found</h3>
        <p className="text-muted-foreground text-sm mt-1">You haven't made any table reservations yet.</p>
      </div>
    )
  }

  const formatBookingTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-2xl">My Bookings</h3>
        <p className="text-muted-foreground">Here is a list of your past and upcoming reservations.</p>
      </div>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-start gap-4">
            <img 
              src={booking.restaurant_image || '/placeholder-logo.png'} 
              alt={booking.restaurant_name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-grow">
              <h4 className="font-semibold text-lg">{booking.restaurant_name}</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(booking.booking_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {formatBookingTime(booking.booking_time)}</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {booking.number_of_guests} {booking.number_of_guests > 1 ? 'guests' : 'guest'}</span>
              </div>
            </div>
            <div className={`text-xs font-bold self-start py-1 px-3 rounded-full capitalize ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}