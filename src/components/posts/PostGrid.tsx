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

  // Generate consistent random heights for each post
  const getPostHeight = (postId: string): number => {
    // Use post ID as seed for consistent height across re-renders
    const seed = postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = (seed * 9301 + 49297) % 233280 / 233280
    
    // Random height in 100px increments: 400px, 500px, or 600px
    const heights = [400, 500, 600]
    const index = Math.floor(random * heights.length)
    return heights[index]
  }

  // Create masonry layout with 5 columns
  const createMasonryLayout = () => {
    const columns = 5
    const columnPosts: Array<Array<{ post: Post; height: number }>> = Array.from({ length: columns }, () => [])
    const columnHeights = new Array(columns).fill(0)

    posts.forEach((post) => {
      const height = getPostHeight(post.id)
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      
      // Add post to shortest column
      columnPosts[shortestColumnIndex].push({ post, height })
      columnHeights[shortestColumnIndex] += height + 16 // height + gap
    })

    return columnPosts
  }

  const columnPosts = createMasonryLayout()

  return (
    <>
      {/* True Masonry Layout - 5 columns, no vertical gaps */}
      <div 
        className={cn(
          "flex gap-4",
          className
        )}
        data-testid="post-grid"
        ref={observerRef}
      >
        {columnPosts.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-4">
            {column.map(({ post, height }) => (
              <div
                key={post.id}
                className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{ 
                  height: `${height}px`
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
            ))}
          </div>
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