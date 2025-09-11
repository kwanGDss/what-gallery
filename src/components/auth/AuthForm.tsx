"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSubmit: (data: FormData) => Promise<void>
  onGoogleAuth: () => void
  onToggleMode: () => void
  loading?: boolean
  error?: string
  className?: string
}

interface FormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogleAuth,
  onToggleMode,
  loading = false,
  error,
  className
}: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({})

  const isSignup = mode === 'signup'

  const validateForm = () => {
    const errors: Partial<FormData> = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (isSignup) {
      if (!formData.name?.trim()) {
        errors.name = 'Name is required'
      }
      
      if (!formData.confirmPassword?.trim()) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || loading) return
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Auth form error:', error)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className={cn("w-full max-w-sm space-y-6", className)} data-testid="auth-form">
      <div className="text-center">
        <h1 className="text-2xl font-bold" data-testid="welcome-title">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isSignup 
            ? 'Join Plot to discover amazing AI content' 
            : 'Sign in to your Plot account'
          }
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" data-testid={isSignup ? "signup-form" : "signin-form"}>
        {isSignup && (
          <div>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={loading}
              data-testid="name-input"
            />
            {fieldErrors.name && (
              <p className="text-destructive text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>
        )}

        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={loading}
            data-testid="email-input"
          />
          {fieldErrors.email && (
            <p className="text-destructive text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={loading}
              className="pr-10"
              data-testid="password-input"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {fieldErrors.password && (
            <p className="text-destructive text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {isSignup && (
          <div>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword || ''}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={loading}
                className="pr-10"
                data-testid="confirm-password-input"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
          data-testid="submit-button"
        >
          {loading ? (
            <LoadingSpinner size="sm" text={isSignup ? "Creating Account..." : "Signing In..."} />
          ) : (
            isSignup ? 'Create Account' : 'Sign In'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onGoogleAuth}
        disabled={loading}
        data-testid="google-signin-button"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          onClick={onToggleMode}
          disabled={loading}
          data-testid="toggle-auth-mode"
        >
          {isSignup 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </Button>
      </div>
    </div>
  )
}