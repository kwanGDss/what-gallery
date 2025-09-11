"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { HamburgerMenu } from './HamburgerMenu'
import { SearchBar } from '@/components/search/SearchBar'
import { Menu, Search, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  user?: User
  onAuthAction?: (action: 'signin' | 'signup' | 'signout') => void
  onMenuToggle?: () => void
}

function Navigation({
  user,
  onAuthAction,
  onMenuToggle
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
    // In real app, navigate to search results
  }


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    onMenuToggle?.()
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="navigation" suppressHydrationWarning>
        <div className="w-full flex items-center px-2 max-w-none h-20">
          {/* Left: Brand */}
          <Link href="/" className="font-logo font-bold text-4xl ml-4" data-testid="brand-link">
            What Gallery
          </Link>

          {/* Categories (Left) */}
          <div className="hidden md:flex items-center gap-2 ml-20" suppressHydrationWarning>
            <Link 
              href="/" 
              className={cn(
                "px-4 py-2 text-base font-medium relative hover:text-primary transition-all duration-200 border-b-2",
                pathname === "/" 
                  ? "text-primary border-primary" 
                  : "border-transparent hover:border-primary/30"
              )}
            >
              All
            </Link>
            <Link 
              href="/photos" 
              className={cn(
                "px-4 py-2 text-base font-medium relative hover:text-primary transition-all duration-200 border-b-2",
                pathname === "/photos" 
                  ? "text-primary border-primary" 
                  : "border-transparent hover:border-primary/30"
              )}
            >
              Photos
            </Link>
            <Link 
              href="/illustrations" 
              className={cn(
                "px-4 py-2 text-base font-medium relative hover:text-primary transition-all duration-200 border-b-2",
                pathname === "/illustrations" 
                  ? "text-primary border-primary" 
                  : "border-transparent hover:border-primary/30"
              )}
            >
              Illustrations
            </Link>
            <Link 
              href="/3d" 
              className={cn(
                "px-4 py-2 text-base font-medium relative hover:text-primary transition-all duration-200 border-b-2",
                pathname === "/3d" 
                  ? "text-primary border-primary" 
                  : "border-transparent hover:border-primary/30"
              )}
            >
              3D
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 justify-center items-center" suppressHydrationWarning>
            <div className="w-full max-w-6xl px-4">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search AI-generated content..."
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="default"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2" data-testid="user-menu">
                <span className="hidden sm:inline text-base" data-testid="user-name">
                  {user.name}
                </span>
                <Button variant="ghost" size="default">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button 
                  variant="ghost" 
                  size="default"
                  onClick={() => onAuthAction?.('signin')}
                  data-testid="signin-button"
                  className="text-base px-4 py-2"
                >
                  Sign In
                </Button>
                <Button 
                  size="default"
                  onClick={() => onAuthAction?.('signup')}
                  className="text-base px-4 py-2"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleMenu}
              data-testid="hamburger-menu-trigger"
              className="h-14 w-14 p-0"
            >
              <Menu className="h-14 w-14" />
            </Button>
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
        onThemeChange={handleThemeChange}
        currentTheme={theme}
        menuItems={[
          { label: 'Home', href: '/' },
          { label: 'Photos', href: '/photos' },
          { label: 'Illustrations', href: '/illustrations' },
          { label: '3D', href: '/3d' },
          { divider: true, label: '' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Help', href: '/help' },
          { label: 'API', href: '/api' }
        ]}
      />
    </>
  )
}

export { Navigation }