import { NextRequest, NextResponse } from 'next/server'
import { SignOutResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // In a real application, you might:
    // 1. Validate the auth token
    // 2. Add token to a blacklist
    // 3. Log the signout event
    // 4. Clean up any server-side session data

    const response: SignOutResponse = {
      success: true,
      message: 'Successfully signed out'
    }

    // Clear the HTTP-only cookie
    const responseObj = NextResponse.json(response)
    responseObj.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    })

    return responseObj
  } catch (error) {
    console.error('Error signing out user:', error)
    return NextResponse.json(
      { error: { code: 'SIGNOUT_ERROR', message: 'Failed to sign out' } },
      { status: 500 }
    )
  }
}