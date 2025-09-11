"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

interface VirtualizationOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
  enabled?: boolean
}

interface VirtualItem {
  index: number
  start: number
  end: number
}

export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 5, enabled = true } = options
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLElement | null>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!enabled || items.length === 0) {
      return { start: 0, end: items.length - 1 }
    }

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(items.length - 1, start + visibleCount + overscan * 2)

    return { start, end }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length, enabled])

  // Create virtual items
  const virtualItems = useMemo((): VirtualItem[] => {
    if (!enabled) {
      return items.map((_, index) => ({
        index,
        start: index * itemHeight,
        end: (index + 1) * itemHeight
      }))
    }

    const result: VirtualItem[] = []
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight
      })
    }
    return result
  }, [visibleRange, itemHeight, items.length, enabled])

  // Total height of all items
  const totalHeight = items.length * itemHeight

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement
    setScrollTop(target.scrollTop)
  }, [])

  // Set up scroll listener
  useEffect(() => {
    const element = scrollElementRef.current
    if (!element || !enabled) return

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, [handleScroll, enabled])

  // Scroll to item
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current || !enabled) return

    let scrollTop: number
    switch (align) {
      case 'start':
        scrollTop = index * itemHeight
        break
      case 'center':
        scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2
        break
      case 'end':
        scrollTop = index * itemHeight - containerHeight + itemHeight
        break
    }

    scrollElementRef.current.scrollTo({
      top: Math.max(0, Math.min(scrollTop, totalHeight - containerHeight)),
      behavior: 'smooth'
    })
  }, [itemHeight, containerHeight, totalHeight, enabled])

  return {
    virtualItems,
    totalHeight,
    scrollElementRef,
    scrollToItem,
    visibleRange
  }
}