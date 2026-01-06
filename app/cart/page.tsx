"use client"

import { useState } from "react"

import Link from "next/link"
import { ArrowLeft, Plus, Minus, Tag, X } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { BottomNav } from "@/components/bottom-nav"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated, cart, updateQuantity, removeFromCart, getCartTotal, clearCart, getBookings, removeBooking } = useApp()
  const { t } = useTranslation()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=cart")
    }
  }, [isAuthenticated, router])

  const subtotal = getCartTotal()
  const delivery = cart.length > 0 ? 500 : 0
  const total = subtotal + delivery - discount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1)
    }
  }

  const handleCheckout = async () => {
    if (cart.length > 0) {
      try {
        await fetch("/api/send-order-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart,
            total,
            user: isAuthenticated,
          }),
        })
        alert("Order placed successfully! You will receive confirmation via email and SMS.")
        clearCart()
      } catch (error) {
        console.error("[v0] Error sending notification:", error)
        alert("Order placed successfully!")
        clearCart()
      }
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Link href="/" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-semibold text-lg">{t("cart")}</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-4 flex gap-6 max-w-2xl mx-auto">
        <button className="py-4 border-b-2 border-accent text-accent font-medium text-sm">{t("currentOrder")}</button>
        <button className="py-4 text-muted-foreground text-sm">{t("orderHistory2")}</button>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Bookings Section */}
        {getBookings().length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">Брондалған орындар</h2>
            <div className="space-y-3">
              {getBookings().map((booking) => (
                <div key={booking.id} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{booking.restaurantName}</h3>
                      <div className="text-xs text-muted-foreground space-y-1 mb-2">
                        <p>📅 {new Date(booking.date).toLocaleDateString('kk-KZ')}</p>
                        <p>🕐 {booking.time}</p>
                        <p>👥 {booking.guests} адам</p>
                      </div>
                      <span className="inline-block text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        Күтіліп жатыр
                      </span>
                    </div>
                    <button
                      onClick={() => removeBooking(booking.id)}
                      className="text-muted-foreground hover:text-destructive transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">{t("emptyCart")}</p>
            <Link href="/" className="text-accent hover:underline text-sm">
              {t("startAdding")}
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-card rounded-xl p-3 border border-border relative">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 pr-6">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-accent font-bold">{item.price}₸</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="flex items-center gap-3 bg-muted rounded-xl p-4 mb-6">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-accent" />
              </div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t("promoCode")}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button onClick={handleApplyPromo} className="text-accent font-medium text-sm hover:underline">
                {t("apply")}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Summary Footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border px-4 py-4 z-20">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("products")}</span>
                <span className="font-medium">{subtotal.toLocaleString()}₸</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("delivery")}</span>
                <span className="font-medium">{delivery}₸</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("discount")}</span>
                  <span className="font-medium text-green-600">-{discount.toLocaleString()}₸</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>{t("total")}</span>
                <span className="text-accent">{total.toLocaleString()}₸</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-4 rounded-xl transition-all active:scale-95"
            >
              {t("placeOrder")}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
