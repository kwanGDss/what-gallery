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

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const router = useRouter()

  const handleSignIn = async (data: FormData) => {
    setLoading(true)
    setError(undefined)
    
    try {
      // Simulate API call
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const result = await response.json()
      
      // In a real app, you'd store the token/session
      console.log('Sign in successful:', result)
      
      // Redirect to homepage
      router.push('/')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    console.log('Google OAuth sign in')
    // In a real app, this would trigger Google OAuth flow
    router.push('/')
  }

  const handleToggleMode = () => {
    router.push('/auth/signup')
  }

  return (
    <AuthLayout
      title="Sign In"
      description="Sign in to your Plot account to discover amazing AI-generated content"
    >
      <AuthForm
        mode="signin"
        onSubmit={handleSignIn}
        onGoogleAuth={handleGoogleAuth}
        onToggleMode={handleToggleMode}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  )
}