import { cn } from '@/lib/utils'

interface ScreenReaderOnlyProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  focusable?: boolean
}

export function ScreenReaderOnly({ 
  children, 
  className, 
  asChild = false, 
  focusable = false 
}: ScreenReaderOnlyProps) {
  const Component = asChild ? 'span' : 'div'
  
  return (
    <Component 
      className={cn(
        // Screen reader only classes
        'absolute left-[-10000px] top-auto w-[1px] h-[1px] overflow-hidden',
        // Make focusable if needed (for skip links)
        focusable && 'focus:relative focus:left-auto focus:top-auto focus:w-auto focus:h-auto focus:overflow-visible focus:z-50',
        className
      )}
      aria-hidden={!focusable ? 'true' : undefined}
    >
      {children}
    </Component>
  )
}

// Utility component for live regions
interface LiveRegionProps {
  children: React.ReactNode
  level?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}

export function LiveRegion({ 
  children, 
  level = 'polite', 
  atomic = false, 
  relevant = 'all',
  className 
}: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}

// Component for providing context to screen readers
interface DescriptionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Description({ id, children, className }: DescriptionProps) {
  return (
    <div
      id={id}
      className={cn('sr-only', className)}
      role="note"
    >
      {children}
    </div>
  )
}

// Component for status messages
interface StatusProps {
  children: React.ReactNode
  className?: string
  role?: 'status' | 'alert'
}

export function Status({ children, className, role = 'status' }: StatusProps) {
  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}