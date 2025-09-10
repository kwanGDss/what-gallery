"use client"

import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

// Lazy load the PostGrid component
const PostGrid = lazy(() => import('./PostGrid').then(module => ({ default: module.PostGrid })))

// Lazy load the PostModal component
const PostModal = lazy(() => import('./PostModal').then(module => ({ default: module.PostModal })))

interface LazyPostGridProps {
  posts: any[]
  onLoadMore?: () => void
  loading?: boolean
  hasMore?: boolean
  columns?: number
  gap?: number
  className?: string
  emptyState?: React.ReactNode
}

export function LazyPostGrid(props: LazyPostGridProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("flex justify-center items-center py-12", props.className)}>
          <LoadingSpinner size="lg" text="Loading gallery..." />
        </div>
      }
    >
      <PostGrid {...props} />
    </Suspense>
  )
}

// Also export a lazy post modal
interface LazyPostModalProps {
  post: any
  isOpen: boolean
  onClose: () => void
  onFavorite?: (postId: string) => void
  onDownload?: (postId: string) => void
  similarPosts?: any[]
}

export function LazyPostModal(props: LazyPostModalProps) {
  if (!props.isOpen) return null

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingSpinner size="lg" text="Loading post details..." />
        </div>
      }
    >
      <PostModal {...props} />
    </Suspense>
  )
}