"use client"

import { useEffect, useState } from 'react'
import { Post } from '@/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { PostGrid } from '@/components/posts/PostGrid'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Client-side mounting check
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load initial posts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch('/api/posts?page=1&limit=10')

        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data) // Debug log
          console.log('Posts received:', data.posts?.length) // Debug log
          setPosts(data.posts)
          setHasMore(data.pagination.hasMore)
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
      const response = await fetch(`/api/posts?page=${nextPage}&limit=10`)
      
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

  // Prevent hydration mismatch by waiting for client mount
  if (!mounted) {
    return (
      <PageLayout>
        <div className="w-full px-2 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="w-full px-2 py-6 animate-in fade-in duration-700">
        {/* Unified Gallery */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI Art Gallery
            </h1>
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