"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Store,
  Package,
  Users,
  MapPin,
  UtensilsCrossed,
  UserCog,
  Database,
  ShoppingCart,
  Calendar,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase/client"

export default function AdminPage() {
  const router = useRouter()
  const { user, language } = useAppStore()
  const [stats, setStats] = useState({
    restaurants: 0,
    foodItems: 0,
    users: 0,
    orders: 0,
    cafes: 0,
    cities: 0,
    bookings: 0,
    admins: 0,
  })

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      if (!user?.email) {
        router.push("/login")
        return
      }

      // Check if user exists in users table and is admin
      const { data: userData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()

      if (!userData?.is_admin) {
        router.push("/")
        return
      }

      loadStats()
    }

    checkAdmin()
  }, [user, router])

  const loadStats = async () => {
    try {
      const [
        { count: restaurantsCount },
        { count: foodItemsCount },
        { count: usersCount },
        { count: ordersCount },
        { count: cafesCount },
        { count: citiesCount },
        { count: bookingsCount },
        { count: adminsCount },
      ] = await Promise.all([
        supabase.from("restaurants").select("*", { count: "exact", head: true }),
        supabase.from("food_items").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("cafes").select("*", { count: "exact", head: true }),
        supabase.from("cities").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("admin_users").select("*", { count: "exact", head: true }),
      ])

      setStats({
        restaurants: restaurantsCount || 0,
        foodItems: foodItemsCount || 0,
        users: usersCount || 0,
        orders: ordersCount || 0,
        cafes: cafesCount || 0,
        cities: citiesCount || 0,
        bookings: bookingsCount || 0,
        admins: adminsCount || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const adminSections = [
    {
      title: language === "kk" ? "Ресторандар" : language === "ru" ? "Рестораны" : "Restaurants",
      icon: Store,
      count: stats.restaurants,
      color: "from-blue-500 to-blue-600",
      href: "/admin/restaurants",
    },
    {
      title: language === "kk" ? "Тағамдар" : language === "ru" ? "Блюда" : "Food Items",
      icon: Package,
      count: stats.foodItems,
      color: "from-green-500 to-green-600",
      href: "/admin/foods",
    },
    {
      title: language === "kk" ? "Клиенттер" : language === "ru" ? "Клиенты" : "Customers",
      icon: Users,
      count: stats.users,
      color: "from-purple-500 to-purple-600",
      href: "/admin/customers",
    },
    {
      title: language === "kk" ? "Тапсырыстар" : language === "ru" ? "Заказы" : "Orders",
      icon: ShoppingCart,
      count: stats.orders,
      color: "from-orange-500 to-orange-600",
      href: "/admin/orders",
    },
    {
      title: language === "kk" ? "Кафелер" : language === "ru" ? "Кафе" : "Cafes",
      icon: UtensilsCrossed,
      count: stats.cafes,
      color: "from-pink-500 to-pink-600",
      href: "/admin/cafes",
    },
    {
      title: language === "kk" ? "Қалалар" : language === "ru" ? "Города" : "Cities",
      icon: MapPin,
      count: stats.cities,
      color: "from-cyan-500 to-cyan-600",
      href: "/admin/cities",
    },
    {
      title: language === "kk" ? "Брондаулар" : language === "ru" ? "Бронирования" : "Bookings",
      icon: Calendar,
      count: stats.bookings,
      color: "from-yellow-500 to-yellow-600",
      href: "/admin/bookings",
    },
    {
      title: language === "kk" ? "Сити операторлар" : language === "ru" ? "Городские операторы" : "City Operators",
      icon: UserCog,
      count: stats.admins,
      color: "from-red-500 to-red-600",
      href: "/admin/operators",
    },
  ]

  if (!user?.email) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="hover:opacity-80 transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-bold text-xl">
              {language === "kk" ? "Админ панель" : language === "ru" ? "Админ панель" : "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/database"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition text-sm"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === "kk" ? "Деректер базасы" : language === "ru" ? "База данных" : "Database"}
              </span>
            </Link>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{user.name || user.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {language === "kk" ? "Қош келдіңіз!" : language === "ru" ? "Добро пожаловать!" : "Welcome!"}
          </h2>
          <p className="text-muted-foreground">
            {language === "kk"
              ? "Барлық жүйені басқару үшін төмендегі бөлімдерді пайдаланыңыз"
              : language === "ru"
                ? "Используйте секции ниже для управления всей системой"
                : "Use the sections below to manage the entire system"}
          </p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}
              >
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
              <p className="text-3xl font-bold text-primary">{section.count}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            {language === "kk" ? "Жылдам әрекеттер" : language === "ru" ? "Быстрые действия" : "Quick Actions"}
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/admin/restaurants?action=add"
              className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-lg transition"
            >
              <Store className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">
                {language === "kk" ? "Ресторан қосу" : language === "ru" ? "Добавить ресторан" : "Add Restaurant"}
              </span>
            </Link>
            <Link
              href="/admin/foods?action=add"
              className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 rounded-lg transition"
            >
              <Package className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">
                {language === "kk" ? "Тағам қосу" : language === "ru" ? "Добавить блюдо" : "Add Food"}
              </span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/30 rounded-lg transition"
            >
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">
                {language === "kk" ? "Тапсырыстар" : language === "ru" ? "Заказы" : "Orders"}
              </span>
            </Link>
            <Link
              href="/admin/cities?action=add"
              className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 dark:hover:bg-cyan-950/30 rounded-lg transition"
            >
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-medium">
                {language === "kk" ? "Қала қосу" : language === "ru" ? "Добавить город" : "Add City"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
