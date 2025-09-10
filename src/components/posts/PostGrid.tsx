"use client"

import { useEffect, useRef, useState } from 'react'
import { Post } from '@/types'
import { PostCard } from './PostCard'
import { PostModal } from './PostModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

// Lummi.ai 스타일 랜덤 비율 생성
const getRandomAspectRatio = () => {
  const ratios = [
    { ratio: 'portrait', height: '400px' },      // 세로형
    { ratio: 'square', height: '320px' },        // 정사각형
    { ratio: 'landscape', height: '240px' },     // 가로형
    { ratio: 'tall', height: '480px' },          // 긴 세로형
    { ratio: 'wide', height: '200px' },          // 긴 가로형
    { ratio: 'medium', height: '360px' },        // 중간 크기
  ]
  return ratios[Math.floor(Math.random() * ratios.length)]
}

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

  // 각 포스트에 랜덤 비율 적용
  const [postAspects, setPostAspects] = useState<Map<string, { ratio: string; height: string }>>(new Map())
  
  useEffect(() => {
    const newAspects = new Map()
    posts.forEach(post => {
      if (!postAspects.has(post.id)) {
        newAspects.set(post.id, getRandomAspectRatio())
      } else {
        newAspects.set(post.id, postAspects.get(post.id))
      }
    })
    setPostAspects(newAspects)
  }, [posts])

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
      {/* Lummi.ai 스타일 CSS Columns Masonry 레이아웃 */}
      <div 
        className={cn(
          "columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6",
          "gap-4 space-y-4",
          className
        )}
        style={{
          columnGap: '16px',
          columnFill: 'balance'
        }}
        data-testid="post-grid"
        ref={observerRef}
      >
        {posts.map((post) => {
          const aspect = postAspects.get(post.id) || { ratio: 'medium', height: '320px' }
          
          return (
            <div
              key={post.id}
              className="break-inside-avoid mb-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              style={{ 
                height: aspect.height,
                display: 'inline-block',
                width: '100%'
              }}
            >
              <PostCard
                post={post}
                onPostClick={handlePostClick}
                onFavorite={handleFavorite}
                onDownload={handleDownload}
                showCreator={true}
                showStats={true}
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