"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { PostGrid } from '@/components/posts/PostGrid'
import { SearchBar } from '@/components/search/SearchBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Post, SearchFilters } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [filters, setFilters] = useState<SearchFilters>({})

  const query = searchParams?.get('q') || ''
  const category = searchParams?.get('category') || undefined

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      setError(undefined)

      try {
        const params = new URLSearchParams()
        if (query) params.append('q', query)
        if (category) params.append('category', category)
        if (filters.aiTool) params.append('aiTool', filters.aiTool)

        const response = await fetch(`/api/search?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, category, filters])

  const handleSearch = (newQuery: string) => {
    const url = new URL(window.location.href)
    if (newQuery) {
      url.searchParams.set('q', newQuery)
    } else {
      url.searchParams.delete('q')
    }
    window.history.pushState({}, '', url.toString())
  }

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handlePostClick = (postId: string) => {
    console.log('Open post modal:', postId)
    // In a real app, this would open the post modal or navigate to post page
  }

  if (error) {
    return (
      <PageLayout title="Search Error" showCategoryTabs={false}>
        <div className="w-full px-2 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Search Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title={query ? `Search results for "${query}"` : 'Search'}
      description={`Discover AI-generated content ${query ? `matching "${query}"` : 'on Plot'}`}
      showCategoryTabs={false}
    >
      <div className="w-full px-2 py-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {query ? (
              <>
                Search results for <span className="text-primary">&quot;{query}&quot;</span>
              </>
            ) : (
              'Search AI Content'
            )}
          </h1>
          
          <div className="max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              placeholder="Search for AI-generated photos, illustrations, and 3D renders..."
              filters={filters}
              loading={loading}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Searching..." />
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {posts.length === 0 
                  ? 'No results found' 
                  : `${posts.length} result${posts.length !== 1 ? 's' : ''} found`
                }
                {query && ` for "${query}"`}
              </p>
            </div>

            {/* Results Grid */}
            {posts.length > 0 ? (
              <PostGrid
                posts={posts}
                onPostClick={handlePostClick}
                loading={loading}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">?</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search query or filters
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Check your spelling</p>
                  <p>• Try more general keywords</p>
                  <p>• Use different filters</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}