"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/Toast'

interface RetryConfig {
  maxAttempts: number
  delay: number
  exponentialBackoff: boolean
  onRetry?: (attempt: number) => void
  onMaxAttemptsReached?: () => void
}

interface UseErrorRecoveryOptions extends Partial<RetryConfig> {
  showToast?: boolean
  logErrors?: boolean
}

export function useErrorRecovery(options: UseErrorRecoveryOptions = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    exponentialBackoff = true,
    showToast = true,
    logErrors = true,
    onRetry,
    onMaxAttemptsReached
  } = options

  const [isRetrying, setIsRetrying] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lastError, setLastError] = useState<Error | null>(null)
  const { error: showErrorToast } = useToast()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> => {
    const config = { maxAttempts, delay, exponentialBackoff, onRetry, onMaxAttemptsReached, ...customConfig }
    let currentAttempt = 0

    const attempt = async (): Promise<T> => {
      try {
        const result = await operation()
        setLastError(null)
        setAttempts(0)
        setIsRetrying(false)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        setLastError(err)
        currentAttempt++
        setAttempts(currentAttempt)

        if (logErrors) {
          console.error(`Operation failed (attempt ${currentAttempt}):`, err)
        }

        if (currentAttempt >= config.maxAttempts) {
          setIsRetrying(false)
          config.onMaxAttemptsReached?.()
          
          if (showToast) {
            showErrorToast(`Operation failed after ${config.maxAttempts} attempts`, {
              title: 'Error',
              persistent: true
            })
          }
          throw err
        }

        // Calculate delay with optional exponential backoff
        const retryDelay = config.exponentialBackoff 
          ? config.delay * Math.pow(2, currentAttempt - 1)
          : config.delay

        setIsRetrying(true)
        config.onRetry?.(currentAttempt)

        return new Promise<T>((resolve, reject) => {
          timeoutRef.current = setTimeout(async () => {
            try {
              const result = await attempt()
              resolve(result)
            } catch (retryError) {
              reject(retryError)
            }
          }, retryDelay)
        })
      }
    }

    return attempt()
  }, [maxAttempts, delay, exponentialBackoff, onRetry, onMaxAttemptsReached, showToast, logErrors, showErrorToast])

  const reset = useCallback(() => {
    setIsRetrying(false)
    setAttempts(0)
    setLastError(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    executeWithRetry,
    isRetrying,
    attempts,
    lastError,
    reset
  }
}

// Hook for handling API errors with specific recovery strategies
export function useApiErrorRecovery() {
  const { executeWithRetry } = useErrorRecovery({
    maxAttempts: 3,
    delay: 2000,
    exponentialBackoff: true,
    showToast: true
  })

  const { error: showErrorToast, warning: showWarningToast } = useToast()

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options?: {
      retryOn?: (error: any) => boolean
      maxAttempts?: number
      showUserFriendlyError?: boolean
    }
  ): Promise<T> => {
    const {
      retryOn = (error: any) => {
        // Retry on network errors and 5xx server errors
        return !error.response || error.response.status >= 500
      },
      maxAttempts = 3,
      showUserFriendlyError = true
    } = options || {}

    try {
      return await executeWithRetry(async () => {
        try {
          return await apiCall()
        } catch (error: any) {
          // Don't retry if the error doesn't meet retry criteria
          if (!retryOn(error)) {
            throw error
          }
          throw error
        }
      }, { maxAttempts })
    } catch (error: any) {
      if (showUserFriendlyError) {
        const message = getApiErrorMessage(error)
        showErrorToast(message, {
          title: 'Request Failed',
          action: {
            label: 'Try Again',
            onClick: () => handleApiCall(apiCall, options)
          }
        })
      }
      throw error
    }
  }, [executeWithRetry, showErrorToast])

  return { handleApiCall }
}

// Hook for handling form submission errors
export function useFormErrorRecovery() {
  const [submissionErrors, setSubmissionErrors] = useState<Record<string, string>>({})
  const { handleApiCall } = useApiErrorRecovery()

  const handleFormSubmission = useCallback(async <T>(
    submitFunction: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void
      onError?: (error: any) => void
      clearErrorsOnSubmit?: boolean
    }
  ) => {
    const { onSuccess, onError, clearErrorsOnSubmit = true } = options || {}

    if (clearErrorsOnSubmit) {
      setSubmissionErrors({})
    }

    try {
      const result = await handleApiCall(submitFunction, {
        showUserFriendlyError: false // Handle errors manually for forms
      })
      onSuccess?.(result)
      return result
    } catch (error: any) {
      const errors = extractFormErrors(error)
      setSubmissionErrors(errors)
      onError?.(error)
      throw error
    }
  }, [handleApiCall])

  const clearFieldError = useCallback((fieldName: string) => {
    setSubmissionErrors(prev => {
      const { [fieldName]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setSubmissionErrors({})
  }, [])

  return {
    handleFormSubmission,
    submissionErrors,
    clearFieldError,
    clearAllErrors
  }
}

// Hook for graceful degradation when features fail
export function useGracefulDegradation<T>(
  primaryFunction: () => Promise<T>,
  fallbackFunction: () => T | Promise<T>,
  options?: {
    maxRetries?: number
    showFallbackMessage?: boolean
  }
) {
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { executeWithRetry } = useErrorRecovery({
    maxAttempts: options?.maxRetries || 2,
    showToast: false
  })
  const { warning: showWarningToast } = useToast()

  const execute = useCallback(async (): Promise<T> => {
    setIsLoading(true)
    setIsUsingFallback(false)

    try {
      const result = await executeWithRetry(primaryFunction)
      setIsLoading(false)
      return result
    } catch (error) {
      console.warn('Primary function failed, using fallback:', error)
      setIsUsingFallback(true)
      
      if (options?.showFallbackMessage) {
        showWarningToast('Some features are temporarily unavailable. Using basic functionality.', {
          title: 'Degraded Mode'
        })
      }

      try {
        const fallbackResult = await fallbackFunction()
        setIsLoading(false)
        return fallbackResult
      } catch (fallbackError) {
        setIsLoading(false)
        throw fallbackError
      }
    }
  }, [primaryFunction, fallbackFunction, executeWithRetry, options?.showFallbackMessage, showWarningToast])

  return {
    execute,
    isUsingFallback,
    isLoading
  }
}

// Utility functions
function getApiErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.response?.status) {
    const status = error.response.status
    if (status >= 400 && status < 500) {
      return 'There was a problem with your request. Please check your input and try again.'
    }
    if (status >= 500) {
      return 'We are experiencing server issues. Please try again in a moment.'
    }
  }
  
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Network connection failed. Please check your internet connection and try again.'
  }
  
  return 'An unexpected error occurred. Please try again.'
}

function extractFormErrors(error: any): Record<string, string> {
  // Handle validation errors from API
  if (error.response?.data?.errors) {
    return error.response.data.errors
  }
  
  // Handle single field error
  if (error.response?.data?.field && error.response?.data?.message) {
    return {
      [error.response.data.field]: error.response.data.message
    }
  }
  
  // Return general error
  return {
    general: getApiErrorMessage(error)
  }
}