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
import { Download, Heart, Eye, ArrowDown, Users, Calendar, X } from 'lucide-react'
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
          "max-w-6xl max-h-[90vh] overflow-hidden p-0",
          className
        )}
        data-testid="post-modal"
      >
        {/* Backdrop for click-to-close */}
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          data-testid="modal-backdrop"
          onClick={onClose}
        />
        
        <div className="relative bg-background rounded-lg shadow-lg">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-50 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={onClose}
            data-testid="modal-close-btn"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-3/5 relative">
              <div className="relative aspect-[4/3] lg:aspect-[3/4] min-h-[400px] lg:min-h-[600px]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    fullImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  data-testid="modal-post-image"
                  priority
                  onLoad={() => setFullImageLoaded(true)}
                />
                
                {/* Loading placeholder */}
                {!fullImageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/5 flex flex-col">
              <div className="p-6 flex-1 overflow-y-auto">
                <DialogHeader className="space-y-4">
                  <DialogTitle 
                    className="text-2xl font-bold leading-tight"
                    data-testid="modal-post-title"
                  >
                    {post.title}
                  </DialogTitle>
                  
                  <p 
                    className="text-muted-foreground text-base leading-relaxed"
                    data-testid="modal-post-description"
                  >
                    {post.description}
                  </p>
                </DialogHeader>

                {/* Creator Profile */}
                <div 
                  className="flex items-center gap-4 py-6 border-y mt-6"
                  data-testid="modal-creator-profile"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.creator.profilePicture} alt={post.creator.name} />
                    <AvatarFallback>
                      {post.creator.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{post.creator.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {post.creator.stats?.subscriberCount?.toLocaleString() || 0} followers
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div 
                  className="grid grid-cols-3 gap-4 py-6"
                  data-testid="modal-post-stats"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{post.stats.views.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3" />
                      Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{post.stats.downloads.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Download className="h-3 w-3" />
                      Downloads
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{post.stats.favorites.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3" />
                      Favorites
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div 
                  className="space-y-3 py-6 border-t"
                  data-testid="modal-post-tags"
                >
                  <h5 className="font-semibold text-sm">Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Tool & Date */}
                <div 
                  className="space-y-3 py-6 border-t"
                  data-testid="modal-ai-tool"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created with</span>
                    <Badge variant="outline" className="font-medium">
                      {post.aiTool}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Published</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.uploadDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t p-6 flex gap-3">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1"
                  data-testid="modal-download-btn"
                >
                  {isDownloading ? (
                    <ArrowDown className="h-4 w-4 mr-2 animate-bounce" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
                
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  onClick={handleFavorite}
                  className="flex-1"
                  data-testid="modal-favorite-btn"
                >
                  <Heart className={cn("h-4 w-4 mr-2", isFavorited && "fill-current")} />
                  {isFavorited ? 'Favorited' : 'Favorite'}
                </Button>
              </div>

              {/* Similar Posts */}
              {similarPosts.length > 0 && (
                <div 
                  className="border-t p-6"
                  data-testid="similar-posts"
                >
                  <h5 className="font-semibold mb-4">Similar Posts</h5>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {similarPosts.slice(0, 4).map((similarPost) => (
                      <div key={similarPost.id} className="aspect-square">
                        <PostCard
                          post={similarPost}
                          onPostClick={() => {/* Handle similar post click */}}
                          showCreator={false}
                          showStats={false}
                          className="h-full text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}