"use client"

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ScreenReaderOnly } from './ScreenReaderOnly'

interface AccessibleButtonProps extends ButtonProps {
  srLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  ariaControls?: string
  ariaPressed?: boolean
  loading?: boolean
  loadingText?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    srLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaHaspopup,
    ariaControls,
    ariaPressed,
    loading = false,
    loadingText = 'Loading',
    disabled,
    className,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        aria-label={srLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
        aria-controls={ariaControls}
        aria-pressed={ariaPressed}
        aria-busy={loading}
        className={cn(
          // Focus styles for better accessibility
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // High contrast mode support
          'forced-colors:border forced-colors:border-solid',
          className
        )}
        {...props}
      >
        {loading && (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
          </>
        )}
        {children}
      </Button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

// Icon button variant with better accessibility
interface IconButtonProps extends AccessibleButtonProps {
  icon: React.ReactNode
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, children, className, ...props }, ref) => {
    return (
      <AccessibleButton
        ref={ref}
        srLabel={label}
        className={cn('p-2', className)}
        {...props}
      >
        {icon}
        <ScreenReaderOnly>{label}</ScreenReaderOnly>
        {children}
      </AccessibleButton>
    )
  }
)

IconButton.displayName = 'IconButton'

// Toggle button with accessibility
interface ToggleButtonProps extends AccessibleButtonProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  pressedLabel?: string
  unpressedLabel?: string
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({
    pressed,
    onPressedChange,
    pressedLabel = 'Activated',
    unpressedLabel = 'Not activated',
    children,
    onClick,
    ...props
  }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPressedChange(!pressed)
      onClick?.(event)
    }

    return (
      <AccessibleButton
        ref={ref}
        ariaPressed={pressed}
        srLabel={pressed ? pressedLabel : unpressedLabel}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ScreenReaderOnly>
          {pressed ? pressedLabel : unpressedLabel}
        </ScreenReaderOnly>
      </AccessibleButton>
    )
  }
)

ToggleButton.displayName = 'ToggleButton'

// Menu button with accessibility
interface MenuButtonProps extends AccessibleButtonProps {
  menuId: string
  menuOpen: boolean
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ menuId, menuOpen, children, ...props }, ref) => {
    return (
      <AccessibleButton
        ref={ref}
        ariaHaspopup="menu"
        ariaExpanded={menuOpen}
        ariaControls={menuOpen ? menuId : undefined}
        {...props}
      >
        {children}
      </AccessibleButton>
    )
  }
)

MenuButton.displayName = 'MenuButton'