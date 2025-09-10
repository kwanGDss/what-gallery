"use client"

import { useEffect, useState } from 'react'
import { Post } from '@/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { PostGrid } from '@/components/posts/PostGrid'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Load initial posts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load posts and featured posts
        const [postsResponse, featuredResponse] = await Promise.all([
          fetch('/api/posts?page=1&limit=12'),
          fetch('/api/posts/featured?limit=6')
        ])

        if (postsResponse.ok && featuredResponse.ok) {
          const postsData = await postsResponse.json()
          const featuredData = await featuredResponse.json()
          
          setPosts(postsData.posts)
          setFeaturedPosts(featuredData.posts)
          setHasMore(postsData.pagination.hasMore)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleLoadMore = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/posts?page=${nextPage}&limit=12`)
      
      if (response.ok) {
        const data = await response.json()
        setPosts(prev => [...prev, ...data.posts])
        setHasMore(data.pagination.hasMore)
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Discover AI Art" description="Explore amazing AI-generated photos, illustrations, and 3D renders from creators worldwide">
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-700">
        {/* Hero Section with Featured Posts - 더 큰 다이나믹 레이아웃 */}
        {featuredPosts.length > 0 && (
          <section className="mb-16" data-testid="featured-posts">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ✨ Featured Creations
              </h2>
              <div className="hidden md:block text-sm text-muted-foreground">
                Curated AI masterpieces
              </div>
            </div>
            <PostGrid 
              posts={featuredPosts} 
              className="mb-8"
            />
          </section>
        )}

        {/* All Posts Grid - 다이나믹 무한 스크롤 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">🎨 Explore Gallery</h2>
            <div className="text-sm text-muted-foreground">
              {posts.length} artworks and counting...
            </div>
          </div>
          <PostGrid
            posts={posts}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </section>
      </div>
    </PageLayout>
  )
}