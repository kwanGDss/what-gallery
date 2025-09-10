"use client"

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spin' | 'dots' | 'pulse'
  color?: 'primary' | 'secondary' | 'accent'
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 'md',
  variant = 'spin',
  color = 'primary',
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  }

  if (variant === 'spin') {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent",
            sizeClasses[size],
            colorClasses[color]
          )}
          data-testid="loading-spinner"
        />
        {text && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full animate-pulse",
                size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3',
                colorClasses[color],
                'bg-current'
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
        {text && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    )
  }

  // Pulse variant
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full bg-current animate-pulse",
          sizeClasses[size],
          colorClasses[color]
        )}
        data-testid="loading-spinner"
      />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}