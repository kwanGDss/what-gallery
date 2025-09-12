"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Post } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Download, Heart, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  onPostClick: (postId: string) => void
  onFavorite?: (postId: string) => void
  onDownload?: (postId: string) => void
  showCreator?: boolean
  showStats?: boolean
  isLoading?: boolean
  className?: string
}

export function PostCard({
  post,
  onPostClick,
  onFavorite,
  onDownload,
  showCreator = true,
  showStats = true,
  isLoading = false,
  className
}: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onFavorite?.(post.id)
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDownloading) return
    
    setIsDownloading(true)
    try {
      onDownload?.(post.id)
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCardClick = () => {
    onPostClick(post.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 h-full",
        "hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/10",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "p-0", // Remove all padding from card
        isLoading && "animate-pulse",
        className
      )}
      data-testid="post-card"
      data-category={post.category}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={post.thumbnailUrl || post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Hover Overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity duration-200"
            data-testid="post-overlay"
          >
            {/* Creator Info - Bottom Left */}
            <div 
              className="absolute bottom-3 left-3 flex items-center gap-2"
              data-testid="creator-info"
            >
              <Avatar className="w-8 h-8 border-2 border-white/80">
                <AvatarImage src={post.creator.profilePicture} alt={post.creator.name} />
                <AvatarFallback className="text-xs">
                  {post.creator.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-white text-sm font-medium drop-shadow-md">
                {post.creator.name}
              </span>
            </div>

            {/* Action Buttons - Bottom Right */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-900 shadow-md"
                onClick={handleDownload}
                disabled={isDownloading}
                data-testid="download-btn"
                title="Download"
              >
                {isDownloading ? (
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 shadow-md transition-colors",
                  isFavorited 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-white/90 hover:bg-white text-gray-900"
                )}
                onClick={handleFavorite}
                data-testid="favorite-btn"
                data-favorited={isFavorited}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}