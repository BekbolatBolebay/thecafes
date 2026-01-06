"use client"

import Link from "next/link"
import Image from "next/image"
import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"
import { foodCategories } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AllCategoriesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      <SearchHeader />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Артқа батырмасы */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-accent mb-6 hover:opacity-70 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Артқа
        </button>

        <h1 className="text-3xl font-bold mb-8">Барлық категориялар</h1>

        {/* Категориялар сөрелік */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {foodCategories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.id}`}
              className="group"
            >
              <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent transition cursor-pointer">
                {/* Суреті */}
                <div className="relative w-full h-32 bg-muted overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                {/* Мәтіні */}
                <div className="p-3">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-accent transition">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
