"use client"

import { useState } from "react"
import Image from "next/image"
import { foodCategories } from "@/lib/data"

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [showAll, setShowAll] = useState(false)

  // When not showing the full list we display: first special button, up to 6 categories, and final "Все" button
  const categoriesToShow = showAll ? foodCategories : foodCategories.slice(0, 6)

  return (
    <div className="w-full">
      {/* Compact two-row grid: 4 cols x 2 rows */}
      {!showAll && (
        // Responsive grid:
        // - mobile: 2 columns x up to 4 rows (2x4)
        // - tablet (sm): 3 columns x 3 rows (3x3)
        // - desktop (lg): 4 columns x 2 rows (4x2)
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {/* Первый специальный батырма: текст "Брондау" (ранее "Мәзір") */}
          <button
            onClick={() => {
              onCategoryChange(null)
              setShowAll(false)
            }}
            // Preserve design tokens (rounded-full, font, colors, transitions)
            // Reduce visual size by decreasing padding and icon size (~15-25%)
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-full font-medium text-xs transition duration-150 ease-in-out select-none ${
              selectedCategory === null
                ? "bg-accent text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <div className="text-xl">📍</div>
            <div className="mt-1 text-sm">Брондау</div>
          </button>

          {/* Показываем до 6 категорий (следуют после первой кнопки) */}
          {categoriesToShow.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center justify-center rounded-full px-3 py-1.5 font-medium text-sm transition whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-accent text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <div className="text-xl">{category.icon}</div>
              <div className="mt-1 text-sm line-clamp-1">{category.name.split(" ")[0]}</div>
            </button>
          ))}

          {/* Последняя кнопка: "Все" — должна занимать последнюю (правую нижнюю) позицию в сетке */}
          <button
            onClick={() => {
              onCategoryChange(null)
              setShowAll(false)
            }}
            className={`flex flex-col items-center justify-center rounded-full px-3 py-1.5 font-medium text-sm transition whitespace-nowrap ${
              selectedCategory === null
                ? "bg-accent text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <div className="text-xl">📋</div>
            <div className="mt-1 text-sm">Все</div>
          </button>
        </div>
      )}

      {/* Expanded view: оставляем прежнюю карточную решетку (полный список) */}
      {showAll && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6 p-4 bg-card rounded-lg border border-border">
          {foodCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id)
                setShowAll(false)
              }}
              className={`p-3 rounded-lg text-center transition ${
                selectedCategory === category.id
                  ? "bg-accent text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-xs font-medium line-clamp-2">{category.name}</div>
            </button>
          ))}

          {/* Барлығы батырмасы */}
          <button
            onClick={() => {
              onCategoryChange(null)
              setShowAll(false)
            }}
            className={`p-3 rounded-lg text-center transition ${
              selectedCategory === null
                ? "bg-accent text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="text-xs font-medium">Барлығы</div>
          </button>
        </div>
      )}
    </div>
  )
}
