"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Post } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PostCard } from './PostCard'
import { Download, Heart, ArrowDown, Users, Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onFavorite?: (postId: string) => void
  onDownload?: (postId: string) => void
  similarPosts?: Post[]
  className?: string
}

export function PostModal({
  post,
  isOpen,
  onClose,
  onFavorite,
  onDownload,
  similarPosts = [],
  className
}: PostModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [fullImageLoaded, setFullImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFullImageLoaded(false)
    }
  }, [isOpen, post.id])

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    onFavorite?.(post.id)
  }

  const handleDownload = async () => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-[95vw] w-full max-h-[95vh] h-full overflow-hidden p-0 bg-background",
          className
        )}
        data-testid="post-modal"
        showCloseButton={false}
      >
        {/* Full Screen Layout */}
        <div className="relative w-full h-full bg-background">
          {/* Close Button - Top Right */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-50 h-10 w-10 p-0 bg-background/90 hover:bg-background/100 rounded-full shadow-lg border"
            onClick={onClose}
            data-testid="modal-close-btn"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex flex-col h-full">
            {/* Main Content Area - Full Width */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Large Image - Takes 60% of width */}
              <div className="w-[60%] relative bg-gray-50 dark:bg-gray-900">
                <div className="relative w-full h-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className={cn(
                      "object-contain transition-opacity duration-300",
                      fullImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    data-testid="modal-post-image"
                    priority
                    onLoad={() => setFullImageLoaded(true)}
                  />
                  
                  {/* Loading placeholder */}
                  {!fullImageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                      <div className="text-muted-foreground">Loading image...</div>
                    </div>
                  )}

                  {/* Creator Info Overlay - Top Left */}
                  <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.creator.profilePicture} alt={post.creator.name} />
                        <AvatarFallback>
                          {post.creator.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{post.creator.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {post.creator.stats?.subscriberCount?.toLocaleString() || 0} followers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Bottom Left */}
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    <Button
                      onClick={handleFavorite}
                      variant={isFavorited ? "default" : "secondary"}
                      size="lg"
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg px-6"
                    >
                      <Heart className={cn("h-5 w-5 mr-2", isFavorited && "fill-current")} />
                      {isFavorited ? 'Favorited' : 'Favorite'}
                    </Button>

                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-6"
                    >
                      {isDownloading ? (
                        <ArrowDown className="h-5 w-5 mr-2 animate-bounce" />
                      ) : (
                        <Download className="h-5 w-5 mr-2" />
                      )}
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Side Info - Takes 40% of width */}
              <div className="w-[40%] bg-background/95 backdrop-blur-sm border-l flex flex-col">
                {/* Title and Tools */}
                <div className="p-6 border-b space-y-4">
                  <DialogTitle 
                    className="text-3xl font-bold leading-tight"
                    data-testid="modal-post-title"
                  >
                    {post.title}
                  </DialogTitle>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Tools
                    </Button>
                    <Button variant="outline" size="sm">
                      Reframe
                    </Button>
                    <Button variant="outline" size="sm">
                      Restyle
                    </Button>
                  </div>
                </div>

                {/* Compact Info */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Stats - Horizontal Layout */}
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="text-2xl font-bold">{post.stats.views.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{post.stats.downloads.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{post.stats.favorites.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                  </div>

                  {/* Tags - Compact */}
                  <div>
                    <h5 className="font-semibold text-base mb-3">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 4 && (
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          +{post.tags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* AI Tool & Date - Compact */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-muted-foreground">AI Tool</span>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {post.aiTool}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-muted-foreground">Published</span>
                      <span className="text-base">
                        {formatDate(post.uploadDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Similar Images - Full Width, Horizontal Scroll */}
            {similarPosts.length > 0 && (
              <div className="border-t bg-background/95 backdrop-blur-sm">
                <div className="p-6">
                  <h5 className="font-semibold mb-4">Similar images</h5>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {similarPosts.map((similarPost) => (
                      <div 
                        key={similarPost.id} 
                        className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group"
                        onClick={() => {/* Handle similar post click */}}
                      >
                        <Image
                          src={similarPost.imageUrl}
                          alt={similarPost.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}