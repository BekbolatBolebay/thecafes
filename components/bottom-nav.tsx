"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, TrendingUp, Heart, ShoppingCart, User } from "lucide-react"
import { useApp } from "@/lib/store"
import { useTranslation } from "./theme-language-toggle"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { getCartCount, isAuthenticated } = useApp()
  const cartCount = getCartCount()
  const { t } = useTranslation()

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      router.push("/profile")
    }
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push("/login?redirect=cart")
    } else {
      router.push("/cart")
    }
  }

  const links = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/popular", icon: TrendingUp, label: t("popular") },
    { href: "/favorites", icon: Heart, label: t("favorites") },
    { href: "/cart", icon: ShoppingCart, label: t("cart"), badge: cartCount, onClick: handleCartClick },
    { href: "/profile", icon: User, label: t("profile"), onClick: handleProfileClick },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-4 py-2 sm:py-3 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {links.map(({ href, icon: Icon, label, badge, onClick }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 relative transition-colors min-w-[60px] ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">{label}</span>
              {badge ? (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5 rounded-full text-[10px] sm:text-xs flex items-center justify-center font-medium px-1">
                  {badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
