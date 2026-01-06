"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import RestaurantForm from "@/components/admin/restaurant-form"
import { useApp } from "@/lib/store"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

interface RestaurantData {
  id?: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  is_active?: boolean;
  name_kk?: string;
  name_ru?: string;
  name_en?: string;
  description_kk?: string;
  description_ru?: string;
  description_en?: string;
}

export default function EditRestaurantPage() {
  const params = useParams()
  const { id } = params
  const { user, isAuthenticated } = useApp()
  const [initialData, setInitialData] = useState<RestaurantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !isAuthenticated || !user?.isAdmin) return

    const fetchRestaurant = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/restaurants/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data')
        }
        const data = await response.json()
        setInitialData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurant()
  }, [id, isAuthenticated, user])

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/restaurants" className="p-2 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Restaurant</h1>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="ml-2">Loading restaurant data...</p>
        </div>
      )}

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p>{error}</p></div>}

      {!isLoading && !error && initialData && (
        <RestaurantForm isEditing={true} initialData={initialData} />
      )}
    </div>
  )
}
