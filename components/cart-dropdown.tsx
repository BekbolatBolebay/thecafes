"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, X, Plus, Minus } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "./theme-language-toggle"

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } = useApp()
  const { t } = useTranslation()
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  return (
    <div className="relative">
      {/* Cart Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 hover:bg-muted rounded-lg transition">
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-lg">{t("cart")}</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t("emptyCart")}</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-background rounded-xl p-3 border border-border">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">{item.name}</h4>
                      <p className="text-accent font-bold text-sm">{item.price}₸</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center hover:bg-accent/90 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t("total")}:</span>
                  <span className="text-xl font-bold text-accent">{cartTotal.toLocaleString()}₸</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-accent hover:bg-accent/90 text-white text-center font-semibold py-3 rounded-xl transition"
                >
                  {t("placeOrder")}
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
