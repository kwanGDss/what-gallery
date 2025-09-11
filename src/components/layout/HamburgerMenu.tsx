"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { User, MenuItem } from '@/types'
import { Button } from '@/components/ui/button'
import { X, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
  user?: User
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void
  currentTheme?: string
  menuItems: MenuItem[]
  className?: string
}

export function HamburgerMenu({
  isOpen,
  onClose,
  user,
  onThemeChange,
  currentTheme,
  menuItems,
  className
}: HamburgerMenuProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-background border-l shadow-lg z-50",
          "transform transition-transform duration-300 ease-in-out",
          className
        )}
        data-testid="hamburger-menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 py-6">
            <nav className="space-y-2 px-6">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        item.onClick?.()
                        if (!item.onClick) onClose()
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </button>
                  )}
                  {item.divider && <hr className="my-2" />}
                </div>
              ))}
            </nav>
          </div>

          {/* Theme Toggle Section */}
          <div className="border-t p-6" data-testid="theme-toggle">
            <h3 className="font-medium mb-4">Theme</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onThemeChange('light')
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left",
                  currentTheme === 'light' && "bg-muted"
                )}
                data-testid="theme-light"
                data-active={currentTheme === 'light'}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              
              <button
                onClick={() => {
                  onThemeChange('dark')
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left",
                  currentTheme === 'dark' && "bg-muted"
                )}
                data-testid="theme-dark"
                data-active={currentTheme === 'dark'}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              
              <button
                onClick={() => {
                  onThemeChange('system')
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left",
                  currentTheme === 'system' && "bg-muted"
                )}
                data-testid="theme-system"
                data-active={currentTheme === 'system'}
              >
                <Monitor className="h-4 w-4" />
                System
              </button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground" data-testid="current-theme">
              Current: {currentTheme}
            </div>
          </div>

          {/* User Section */}
          {user && (
            <div className="border-t p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Handle logout
                  onClose()
                }}
                data-testid="logout-button"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}