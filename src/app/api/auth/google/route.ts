export const dynamic = "force-static"

import { NextRequest, NextResponse } from 'next/server'
import { GoogleAuthRequest, AuthResponse, User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: GoogleAuthRequest = await request.json()
    const { idToken } = body

    // Basic validation
    if (!idToken) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Google ID token is required' } },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Verify the Google ID token with Google's API
    // 2. Extract user information from the verified token
    // 3. Create or update user in database
    
    // For simulation, we'll create a mock Google user
    const mockGoogleUser: User = {
      id: `google_${Date.now()}`,
      name: 'Google User',
      email: 'google.user@example.com',
      profilePicture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      bio: 'Signed up with Google',
      stats: {
        subscriberCount: 0,
        postCount: 0,
        totalViews: 0,
        totalDownloads: 0
      },
      verified: true, // Google users are automatically verified
      joinDate: new Date().toISOString(),
      preferences: {
        theme: 'system',
        notifications: true,
        emailUpdates: true,
        favoriteCategories: []
      }
    }

    // Generate a mock JWT token
    const token = `mock-google-jwt-${mockGoogleUser.id}-${Date.now()}`
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    const response: AuthResponse = {
      user: mockGoogleUser,
      token: token,
      expiresAt: expiresAt.toISOString()
    }

    // Set HTTP-only cookie for security
    const responseObj = NextResponse.json(response)
    responseObj.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return responseObj
  } catch (error) {
    console.error('Error with Google OAuth:', error)
    return NextResponse.json(
      { error: { code: 'GOOGLE_AUTH_ERROR', message: 'Failed to authenticate with Google' } },
      { status: 500 }
    )
  }
}