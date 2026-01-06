"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, MapPin, Clock } from "lucide-react"

import { useApp } from "@/lib/store"
import { useTranslation } from "@/components/theme-language-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CheckoutPage() {
  const { cart, getCartTotal, user, isAuthenticated } = useApp()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
    }
    if (cart.length === 0) {
      router.push("/")
    }
  }, [isAuthenticated, cart, router])

  const deliveryFee = 500 // Example delivery fee
  const total = getCartTotal() + deliveryFee

  if (!user) return null // or a loading spinner

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Link href="/cart" className="text-foreground hover:text-accent transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">{t("placeOrder")}</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="bg-card p-5 rounded-xl border border-border">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <span>{t("deliveryAddress")}</span>
            </h2>
            <div className="space-y-3">
              <Input defaultValue={user.address || ""} placeholder={t("address")} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Квартира" />
                <Input placeholder="Этаж" />
              </div>
              <Textarea placeholder="Комментарий курьеру" />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card p-5 rounded-xl border border-border">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              <span>{t("paymentMethod")}</span>
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Kaspi / Card
              </Button>
              <Button variant="outline" className="w-full justify-start">
                {t("cashToCourier")}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-5 rounded-xl border border-border sticky top-24">
            <h2 className="font-semibold text-base mb-4">{t("yourOrder")}</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x {item.price.toLocaleString()}₸</p>
                  </div>
                  <p className="font-semibold text-sm">{(item.quantity * item.price).toLocaleString()}₸</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">{t("products")}</p>
                <p>{getCartTotal().toLocaleString()}₸</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">{t("delivery")}</p>
                <p>{deliveryFee.toLocaleString()}₸</p>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <p>{t("total")}</p>
                <p>{total.toLocaleString()}₸</p>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6">
              {t("placeOrder")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

