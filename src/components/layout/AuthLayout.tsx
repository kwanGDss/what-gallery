"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function AuthLayout({
  children,
  title,
  description,
  className
}: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen flex", className)} data-testid="auth-layout">
      {/* SEO Meta Tags */}
      {title && (
        <title>{title} | Plot - AI Generated Content Gallery</title>
      )}
      {description && (
        <meta name="description" content={description} />
      )}

      {/* Left Side - Form (3/10 width) */}
      <div className="w-full md:w-3/10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-background" data-testid="auth-form-section">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Brand */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              Plot
            </Link>
          </div>

          {/* Form Content */}
          <div className="w-full">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
              <Link 
                href="/privacy" 
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/help" 
                className="hover:text-foreground transition-colors"
              >
                Help
              </Link>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              © 2024 Plot. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image (7/10 width, hidden on mobile) */}
      <div className="hidden md:flex md:w-7/10 relative bg-muted" data-testid="auth-image-section">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            {/* Placeholder for auth background image */}
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Plot</h2>
                <p className="text-lg opacity-80">Discover amazing AI-generated content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 text-white">
          {/* Top Quote/Testimonial */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md text-center">
              <blockquote className="text-xl mb-4">
                &quot;Plot has revolutionized how I discover and share AI-generated art. 
                The community is incredible!&quot;
              </blockquote>
              <cite className="text-sm opacity-80">
                — Sarah Chen, Digital Artist
              </cite>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm opacity-80">Creators</div>
            </div>
            <div>
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-sm opacity-80">Artworks</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2M+</div>
              <div className="text-sm opacity-80">Downloads</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-8 h-8 bg-white/20 rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-white/15 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-white/25 rounded-full animate-pulse delay-1000" />
      </div>
    </div>
  )
}