"use client"

import { useEffect, useRef, useCallback, useState } from 'react'

interface TouchPosition {
  x: number
  y: number
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null
  distance: number
  velocity: number
}

interface UseTouchOptions {
  onSwipe?: (direction: SwipeDirection) => void
  onTap?: (position: TouchPosition) => void
  onDoubleTap?: (position: TouchPosition) => void
  onLongPress?: (position: TouchPosition) => void
  onPinch?: (scale: number, center: TouchPosition) => void
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  preventScroll?: boolean
}

export function useTouch(options: UseTouchOptions = {}) {
  const {
    onSwipe,
    onTap,
    onDoubleTap,
    onLongPress,
    onPinch,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventScroll = false
  } = options

  const [isPressed, setIsPressed] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const touchStartRef = useRef<TouchPosition | null>(null)
  const touchEndRef = useRef<TouchPosition | null>(null)
  const touchTimeRef = useRef<number>(0)
  const lastTapRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialDistanceRef = useRef<number>(0)
  const initialScaleRef = useRef<number>(1)

  const getTouchPosition = useCallback((event: TouchEvent): TouchPosition => {
    const touch = event.touches[0] || event.changedTouches[0]
    return {
      x: touch.clientX,
      y: touch.clientY
    }
  }, [])

  const getDistance = useCallback((touch1: Touch, touch2: Touch): number => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }, [])

  const getCenter = useCallback((touch1: Touch, touch2: Touch): TouchPosition => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }, [])

  const getSwipeDirection = useCallback((start: TouchPosition, end: TouchPosition): SwipeDirection => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / (Date.now() - touchTimeRef.current)

    if (distance < swipeThreshold) {
      return { direction: null, distance: 0, velocity: 0 }
    }

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    let direction: 'left' | 'right' | 'up' | 'down'
    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    return { direction, distance, velocity }
  }, [swipeThreshold])

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventScroll) {
      event.preventDefault()
    }

    setIsPressed(true)
    touchTimeRef.current = Date.now()

    if (event.touches.length === 1) {
      const position = getTouchPosition(event)
      touchStartRef.current = position

      // Set up long press timer
      longPressTimerRef.current = setTimeout(() => {
        if (touchStartRef.current) {
          onLongPress?.(position)
        }
      }, longPressDelay)
    } else if (event.touches.length === 2) {
      // Pinch gesture setup
      const distance = getDistance(event.touches[0], event.touches[1])
      initialDistanceRef.current = distance
      initialScaleRef.current = 1

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    }
  }, [getTouchPosition, onLongPress, longPressDelay, preventScroll])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (preventScroll) {
      event.preventDefault()
    }

    if (event.touches.length === 1) {
      // Clear long press timer on move
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
    } else if (event.touches.length === 2 && onPinch) {
      // Handle pinch gesture
      const distance = getDistance(event.touches[0], event.touches[1])
      const scale = distance / initialDistanceRef.current
      const center = getCenter(event.touches[0], event.touches[1])
      
      onPinch(scale * initialScaleRef.current, center)
    }
  }, [onPinch, getDistance, getCenter, preventScroll])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    setIsPressed(false)

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (event.changedTouches.length === 1 && touchStartRef.current) {
      const position = getTouchPosition(event)
      touchEndRef.current = position

      const touchDuration = Date.now() - touchTimeRef.current
      const swipe = getSwipeDirection(touchStartRef.current, position)

      if (swipe.direction) {
        // Handle swipe
        onSwipe?.(swipe)
      } else if (touchDuration < 200) {
        // Handle tap or double tap
        const now = Date.now()
        const timeSinceLastTap = now - lastTapRef.current

        if (timeSinceLastTap < doubleTapDelay && onDoubleTap) {
          onDoubleTap(position)
          lastTapRef.current = 0 // Reset to prevent triple tap
        } else {
          lastTapRef.current = now
          // Delay single tap to check for double tap
          setTimeout(() => {
            if (lastTapRef.current === now) {
              onTap?.(position)
            }
          }, doubleTapDelay)
        }
      }
    }

    touchStartRef.current = null
    touchEndRef.current = null
  }, [getTouchPosition, getSwipeDirection, onSwipe, onTap, onDoubleTap, doubleTapDelay])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)

      // Clean up timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll])

  return {
    ref: (element: HTMLElement | null) => {
      elementRef.current = element
    },
    isPressed
  }
}

// Hook for detecting device capabilities
export function useDeviceCapabilities() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isPointerDevice, setIsPointerDevice] = useState(false)
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  useEffect(() => {
    const updateCapabilities = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsPointerDevice(window.matchMedia('(pointer: fine)').matches)

      const width = window.innerWidth
      const height = window.innerHeight

      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      })
    }

    updateCapabilities()
    window.addEventListener('resize', updateCapabilities)

    return () => window.removeEventListener('resize', updateCapabilities)
  }, [])

  return {
    isTouchDevice,
    isPointerDevice,
    screenSize
  }
}

// Hook for mobile-specific behaviors
export function useMobileBehavior() {
  const { isTouchDevice, screenSize } = useDeviceCapabilities()
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  // Prevent zoom on double tap for iOS
  useEffect(() => {
    if (!isTouchDevice) return

    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventDoubleTapZoom = (e: TouchEvent) => {
      const t = e.timeStamp
      const interval = t - (window as any).lastTouch || t
      
      if (interval < 500 && interval > 0) {
        e.preventDefault()
      }
      
      (window as any).lastTouch = t
    }

    document.addEventListener('touchstart', preventDefault, { passive: false })
    document.addEventListener('touchstart', preventDoubleTapZoom, { passive: false })

    return () => {
      document.removeEventListener('touchstart', preventDefault)
      document.removeEventListener('touchstart', preventDoubleTapZoom)
    }
  }, [isTouchDevice])

  return {
    isTouchDevice,
    screenSize,
    orientation,
    isMobile: screenSize.isMobile,
    isTablet: screenSize.isTablet,
    isDesktop: screenSize.isDesktop
  }
}