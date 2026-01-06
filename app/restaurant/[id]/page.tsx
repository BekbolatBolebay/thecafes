import { restaurants, foodItems } from '@/lib/data'
import RestaurantDetailPageClient from '@/components/restaurant-detail-page'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }))
}

// This is a Server Component
export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = restaurants.find((r) => r.id === params.id)
  
  if (!restaurant) {
    notFound()
  }

  const restaurantMenu = foodItems.filter((item) => item.restaurant === restaurant.name)

  return <RestaurantDetailPageClient restaurant={restaurant} menu={restaurantMenu} />
}
