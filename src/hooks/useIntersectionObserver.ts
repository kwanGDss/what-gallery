"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
  skip?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setElement = useCallback((element: Element | null) => {
    elementRef.current = element
  }, [])

  useEffect(() => {
    if (skip || !elementRef.current) return

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const isCurrentlyIntersecting = entry.isIntersecting

        setIsIntersecting(isCurrentlyIntersecting)

        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        // Disconnect if triggerOnce and has intersected
        if (triggerOnce && isCurrentlyIntersecting && observerRef.current) {
          observerRef.current.disconnect()
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    // Start observing
    observerRef.current.observe(elementRef.current)

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, root, rootMargin, triggerOnce, skip, hasIntersected])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    isIntersecting,
    hasIntersected,
    setElement,
    ref: setElement
  }
}

// Hook for infinite scrolling
export function useInfiniteScroll(
  callback: () => void | Promise<void>,
  options: {
    threshold?: number
    rootMargin?: string
    disabled?: boolean
  } = {}
) {
  const { threshold = 0.1, rootMargin = '100px', disabled = false } = options
  const loadingRef = useRef<HTMLDivElement>(null)

  const { isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    skip: disabled
  })

  useEffect(() => {
    if (isIntersecting && !disabled) {
      callback()
    }
  }, [isIntersecting, callback, disabled])

  return { loadingRef }
}

// Hook for lazy loading components
export function useLazyLoad<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const { isIntersecting, hasIntersected, setElement } = useIntersectionObserver({
    triggerOnce: true,
    rootMargin: '50px',
    ...options
  })

  return {
    shouldLoad: isIntersecting || hasIntersected,
    isVisible: isIntersecting,
    ref: setElement as (element: T | null) => void
  }
}

// Hook for viewport tracking
export function useViewportTracking() {
  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementsRef = useRef<Set<Element>>(new Set())

  const observe = useCallback((element: Element) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (observerEntries) => {
          setEntries(prev => {
            const newEntries = new Map(prev)
            observerEntries.forEach(entry => {
              newEntries.set(entry.target, entry)
            })
            return newEntries
          })
        },
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '0px'
        }
      )
    }

    if (!elementsRef.current.has(element)) {
      observerRef.current.observe(element)
      elementsRef.current.add(element)
    }
  }, [])

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current && elementsRef.current.has(element)) {
      observerRef.current.unobserve(element)
      elementsRef.current.delete(element)
      setEntries(prev => {
        const newEntries = new Map(prev)
        newEntries.delete(element)
        return newEntries
      })
    }
  }, [])

  const getVisibilityRatio = useCallback((element: Element): number => {
    const entry = entries.get(element)
    return entry?.intersectionRatio ?? 0
  }, [entries])

  const isVisible = useCallback((element: Element, threshold = 0): boolean => {
    return getVisibilityRatio(element) > threshold
  }, [getVisibilityRatio])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    observe,
    unobserve,
    getVisibilityRatio,
    isVisible,
    entries: Array.from(entries.values())
  }
}