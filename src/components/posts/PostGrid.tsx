"use client"

import { useEffect, useRef, useState } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'
import { PostModal } from './PostModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

interface PostGridProps {
  posts: Post[]
  onLoadMore?: () => void
  loading?: boolean
  hasMore?: boolean
  columns?: number
  gap?: number
  className?: string
  emptyState?: React.ReactNode
}

export function PostGrid({
  posts,
  onLoadMore,
  loading = false,
  hasMore = false,
  columns,
  gap = 4,
  className,
  emptyState
}: PostGridProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<Post[]>([])
  const observerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && !loading && onLoadMore) {
          onLoadMore()
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    const currentLoadingRef = loadingRef.current
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef)
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef)
      }
    }
  }, [hasMore, loading, onLoadMore])

  const handlePostClick = async (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    setSelectedPost(post)
    
    // Fetch similar posts (in real app, this would be an API call)
    const similar = posts
      .filter(p => p.id !== postId && p.category === post.category)
      .slice(0, 6)
    setSimilarPosts(similar)
    
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
    setSimilarPosts([])
  }

  const handleFavorite = (postId: string) => {
    // In real app, this would make an API call
    console.log('Favoriting post:', postId)
  }

  const handleDownload = (postId: string) => {
    // In real app, this would trigger download
    console.log('Downloading post:', postId)
    
    // Show download success indicator
    const event = new CustomEvent('download-success', { detail: { postId } })
    window.dispatchEvent(event)
  }

  // Responsive grid classes based on screen size
  const getGridClasses = () => {
    if (columns) {
      return `grid-cols-${Math.min(columns, 6)}`
    }
    
    return [
      'grid-cols-1',      // Mobile: 1 column
      'sm:grid-cols-2',   // Small: 2 columns  
      'md:grid-cols-3',   // Medium: 3 columns
      'lg:grid-cols-4',   // Large: 4 columns
      'xl:grid-cols-5',   // XL: 5 columns
      '2xl:grid-cols-6'   // 2XL: 6 columns
    ].join(' ')
  }

  const getGapClass = () => {
    const gapMap: Record<number, string> = {
      1: 'gap-1',
      2: 'gap-2', 
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6'
    }
    return gapMap[gap] || 'gap-4'
  }

  // Show empty state if no posts and not loading
  if (posts.length === 0 && !loading) {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center py-12", className)}
        data-testid="post-grid"
      >
        {emptyState || (
          <div className="text-center space-y-4">
            <div className="text-4xl">🎨</div>
            <h3 className="text-xl font-semibold">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse different categories
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div 
        className={cn(
          "grid",
          getGridClasses(),
          getGapClass(),
          className
        )}
        data-testid="post-grid"
        ref={observerRef}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostClick={handlePostClick}
            onFavorite={handleFavorite}
            onDownload={handleDownload}
            showCreator={true}
            showStats={true}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {(loading || hasMore) && (
        <div 
          ref={loadingRef}
          className="flex justify-center items-center py-8"
          data-testid={loading ? "posts-loading" : "loading-more"}
        >
          {loading ? (
            <LoadingSpinner 
              size="md" 
              text="Loading posts..."
            />
          ) : hasMore ? (
            <div className="text-muted-foreground text-sm">
              Scroll for more posts...
            </div>
          ) : null}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onFavorite={handleFavorite}
          onDownload={handleDownload}
          similarPosts={similarPosts}
        />
      )}
    </>
  )
}