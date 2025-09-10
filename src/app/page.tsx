"use client"

import { useEffect, useState } from 'react'
import { Post } from '@/types'
import { Navigation } from '@/components/layout/Navigation'
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
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12" data-testid="featured-posts">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <div key={post.id} className="aspect-[4/3] relative">
                  <div data-testid="post-card" data-category={post.category}>
                    {/* Simplified featured post display */}
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">{post.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">All Posts</h2>
          <PostGrid
            posts={posts}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </section>
      </div>
    </main>
  )
}