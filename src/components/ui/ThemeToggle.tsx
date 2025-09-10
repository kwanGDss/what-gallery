"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'switch' | 'select'
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({
  size = 'md',
  variant = 'icon',
  showLabel = false,
  className
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Only render after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn("h-8 w-8 p-0", className)}
        disabled
      >
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  const sizeClasses = {
    sm: 'h-6 w-6 p-0 text-xs',
    md: 'h-8 w-8 p-0 text-sm',
    lg: 'h-10 w-10 p-0 text-base'
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  if (variant === 'icon') {
    const toggleTheme = () => {
      if (theme === 'light') {
        setTheme('dark')
      } else if (theme === 'dark') {
        setTheme('system')
      } else {
        setTheme('light')
      }
    }

    const getIcon = () => {
      if (theme === 'light') return <Sun className={iconSizeClasses[size]} />
      if (theme === 'dark') return <Moon className={iconSizeClasses[size]} />
      return <Monitor className={iconSizeClasses[size]} />
    }

    const getLabel = () => {
      if (theme === 'light') return 'Light'
      if (theme === 'dark') return 'Dark'
      return 'System'
    }

    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        className={cn(
          sizeClasses[size],
          showLabel && "w-auto px-3 gap-2",
          className
        )}
        title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      >
        {getIcon()}
        {showLabel && <span>{getLabel()}</span>}
      </Button>
    )
  }

  if (variant === 'select') {
    return (
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className={cn(
          "px-3 py-2 border rounded-md bg-background text-foreground",
          className
        )}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    )
  }

  // Switch variant (3 buttons)
  return (
    <div className={cn("flex gap-1", className)}>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('light')}
        className={sizeClasses[size]}
        data-active={theme === 'light'}
      >
        <Sun className={iconSizeClasses[size]} />
        {showLabel && <span className="ml-2">Light</span>}
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('dark')}
        className={sizeClasses[size]}
        data-active={theme === 'dark'}
      >
        <Moon className={iconSizeClasses[size]} />
        {showLabel && <span className="ml-2">Dark</span>}
      </Button>
      
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size={size}
        onClick={() => setTheme('system')}
        className={sizeClasses[size]}
        data-active={theme === 'system'}
      >
        <Monitor className={iconSizeClasses[size]} />
        {showLabel && <span className="ml-2">System</span>}
      </Button>
    </div>
  )
}