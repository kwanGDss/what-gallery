import { NextRequest, NextResponse } from 'next/server'
import usersData from '@/data/users.json'
import { User, SignInRequest, AuthResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } },
        { status: 400 }
      )
    }

    // Type cast the imported JSON data
    const users = usersData as User[]

    // Find user by email (this is a simulation - in real app you'd check hashed password)
    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    // Generate a mock JWT token (in real app, use proper JWT library)
    const token = `mock-jwt-${user.id}-${Date.now()}`
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    const response: AuthResponse = {
      user: user,
      token: token,
      expiresAt: expiresAt.toISOString()
    }

    // Set HTTP-only cookie for security (optional)
    const responseObj = NextResponse.json(response)
    responseObj.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return responseObj
  } catch (error) {
    console.error('Error signing in user:', error)
    return NextResponse.json(
      { error: { code: 'SIGNIN_ERROR', message: 'Failed to sign in' } },
      { status: 500 }
    )
  }
}