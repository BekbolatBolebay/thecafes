"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus, Pencil, Trash2, Search } from "lucide-react"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  name_en?: string
  description?: string
  image_url: string
  rating: number
  delivery_time: string
  category: string
  is_new: boolean
  is_active: boolean
}

interface FoodItem {
  id: string
  restaurant_id: string
  name: string
  name_kk?: string
  name_ru?: string
  name_en?: string
  description?: string
  image_url: string
  price: number
  rating: number
  delivery_time: string
  category: string
  discount: number
  is_active: boolean
}

export default function DatabaseManagementPage() {
  const router = useRouter()
  const { user, language, useTranslation } = useAppStore()
  const t = useTranslation()

  const [activeTab, setActiveTab] = useState<"restaurants" | "foods">("restaurants")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/login")
      return
    }
    loadData()
  }, [user, router])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false })

      if (restaurantsError) throw restaurantsError
      setRestaurants(restaurantsData || [])

      // Load food items
      const { data: foodsData, error: foodsError } = await supabase
        .from("food_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (foodsError) throw foodsError
      setFoodItems(foodsData || [])
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (type: "restaurant" | "food", id: string) => {
    if (!confirm(t("confirmDelete"))) return

    try {
      const table = type === "restaurant" ? "restaurants" : "food_items"
      const { error } = await supabase.from(table).delete().eq("id", id)

      if (error) throw error

      await loadData()
      alert(t("deleteSuccess"))
    } catch (error) {
      console.error("[v0] Error deleting:", error)
      alert(t("deleteError"))
    }
  }

  const handleSave = async (type: "restaurant" | "food", data: any) => {
    try {
      const table = type === "restaurant" ? "restaurants" : "food_items"

      if (data.id) {
        // Update existing
        const { error } = await supabase.from(table).update(data).eq("id", data.id)

        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase.from(table).insert([data])
        if (error) throw error
      }

      await loadData()
      setEditingItem(null)
      alert(t("saveSuccess"))
    } catch (error) {
      console.error("[v0] Error saving:", error)
      alert(t("saveError"))
    }
  }

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFoodItems = foodItems.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {language === "kk"
                  ? "Деректер базасын басқару"
                  : language === "ru"
                    ? "Управление базой данных"
                    : "Database Management"}
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "restaurants" ? "default" : "outline"}
              onClick={() => setActiveTab("restaurants")}
            >
              {t("restaurants")}
            </Button>
            <Button variant={activeTab === "foods" ? "default" : "outline"} onClick={() => setActiveTab("foods")}>
              {t("foodItems")}
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Add New Button */}
        <Button
          onClick={() =>
            setEditingItem(
              activeTab === "restaurants" ? { is_active: true, is_new: false } : { is_active: true, discount: 0 },
            )
          }
          className="mb-6 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          {activeTab === "restaurants" ? t("addRestaurant") : t("addFood")}
        </Button>

        {/* Restaurants List */}
        {activeTab === "restaurants" && (
          <div className="grid gap-4">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={restaurant.image_url || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>⭐ {restaurant.rating}</span>
                      <span>🕐 {restaurant.delivery_time}</span>
                      <span>{restaurant.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingItem(restaurant)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete("restaurant", restaurant.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Food Items List */}
        {activeTab === "foods" && (
          <div className="grid gap-4">
            {filteredFoodItems.map((food) => (
              <Card key={food.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={food.image_url || "/placeholder.svg"}
                    alt={food.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <p className="text-sm text-muted-foreground">{food.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="font-bold text-primary">{food.price}₸</span>
                      <span>⭐ {food.rating}</span>
                      <span>🕐 {food.delivery_time}</span>
                      {food.discount > 0 && <span className="text-red-500">-{food.discount}%</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingItem(food)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete("food", food.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingItem.id ? t("edit") : t("addNew")} {activeTab === "restaurants" ? t("restaurant") : t("food")}
              </h2>

              <div className="space-y-4">
                <div>
                  <Label>{t("name")}</Label>
                  <Input
                    value={editingItem.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Name (KK)</Label>
                    <Input
                      value={editingItem.name_kk || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name_kk: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Name (RU)</Label>
                    <Input
                      value={editingItem.name_ru || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name_ru: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Name (EN)</Label>
                    <Input
                      value={editingItem.name_en || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name_en: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>{t("description")}</Label>
                  <Textarea
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>{t("imageUrl")}</Label>
                  <Input
                    value={editingItem.image_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                  />
                </div>

                {activeTab === "foods" && (
                  <>
                    <div>
                      <Label>{t("price")}</Label>
                      <Input
                        type="number"
                        value={editingItem.price || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, price: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>{t("discount")} (%)</Label>
                      <Input
                        type="number"
                        value={editingItem.discount || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, discount: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label>{t("category")}</Label>
                  <Input
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  />
                </div>

                <div>
                  <Label>{t("rating")}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editingItem.rating || 4.5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number.parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>{t("deliveryTime")}</Label>
                  <Input
                    value={editingItem.delivery_time || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, delivery_time: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleSave(activeTab === "restaurants" ? "restaurant" : "food", editingItem)}
                    className="flex-1"
                  >
                    {t("save")}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
