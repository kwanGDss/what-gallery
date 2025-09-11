"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { ContentCategory, User } from '@/types'
import { cn } from '@/lib/utils'
import { ClientNavigation } from './ClientNavigation'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  currentCategory?: ContentCategory
  onCategoryChange?: (category: ContentCategory | null) => void
  user?: User
  onAuthAction?: (action: 'signin' | 'signup' | 'signout') => void
  showNavigation?: boolean
  showCategoryTabs?: boolean
  className?: string
}

export function PageLayout({
  children,
  currentCategory,
  onCategoryChange,
  user,
  onAuthAction,
  showNavigation = true,
  showCategoryTabs = true,
  className
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {showNavigation && (
        <ClientNavigation
          user={user}
          onAuthAction={onAuthAction}
        />
      )}

      {/* Main Content */}
      <main 
        className={cn("flex-1 min-h-screen", className)}
        data-testid="page-layout-content"
      >
        {children}
      </main>
    </div>
  )
}