"use client"

import { useState } from 'react'
import { User, Post } from '@/types'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/posts/PostCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { UserIcon, MapPin, Calendar, Link as LinkIcon, Heart, Download, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserProfileProps {
  user: User
  posts: Post[]
  isOwner?: boolean
  isFollowing?: boolean
  onFollow?: (userId: string) => void
  onUnfollow?: (userId: string) => void
  onPostClick?: (postId: string) => void
  onEditProfile?: () => void
  loading?: boolean
  className?: string
}

interface UserStats {
  posts: number
  followers: number
  following: number
  likes: number
  downloads: number
  views: number
}

export function UserProfile({
  user,
  posts,
  isOwner = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onPostClick,
  onEditProfile,
  loading = false,
  className
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'collections'>('posts')

  // Calculate user stats from posts
  const stats: UserStats = {
    posts: posts.length,
    followers: 1250,
    following: 180,
    likes: posts.reduce((sum, post) => sum + post.stats.favorites, 0),
    downloads: posts.reduce((sum, post) => sum + post.stats.downloads, 0),
    views: posts.reduce((sum, post) => sum + post.stats.views, 0)
  }

  const handleFollowClick = () => {
    if (isFollowing) {
      onUnfollow?.(user.id)
    } else {
      onFollow?.(user.id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)} data-testid="user-profile">
      {/* Profile Header */}
      <div className="bg-background border-b pb-6">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-full flex items-center justify-center">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold" data-testid="user-name">
                    {user.name}
                  </h1>
                  {user.verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{user.bio}</p>
                
                {/* User Details */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.social?.website && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                  {user.social?.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <a 
                        href={user.social.website} 
                        className="hover:text-foreground transition-colors"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {user.social.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwner ? (
                  <Button onClick={onEditProfile} data-testid="edit-profile-button">
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollowClick}
                    data-testid="follow-button"
                    data-following={isFollowing}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="font-bold text-lg" data-testid="posts-count">{stats.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Heart className="w-4 h-4" />
                {stats.likes}
              </div>
              <div className="text-sm text-muted-foreground">Likes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Download className="w-4 h-4" />
                {stats.downloads}
              </div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                <Eye className="w-4 h-4" />
                {stats.views}
              </div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {(['posts', 'liked', 'collections'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                data-testid={`tab-${tab}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'posts' && (
                  <span className="ml-2 text-xs bg-muted rounded-full px-2 py-1">
                    {stats.posts}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'posts' && (
          <div data-testid="posts-tab-content">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostClick={onPostClick || (() => {})}
                    showCreator={false}
                    showStats={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No posts yet</p>
                {isOwner && (
                  <Button className="mt-4">Upload Your First Post</Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12" data-testid="liked-tab-content">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Liked posts will appear here</p>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="text-center py-12" data-testid="collections-tab-content">
            <div className="w-12 h-12 bg-muted rounded-md mx-auto mb-4 flex items-center justify-center">
              <span className="text-muted-foreground">📁</span>
            </div>
            <p className="text-muted-foreground">Collections will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}