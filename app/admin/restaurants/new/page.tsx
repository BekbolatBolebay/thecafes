"use client"

import RestaurantForm from "@/components/admin/restaurant-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewRestaurantPage() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/restaurants" className="p-2 hover:bg-gray-100 rounded-full mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Create New Restaurant</h1>
      </div>
      <RestaurantForm isEditing={false} />
    </div>
  )
}
