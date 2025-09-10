"use client"

import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationOptions {
  enabled?: boolean
  loop?: boolean
  orientation?: 'horizontal' | 'vertical' | 'grid'
  gridColumns?: number
}

export function useKeyboardNavigation(
  items: Element[],
  options: KeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    loop = true,
    orientation = 'vertical',
    gridColumns = 1
  } = options

  const currentIndexRef = useRef<number>(-1)
  const containerRef = useRef<HTMLElement | null>(null)

  const focusItem = useCallback((index: number) => {
    if (!enabled || index < 0 || index >= items.length) return

    const item = items[index] as HTMLElement
    if (item) {
      item.focus()
      currentIndexRef.current = index

      // Scroll into view if needed
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [items, enabled])

  const getNextIndex = useCallback((currentIndex: number, direction: 'up' | 'down' | 'left' | 'right'): number => {
    if (orientation === 'grid') {
      const row = Math.floor(currentIndex / gridColumns)
      const col = currentIndex % gridColumns
      const totalRows = Math.ceil(items.length / gridColumns)

      switch (direction) {
        case 'up':
          if (row > 0) {
            return Math.min((row - 1) * gridColumns + col, items.length - 1)
          }
          return loop ? Math.min((totalRows - 1) * gridColumns + col, items.length - 1) : currentIndex

        case 'down':
          if (row < totalRows - 1) {
            return Math.min((row + 1) * gridColumns + col, items.length - 1)
          }
          return loop ? col : currentIndex

        case 'left':
          if (col > 0) {
            return currentIndex - 1
          }
          return loop ? Math.min(row * gridColumns + gridColumns - 1, items.length - 1) : currentIndex

        case 'right':
          if (col < gridColumns - 1 && currentIndex + 1 < items.length) {
            return currentIndex + 1
          }
          return loop ? row * gridColumns : currentIndex

        default:
          return currentIndex
      }
    } else {
      // Linear navigation
      switch (direction) {
        case 'up':
        case 'left':
          if (currentIndex > 0) {
            return currentIndex - 1
          }
          return loop ? items.length - 1 : currentIndex

        case 'down':
        case 'right':
          if (currentIndex < items.length - 1) {
            return currentIndex + 1
          }
          return loop ? 0 : currentIndex

        default:
          return currentIndex
      }
    }
  }, [items.length, orientation, gridColumns, loop])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || items.length === 0) return

    let direction: 'up' | 'down' | 'left' | 'right' | null = null

    switch (event.key) {
      case 'ArrowUp':
        direction = 'up'
        break
      case 'ArrowDown':
        direction = 'down'
        break
      case 'ArrowLeft':
        direction = 'left'
        break
      case 'ArrowRight':
        direction = 'right'
        break
      case 'Home':
        event.preventDefault()
        focusItem(0)
        return
      case 'End':
        event.preventDefault()
        focusItem(items.length - 1)
        return
      case 'PageUp':
        event.preventDefault()
        const pageUpIndex = Math.max(0, currentIndexRef.current - 10)
        focusItem(pageUpIndex)
        return
      case 'PageDown':
        event.preventDefault()
        const pageDownIndex = Math.min(items.length - 1, currentIndexRef.current + 10)
        focusItem(pageDownIndex)
        return
      default:
        return
    }

    if (direction) {
      event.preventDefault()
      const currentIndex = currentIndexRef.current >= 0 ? currentIndexRef.current : 0
      const nextIndex = getNextIndex(currentIndex, direction)
      focusItem(nextIndex)
    }
  }, [enabled, items.length, focusItem, getNextIndex])

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  // Update current index when focus changes
  useEffect(() => {
    if (!enabled) return

    const handleFocusChange = () => {
      const activeElement = document.activeElement
      const index = items.findIndex(item => item === activeElement)
      if (index >= 0) {
        currentIndexRef.current = index
      }
    }

    document.addEventListener('focusin', handleFocusChange)
    return () => document.removeEventListener('focusin', handleFocusChange)
  }, [items, enabled])

  return {
    containerRef: (element: HTMLElement | null) => {
      containerRef.current = element
    },
    focusItem,
    currentIndex: currentIndexRef.current
  }
}

// Hook for roving tabindex pattern
export function useRovingTabIndex(items: Element[], options: KeyboardNavigationOptions = {}) {
  const { enabled = true } = options
  const activeIndexRef = useRef<number>(0)

  const updateTabIndexes = useCallback((activeIndex: number) => {
    if (!enabled) return

    items.forEach((item, index) => {
      const element = item as HTMLElement
      if (index === activeIndex) {
        element.setAttribute('tabindex', '0')
        activeIndexRef.current = index
      } else {
        element.setAttribute('tabindex', '-1')
      }
    })
  }, [items, enabled])

  const setActiveIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      updateTabIndexes(index)
    }
  }, [items.length, updateTabIndexes])

  // Initialize tab indexes
  useEffect(() => {
    if (enabled && items.length > 0) {
      updateTabIndexes(0)
    }
  }, [items, enabled, updateTabIndexes])

  const { containerRef, focusItem } = useKeyboardNavigation(items, {
    ...options,
    enabled
  })

  const handleFocus = useCallback((index: number) => {
    setActiveIndex(index)
    focusItem(index)
  }, [setActiveIndex, focusItem])

  return {
    containerRef,
    setActiveIndex,
    activeIndex: activeIndexRef.current,
    handleFocus
  }
}

// Hook for skip links
export function useSkipLinks() {
  const skipLinksRef = useRef<HTMLElement | null>(null)

  const addSkipLink = useCallback((targetId: string, label: string) => {
    if (!skipLinksRef.current) return

    const link = document.createElement('a')
    link.href = `#${targetId}`
    link.textContent = label
    link.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground px-4 py-2 z-50'
    
    skipLinksRef.current.appendChild(link)

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }
  }, [])

  return {
    skipLinksRef: (element: HTMLElement | null) => {
      skipLinksRef.current = element
    },
    addSkipLink
  }
}

// Hook for focus management
export function useFocusManagement() {
  const previousActiveElementRef = useRef<Element | null>(null)

  const saveFocus = useCallback(() => {
    previousActiveElementRef.current = document.activeElement
  }, [])

  const restoreFocus = useCallback(() => {
    const element = previousActiveElementRef.current as HTMLElement
    if (element && element.focus) {
      element.focus()
    }
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }

      if (event.key === 'Escape') {
        restoreFocus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [restoreFocus])

  return {
    saveFocus,
    restoreFocus,
    trapFocus
  }
}