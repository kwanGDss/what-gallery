import { NextRequest, NextResponse } from 'next/server'
import usersData from '@/data/users.json'
import { User, SignUpRequest, AuthResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required' } },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid email format' } },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters long' } },
        { status: 400 }
      )
    }

    // Type cast the imported JSON data
    const users = usersData as User[]

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'USER_EXISTS', message: 'User with this email already exists' } },
        { status: 409 }
      )
    }

    // Create new user (in real app, hash the password and save to database)
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name,
      email: email,
      profilePicture: '/images/avatars/default.jpg',
      bio: '',
      stats: {
        subscriberCount: 0,
        postCount: 0,
        totalViews: 0,
        totalDownloads: 0
      },
      verified: false,
      joinDate: new Date().toISOString(),
      preferences: {
        theme: 'system',
        notifications: true,
        emailUpdates: false,
        favoriteCategories: []
      }
    }

    // Generate a mock JWT token
    const token = `mock-jwt-${newUser.id}-${Date.now()}`
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    const response: AuthResponse = {
      user: newUser,
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
    console.error('Error signing up user:', error)
    return NextResponse.json(
      { error: { code: 'SIGNUP_ERROR', message: 'Failed to create account' } },
      { status: 500 }
    )
  }
}