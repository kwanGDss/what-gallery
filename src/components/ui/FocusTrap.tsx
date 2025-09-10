"use client"

import { useEffect, useRef, ReactNode } from 'react'
import { useFocusManagement } from '@/hooks/useKeyboardNavigation'

interface FocusTrapProps {
  children: ReactNode
  enabled?: boolean
  restoreFocus?: boolean
  className?: string
}

export function FocusTrap({ 
  children, 
  enabled = true, 
  restoreFocus = true,
  className 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { saveFocus, restoreFocus: restore, trapFocus } = useFocusManagement()

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    // Save the currently focused element
    if (restoreFocus) {
      saveFocus()
    }

    // Set up focus trap
    const cleanup = trapFocus(containerRef.current)

    return () => {
      cleanup()
      // Restore focus when component unmounts
      if (restoreFocus) {
        restore()
      }
    }
  }, [enabled, restoreFocus, saveFocus, restore, trapFocus])

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Component for creating focusable landmarks
interface LandmarkProps {
  children: ReactNode
  role?: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'search' | 'region'
  ariaLabel?: string
  ariaLabelledBy?: string
  id?: string
  className?: string
  tabIndex?: number
}

export function Landmark({
  children,
  role = 'region',
  ariaLabel,
  ariaLabelledBy,
  id,
  className,
  tabIndex = -1
}: LandmarkProps) {
  return (
    <div
      role={role}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={tabIndex}
      className={className}
    >
      {children}
    </div>
  )
}

// Skip link component
interface SkipLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        absolute top-0 left-0 -translate-y-full z-50
        bg-primary text-primary-foreground px-4 py-2 
        focus:translate-y-0 transition-transform
        ${className}
      `}
      onFocus={(e) => {
        // Ensure the target element is focusable
        const target = document.querySelector(href)
        if (target) {
          target.setAttribute('tabindex', '-1')
        }
      }}
    >
      {children}
    </a>
  )
}

// Heading component with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  id?: string
  className?: string
}

export function AccessibleHeading({ 
  level, 
  children, 
  id, 
  className 
}: AccessibleHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}

// Form field with proper labeling and error association
interface AccessibleFormFieldProps {
  id: string
  label: string
  children: ReactNode
  error?: string
  description?: string
  required?: boolean
  className?: string
}

export function AccessibleFormField({
  id,
  label,
  children,
  error,
  description,
  required = false,
  className
}: AccessibleFormFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const descriptionId = description ? `${id}-description` : undefined
  const describedBy = [errorId, descriptionId].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <div id={descriptionId} className="text-sm text-muted-foreground mb-2">
          {description}
        </div>
      )}
      
      <div>
        {typeof children === 'function' 
          ? children({ 
              id, 
              'aria-describedby': describedBy || undefined,
              'aria-invalid': error ? 'true' : undefined,
              'aria-required': required
            })
          : children
        }
      </div>
      
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-destructive mt-1"
        >
          {error}
        </div>
      )}
    </div>
  )
}