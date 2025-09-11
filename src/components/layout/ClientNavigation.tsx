"use client"

import { useEffect, useState } from 'react'
import { Navigation } from './Navigation'
import { User } from '@/types'

interface ClientNavigationProps {
  user?: User
  onAuthAction?: (action: 'signin' | 'signup' | 'signout') => void
  onMenuToggle?: () => void
}

export function ClientNavigation(props: ClientNavigationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex items-center px-2 max-w-none h-20">
          <div className="font-logo font-bold text-4xl ml-4">What Gallery</div>
        </div>
      </nav>
    )
  }

  return <Navigation {...props} />
}