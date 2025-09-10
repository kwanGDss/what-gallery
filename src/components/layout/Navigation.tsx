"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ContentCategory, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HamburgerMenu } from './HamburgerMenu'
import { CategoryTabs } from '@/components/navigation/CategoryTabs'
import { SearchBar } from '@/components/search/SearchBar'
import { Menu, Search, User as UserIcon } from 'lucide-react'

interface NavigationProps {
  currentCategory?: ContentCategory
  onCategoryChange?: (category: ContentCategory | null) => void
  user?: User
  onAuthAction?: (action: 'signin' | 'signup' | 'signout') => void
  onMenuToggle?: () => void
  className?: string
}

export function Navigation({
  currentCategory,
  onCategoryChange,
  user,
  onAuthAction,
  onMenuToggle,
  className
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // In real app, navigate to search results
  }

  const handleCategoryChange = (category: ContentCategory | null) => {
    onCategoryChange?.(category)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    onMenuToggle?.()
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="navigation">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" data-testid="brand-link">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            Plot
          </Link>

          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search AI-generated content..."
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2" data-testid="user-menu">
                <span className="hidden sm:inline text-sm" data-testid="user-name">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAuthAction?.('signin')}
                  data-testid="signin-button"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => onAuthAction?.('signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              data-testid="hamburger-menu-trigger"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-t">
          <div className="container mx-auto px-4">
            <CategoryTabs
              activeCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
              categories={[
                { id: 'photos', name: 'Photos', icon: 'camera' },
                { id: 'illustrations', name: 'Illustrations', icon: 'palette' },
                { id: '3d', name: '3D', icon: 'box' }
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background p-4 md:hidden">
          <div className="flex items-center gap-2 mb-4">
            <SearchBar 
              onSearch={(query) => {
                handleSearch(query)
                setIsSearchOpen(false)
              }}
              placeholder="Search AI-generated content..."
            />
            <Button
              variant="ghost"
              onClick={() => setIsSearchOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        onThemeToggle={() => {}}
        currentTheme="system"
        menuItems={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' }
        ]}
      />
    </>
  )
}