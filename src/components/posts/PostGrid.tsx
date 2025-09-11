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


  // Show empty state if no posts and not loading
  if (posts.length === 0 && !loading) {
    return (
      <div 
        className={cn("flex flex-col items-center justify-center py-12", className)}
        data-testid="post-grid"
      >
        {emptyState || (
          <div className="text-center space-y-4">
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
      {/* 일반 그리드 레이아웃 - 왼쪽에서 오른쪽으로, 상단에서 하단으로 */}
      <div 
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5",
          "gap-4",
          className
        )}
        data-testid="post-grid"
        ref={observerRef}
      >
        {posts.map((post, index) => {
          return (
            <div
              key={post.id}
              className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{ 
                aspectRatio: '3/4' // 일관된 세로형 비율
              }}
            >
              <PostCard
                post={post}
                onPostClick={handlePostClick}
                onFavorite={handleFavorite}
                onDownload={handleDownload}
                showCreator={false}
                showStats={false}
                className="h-full w-full"
              />
            </div>
          )
        })}
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