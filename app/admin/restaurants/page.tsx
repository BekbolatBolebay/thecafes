"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Search, Upload, Star } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface Restaurant {
  id: string
  name: string
  name_kk?: string
  name_ru?: string
  name_en?: string
  description?: string
  description_kk?: string
  description_ru?: string
  description_en?: string
  image_url: string
  rating: number
  delivery_time: string
  category: string
  is_new: boolean
  is_active: boolean
  created_at?: string
}

export default function AdminRestaurantsPage() {
  const router = useRouter()
  const { user, language } = useAppStore()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingItem, setEditingItem] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    checkAdminAndLoadData()
  }, [])

  const checkAdminAndLoadData = async () => {
    if (!user?.email) {
      router.push("/login")
      return
    }

    const { data: userData } = await supabase.from("users").select("is_admin").eq("email", user.email).single()

    if (!userData?.is_admin) {
      router.push("/")
      return
    }

    loadRestaurants()
  }

  const loadRestaurants = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setRestaurants(data || [])
    } catch (error) {
      console.error("Error loading restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingItem) return

    try {
      if (editingItem.id && editingItem.id.startsWith("new-")) {
        const { id, ...insertData } = editingItem
        const { error } = await supabase.from("restaurants").insert([insertData])
        if (error) throw error
      } else {
        const { error } = await supabase.from("restaurants").update(editingItem).eq("id", editingItem.id)
        if (error) throw error
      }

      await loadRestaurants()
      setEditingItem(null)
      alert(language === "kk" ? "Сәтті сақталды!" : language === "ru" ? "Успешно сохранено!" : "Successfully saved!")
    } catch (error) {
      console.error("Error saving restaurant:", error)
      alert(language === "kk" ? "Қате орын алды" : language === "ru" ? "Произошла ошибка" : "An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(language === "kk" ? "Жоюға сенімдісіз бе?" : language === "ru" ? "Вы уверены?" : "Are you sure?")) {
      return
    }

    try {
      const { error } = await supabase.from("restaurants").delete().eq("id", id)
      if (error) throw error

      await loadRestaurants()
      alert(language === "kk" ? "Сәтті жойылды!" : language === "ru" ? "Успешно удалено!" : "Successfully deleted!")
    } catch (error) {
      console.error("Error deleting restaurant:", error)
      alert(language === "kk" ? "Қате орын алды" : language === "ru" ? "Произошла ошибка" : "An error occurred")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingItem) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "restaurants")

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setEditingItem({ ...editingItem, image_url: url })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">
                {language === "kk" ? "Ресторандар" : language === "ru" ? "Рестораны" : "Restaurants"}
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={language === "kk" ? "Іздеу..." : language === "ru" ? "Поиск..." : "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Add Button */}
        <Button
          onClick={() =>
            setEditingItem({
              id: `new-${Date.now()}`,
              name: "",
              image_url: "",
              rating: 4.5,
              delivery_time: "30-40 мин",
              category: "",
              is_new: false,
              is_active: true,
            })
          }
          className="mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          {language === "kk" ? "Ресторан қосу" : language === "ru" ? "Добавить ресторан" : "Add Restaurant"}
        </Button>

        {/* Restaurants List */}
        <div className="grid gap-4">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={restaurant.image_url || "/placeholder.svg?height=100&width=100"}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {restaurant.rating}
                        </span>
                        <span>{restaurant.delivery_time}</span>
                        <span className="text-muted-foreground">{restaurant.category}</span>
                      </div>
                      {restaurant.is_new && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingItem(restaurant)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(restaurant.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingItem.id.startsWith("new-")
                  ? language === "kk"
                    ? "Жаңа ресторан"
                    : language === "ru"
                      ? "Новый ресторан"
                      : "New Restaurant"
                  : language === "kk"
                    ? "Өзгерту"
                    : language === "ru"
                      ? "Редактировать"
                      : "Edit"}
              </h2>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>{language === "kk" ? "Сурет" : language === "ru" ? "Изображение" : "Image"}</Label>
                  <div className="mt-2">
                    {editingItem.image_url && (
                      <img
                        src={editingItem.image_url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                    )}
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted transition">
                      <Upload className="w-5 h-5" />
                      <span>{uploading ? "Жүктелуде..." : "Сурет жүктеу"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label>{language === "kk" ? "Атауы" : language === "ru" ? "Название" : "Name"}</Label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder={
                      language === "kk"
                        ? "Ресторан атауы"
                        : language === "ru"
                          ? "Название ресторана"
                          : "Restaurant name"
                    }
                  />
                </div>

                {/* Names in different languages */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Атауы (KK)</Label>
                    <Input
                      value={editingItem.name_kk || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name_kk: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Название (RU)</Label>
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

                {/* Description */}
                <div>
                  <Label>{language === "kk" ? "Сипаттама" : language === "ru" ? "Описание" : "Description"}</Label>
                  <Textarea
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>{language === "kk" ? "Категория" : language === "ru" ? "Категория" : "Category"}</Label>
                  <Input
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder={
                      language === "kk" ? "Мысалы: Кафе" : language === "ru" ? "Например: Кафе" : "E.g. Cafe"
                    }
                  />
                </div>

                {/* Rating and Delivery Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === "kk" ? "Рейтинг" : language === "ru" ? "Рейтинг" : "Rating"}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingItem.rating}
                      onChange={(e) => setEditingItem({ ...editingItem, rating: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "kk" ? "Жеткізу уақыты" : language === "ru" ? "Время доставки" : "Delivery Time"}
                    </Label>
                    <Input
                      value={editingItem.delivery_time}
                      onChange={(e) => setEditingItem({ ...editingItem, delivery_time: e.target.value })}
                      placeholder="30-40 мин"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_new"
                      checked={editingItem.is_new}
                      onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_new: checked as boolean })}
                    />
                    <label htmlFor="is_new" className="text-sm">
                      {language === "kk" ? "Жаңа" : language === "ru" ? "Новый" : "New"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={editingItem.is_active}
                      onCheckedChange={(checked) => setEditingItem({ ...editingItem, is_active: checked as boolean })}
                    />
                    <label htmlFor="is_active" className="text-sm">
                      {language === "kk" ? "Белсенді" : language === "ru" ? "Активный" : "Active"}
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    {language === "kk" ? "Сақтау" : language === "ru" ? "Сохранить" : "Save"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                    {language === "kk" ? "Болдырмау" : language === "ru" ? "Отмена" : "Cancel"}
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
