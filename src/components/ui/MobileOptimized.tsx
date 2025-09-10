"use client"

import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useMobileBehavior } from '@/hooks/useTouch'

// Mobile-optimized container with proper touch targets
interface MobileContainerProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  safeArea?: boolean
}

export const MobileContainer = forwardRef<HTMLDivElement, MobileContainerProps>(
  ({ children, className, padding = 'md', safeArea = true }, ref) => {
    const { isMobile } = useMobileBehavior()

    const paddingClasses = {
      none: '',
      sm: isMobile ? 'p-2' : 'p-4',
      md: isMobile ? 'p-4' : 'p-6',
      lg: isMobile ? 'p-6' : 'p-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          paddingClasses[padding],
          safeArea && 'safe-area-inset',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

MobileContainer.displayName = 'MobileContainer'

// Mobile-optimized button with proper touch targets
interface MobileButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ 
    children, 
    onClick, 
    className, 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    fullWidth = false 
  }, ref) => {
    const { isMobile } = useMobileBehavior()

    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
    
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/60',
      ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
    }

    const sizeClasses = {
      sm: isMobile ? 'h-12 px-4 text-sm' : 'h-9 px-3 text-sm', // Larger on mobile
      md: isMobile ? 'h-14 px-6 text-base' : 'h-10 px-4 text-sm',
      lg: isMobile ? 'h-16 px-8 text-lg' : 'h-11 px-8 text-base'
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          // Enhanced touch target
          isMobile && 'min-h-[44px] min-w-[44px]',
          className
        )}
        onClick={onClick}
        disabled={disabled}
        // Better touch response
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      >
        {children}
      </button>
    )
  }
)

MobileButton.displayName = 'MobileButton'

// Mobile-optimized input with proper spacing
interface MobileInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'search'
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder, 
    type = 'text', 
    className, 
    disabled = false,
    autoFocus = false 
  }, ref) => {
    const { isMobile } = useMobileBehavior()

    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Mobile-specific adjustments
          isMobile && 'h-12 text-base', // Larger on mobile to prevent zoom
          className
        )}
        // Prevent zoom on iOS
        style={{
          fontSize: isMobile ? '16px' : undefined
        }}
      />
    )
  }
)

MobileInput.displayName = 'MobileInput'

// Mobile-optimized grid with responsive columns
interface MobileGridProps {
  children: ReactNode
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  gap?: number
  className?: string
}

export function MobileGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = 4,
  className 
}: MobileGridProps) {
  const gapClass = `gap-${gap}`
  
  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${columns.mobile}`,
        `md:grid-cols-${columns.tablet}`,
        `lg:grid-cols-${columns.desktop}`,
        gapClass,
        className
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized modal with proper backdrop
interface MobileModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
  fullScreen?: boolean
}

export function MobileModal({ 
  children, 
  isOpen, 
  onClose, 
  className,
  fullScreen = false 
}: MobileModalProps) {
  const { isMobile } = useMobileBehavior()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div
        className={cn(
          'relative z-50 bg-background rounded-lg shadow-lg',
          isMobile || fullScreen 
            ? 'w-full h-full rounded-none' 
            : 'max-w-lg max-h-[90vh] mx-4',
          'overflow-auto',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// Mobile-optimized navigation with proper touch targets
interface MobileNavProps {
  children: ReactNode
  className?: string
  position?: 'top' | 'bottom'
}

export function MobileNav({ children, className, position = 'bottom' }: MobileNavProps) {
  const { isMobile } = useMobileBehavior()

  return (
    <nav
      className={cn(
        'flex items-center justify-around bg-background border-t',
        position === 'bottom' ? 'fixed bottom-0 left-0 right-0' : 'sticky top-0',
        isMobile ? 'h-16 px-2' : 'h-14 px-4',
        'safe-area-inset-bottom',
        className
      )}
    >
      {children}
    </nav>
  )
}

// Mobile-optimized card with proper spacing
interface MobileCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ children, className, padding = 'md', interactive = false, onClick }, ref) => {
    const { isMobile } = useMobileBehavior()

    const paddingClasses = {
      sm: isMobile ? 'p-3' : 'p-4',
      md: isMobile ? 'p-4' : 'p-6',
      lg: isMobile ? 'p-6' : 'p-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          paddingClasses[padding],
          interactive && 'cursor-pointer hover:shadow-md transition-shadow',
          // Better touch feedback
          interactive && isMobile && 'active:scale-[0.98] transition-transform',
          className
        )}
        onClick={onClick}
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {children}
      </div>
    )
  }
)

MobileCard.displayName = 'MobileCard'