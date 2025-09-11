"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Store error info in state
    this.setState({ errorInfo })
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
    
    // In production, you might want to log to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div 
          className={cn(
            "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
            this.props.className
          )}
          data-testid="error-boundary"
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            We encountered an unexpected error. This has been logged and we&apos;ll look into it.
          </p>

          <div className="flex gap-3">
            <Button 
              onClick={this.handleRetry}
              data-testid="retry-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={this.handleReload}
              data-testid="reload-button"
            >
              Reload Page
            </Button>
          </div>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-8 text-left w-full max-w-2xl">
              <summary className="cursor-pointer text-sm font-medium mb-4 text-muted-foreground">
                Error Details (Development)
              </summary>
              <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto">
                <div className="text-destructive font-semibold mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                <div className="whitespace-pre-wrap text-xs text-muted-foreground">
                  {this.state.error.stack}
                </div>
                {this.state.errorInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="font-semibold mb-2">Component Stack:</div>
                    <div className="whitespace-pre-wrap text-xs text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)
    
    if (process.env.NODE_ENV === 'production') {
      // Log to error reporting service
      // Example: logErrorToService(error, errorInfo)
    }
  }
}