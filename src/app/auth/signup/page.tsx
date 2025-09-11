"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthForm } from '@/components/auth/AuthForm'

interface FormData {
  email: string
  password: string
  name?: string
  confirmPassword?: string
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleSignUp = async (data: FormData) => {
    setLoading(true)
    setError(undefined)
    
    try {
      // Simulate API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Account creation failed')
      }

      const result = await response.json()
      
      // In a real app, you'd store the token/session
      console.log('Sign up successful:', result)
      
      // Redirect to homepage
      router.push('/')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    console.log('Google OAuth sign up')
    // In a real app, this would trigger Google OAuth flow
    router.push('/')
  }

  const handleToggleMode = () => {
    router.push('/auth/signin')
  }

  return (
    <AuthLayout
      title="Sign Up"
      description="Create your Plot account to discover and share amazing AI-generated content"
    >
      <AuthForm
        mode="signup"
        onSubmit={handleSignUp}
        onGoogleAuth={handleGoogleAuth}
        onToggleMode={handleToggleMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  )
}