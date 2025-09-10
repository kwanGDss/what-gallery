"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction = 
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_ALL' }

const ToastContext = createContext<{
  state: ToastState
  dispatch: React.Dispatch<ToastAction>
} | null>(null)

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      }
    case 'CLEAR_ALL':
      return {
        ...state,
        toasts: []
      }
    default:
      return state
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  return (
    <ToastContext.Provider value={{ state, dispatch }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { dispatch } = context

  const toast = React.useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id,
        duration: 5000,
        ...options
      }
    })
    return id
  }, [dispatch])

  const success = React.useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    return toast({ ...options, type: 'success', message })
  }, [toast])

  const error = React.useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    return toast({ ...options, type: 'error', message, duration: 8000 })
  }, [toast])

  const warning = React.useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    return toast({ ...options, type: 'warning', message })
  }, [toast])

  const info = React.useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) => {
    return toast({ ...options, type: 'info', message })
  }, [toast])

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [dispatch])

  const dismissAll = React.useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [dispatch])

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll
  }
}

function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { state } = context

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {state.toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
}

function ToastItem({ toast }: ToastItemProps) {
  const { dismiss } = useToast()

  useEffect(() => {
    if (!toast.persistent && toast.duration) {
      const timer = setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, toast.persistent, dismiss])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colorClasses = {
    success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200'
  }

  const iconColorClasses = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 border rounded-lg shadow-lg',
        'animate-in slide-in-from-right duration-300',
        colorClasses[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColorClasses[toast.type])} />
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm">
          {toast.message}
        </div>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm underline hover:no-underline font-medium"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => dismiss(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Hook for error toast with common patterns
export function useErrorToast() {
  const { error } = useToast()

  const handleError = React.useCallback((err: Error | string, context?: string) => {
    const message = typeof err === 'string' ? err : err.message
    const title = context ? `Error in ${context}` : 'Error'
    
    error(message, { 
      title,
      persistent: true,
      action: {
        label: 'Report Issue',
        onClick: () => {
          // Open support form or log issue
          console.error('User reported error:', err, context)
        }
      }
    })
  }, [error])

  const handleApiError = React.useCallback((err: any, fallbackMessage = 'An error occurred') => {
    const message = err?.response?.data?.message || err?.message || fallbackMessage
    error(message, {
      title: 'API Error',
      duration: 8000
    })
  }, [error])

  const handleValidationError = React.useCallback((errors: Record<string, string>) => {
    const messages = Object.values(errors)
    if (messages.length > 0) {
      error(messages[0], {
        title: 'Validation Error',
        duration: 6000
      })
    }
  }, [error])

  return {
    handleError,
    handleApiError,
    handleValidationError
  }
}