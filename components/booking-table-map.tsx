"use client"

import { useState } from "react"
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingTableMapProps {
  restaurantName?: string
  onTableSelect?: (tableId: string, tableName: string) => void
  selectedTable?: string | null
  onReserve?: (tableId: string) => void
}

export default function BookingTableMap({
  restaurantName = "Restaurant",
}: BookingTableMapProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState(2)
  const [isBooked, setIsBooked] = useState(false)
  const { toast } = useToast()

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Брондау деректерін құру
    const newBooking = {
      id: Date.now().toString(),
      restaurantName,
      date,
      time,
      guests,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }

    // LocalStorage-қа сақтау
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    localStorage.setItem('bookings', JSON.stringify([newBooking, ...existingBookings]))

    setIsBooked(true)
    toast({
      title: "Сәтті брондалды!",
      description: `${date} күні сағат ${time}-ге ${guests} адамға орын дайындалады.`,
    })
  }

  if (isBooked) {
    return (
      <div className="w-full bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Тапсырыс қабылданды!</h3>
        <p className="text-muted-foreground mb-6">
          Біз сізді {date} күні сағат {time}-де күтеміз.
        </p>
        <button 
          onClick={() => setIsBooked(false)}
          className="text-accent font-medium hover:underline"
        >
          Басқа брондау жасау
        </button>
      </div>
    )
  }

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-accent rounded-full"/>
        Үстел брондау: {restaurantName}
      </h3>
      
      <form onSubmit={handleBooking} className="space-y-4">
        {/* Күні */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Күні
          </label>
          <input 
            type="date" 
            required
            min={new Date().toISOString().split('T')[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Уақыты */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" /> Уақыты
            </label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>

          {/* Адам саны */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Адам саны
            </label>
            <select 
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-accent/20 transition appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                <option key={num} value={num}>{num} адам</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 rounded-xl transition-all active:scale-95 mt-2 shadow-lg shadow-accent/20"
        >
          Брондау
        </button>
      </form>
    </div>
  )
}
