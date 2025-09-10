"use client"

import { forwardRef, ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  loading?: boolean
  success?: boolean
  children?: ReactNode
  className?: string
  labelClassName?: string
  id?: string
}

export function FormField({
  label,
  error,
  hint,
  required = false,
  loading = false,
  success = false,
  children,
  className,
  labelClassName,
  id
}: FormFieldProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label 
          htmlFor={fieldId}
          className={cn(
            'text-sm font-medium',
            error && 'text-destructive',
            success && 'text-green-600',
            labelClassName
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      <div className="relative">
        {children}
        
        {/* Status icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {!loading && error && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          {!loading && !error && success && (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
        </div>
      </div>

      {/* Hint text */}
      {hint && !error && (
        <p 
          id={hintId}
          className="text-xs text-muted-foreground"
        >
          {hint}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          id={errorId}
          className="text-xs text-destructive flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced input with built-in validation display
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  loading?: boolean
  success?: boolean
  containerClassName?: string
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    label, 
    error, 
    hint, 
    loading, 
    success, 
    required, 
    className, 
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const fieldId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const hintId = hint ? `${fieldId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ')

    return (
      <FormField
        label={label}
        error={error}
        hint={hint}
        required={required}
        loading={loading}
        success={success}
        className={containerClassName}
        id={fieldId}
      >
        <Input
          ref={ref}
          id={fieldId}
          className={cn(
            // Base styles
            'pr-10', // Space for icons
            // Error state
            error && 'border-destructive focus-visible:ring-destructive',
            // Success state
            !error && success && 'border-green-600 focus-visible:ring-green-600',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          {...props}
        />
      </FormField>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'

// Textarea variant
interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  loading?: boolean
  success?: boolean
  containerClassName?: string
}

export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ 
    label, 
    error, 
    hint, 
    loading, 
    success, 
    required, 
    className, 
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const fieldId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const hintId = hint ? `${fieldId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ')

    return (
      <FormField
        label={label}
        error={error}
        hint={hint}
        required={required}
        loading={loading}
        success={success}
        className={containerClassName}
        id={fieldId}
      >
        <textarea
          ref={ref}
          id={fieldId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none', // Prevent resize for consistent layout
            // Error state
            error && 'border-destructive focus-visible:ring-destructive',
            // Success state
            !error && success && 'border-green-600 focus-visible:ring-green-600',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          {...props}
        />
      </FormField>
    )
  }
)

ValidatedTextarea.displayName = 'ValidatedTextarea'

// File input variant
interface ValidatedFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
  loading?: boolean
  success?: boolean
  containerClassName?: string
  acceptedFileTypes?: string[]
  maxSize?: number
  onFileSelect?: (file: File | null) => void
}

export const ValidatedFileInput = forwardRef<HTMLInputElement, ValidatedFileInputProps>(
  ({ 
    label, 
    error, 
    hint, 
    loading, 
    success, 
    required, 
    className, 
    containerClassName,
    acceptedFileTypes,
    maxSize,
    onFileSelect,
    onChange,
    id,
    ...props 
  }, ref) => {
    const fieldId = id || `file-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${fieldId}-error` : undefined
    const hintId = hint ? `${fieldId}-hint` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      onFileSelect?.(file)
      onChange?.(event)
    }

    const enhancedHint = [
      hint,
      acceptedFileTypes && `Accepted: ${acceptedFileTypes.join(', ')}`,
      maxSize && `Max size: ${Math.round(maxSize / 1024 / 1024)}MB`
    ].filter(Boolean).join(' • ')

    return (
      <FormField
        label={label}
        error={error}
        hint={enhancedHint}
        required={required}
        loading={loading}
        success={success}
        className={containerClassName}
        id={fieldId}
      >
        <input
          ref={ref}
          type="file"
          id={fieldId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            // Error state
            error && 'border-destructive focus-visible:ring-destructive',
            // Success state
            !error && success && 'border-green-600 focus-visible:ring-green-600',
            className
          )}
          accept={acceptedFileTypes?.join(',')}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          onChange={handleChange}
          {...props}
        />
      </FormField>
    )
  }
)

ValidatedFileInput.displayName = 'ValidatedFileInput'