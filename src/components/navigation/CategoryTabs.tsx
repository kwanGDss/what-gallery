"use client"

import { ContentCategory } from '@/types'
import { Button } from '@/components/ui/button'
import { Camera, Palette, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  activeCategory?: ContentCategory
  onCategoryChange: (category: ContentCategory | null) => void
  categories: {
    id: ContentCategory
    name: string
    icon: string
    count?: number
  }[]
  className?: string
}

const iconMap = {
  camera: Camera,
  palette: Palette,
  box: Box
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  categories,
  className
}: CategoryTabsProps) {
  return (
    <div 
      className={cn("flex gap-1 py-2 overflow-x-auto", className)}
      data-testid="category-tabs"
    >
      {/* All Categories Tab */}
      <Button
        variant={!activeCategory ? "default" : "ghost"}
        size="sm"
        onClick={() => onCategoryChange(null)}
        className="shrink-0"
        data-testid="category-tab-all"
        data-active={!activeCategory}
      >
        All
      </Button>

      {/* Category Tabs */}
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Camera
        const isActive = activeCategory === category.id
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="shrink-0 flex items-center gap-2"
            data-testid={`category-tab-${category.id}`}
            data-active={isActive}
          >
            <IconComponent className="h-4 w-4" />
            {category.name}
            {category.count !== undefined && (
              <span className="text-xs opacity-75">
                {category.count}
              </span>
            )}
          </Button>
        )
      })}
    </div>
  )
}