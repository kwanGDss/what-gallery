"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { Post, ContentCategory, SortOption } from '@/types'

interface PostsFilter {
  category?: ContentCategory
  featured?: boolean
  creator?: string
  aiTool?: string
  tags?: string[]
  sortBy?: SortOption
}

interface PostsPagination {
  page: number
  limit: number
  hasMore: boolean
  totalCount: number
}

interface UsePostsState {
  posts: Post[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  pagination: PostsPagination
  filter: PostsFilter
}

interface UsePostsReturn extends UsePostsState {
  fetchPosts: (filter?: PostsFilter, reset?: boolean) => Promise<void>
  loadMore: () => Promise<void>
  setFilter: (filter: PostsFilter) => void
  clearFilter: () => void
  refresh: () => Promise<void>
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  removePost: (postId: string) => void
}

export function usePosts(initialFilter?: PostsFilter): UsePostsReturn {
  const [state, setState] = useState<UsePostsState>({
    posts: [],
    loading: false,
    loadingMore: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      hasMore: false,
      totalCount: 0
    },
    filter: initialFilter || {}
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const buildQueryParams = useCallback((filter: PostsFilter, page: number, limit: number) => {
    const params = new URLSearchParams()
    
    if (filter.category) params.append('category', filter.category)
    if (filter.creator) params.append('creator', filter.creator)
    if (filter.aiTool) params.append('aiTool', filter.aiTool)
    if (filter.featured !== undefined) params.append('featured', filter.featured.toString())
    if (filter.sortBy) params.append('sortBy', filter.sortBy)
    if (filter.tags && filter.tags.length > 0) {
      filter.tags.forEach(tag => params.append('tags', tag))
    }
    
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    
    return params
  }, [])

  const fetchPosts = useCallback(async (filter?: PostsFilter, reset = true) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    const currentFilter = filter || state.filter
    const page = reset ? 1 : state.pagination.page
    const isLoadingMore = !reset

    setState(prev => ({
      ...prev,
      loading: !isLoadingMore,
      loadingMore: isLoadingMore,
      error: null,
      filter: currentFilter
    }))

    try {
      const params = buildQueryParams(currentFilter, page, state.pagination.limit)
      
      // Use different endpoint for featured posts
      const endpoint = currentFilter.featured 
        ? `/api/posts/featured?${params}`
        : `/api/posts?${params}`

      const response = await fetch(endpoint, {
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        posts: reset ? data.posts : [...prev.posts, ...data.posts],
        loading: false,
        loadingMore: false,
        error: null,
        pagination: {
          ...data.pagination,
          page
        }
      }))
    } catch (error) {
      // Don't set error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      setState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: error instanceof Error ? error.message : 'Failed to fetch posts'
      }))
    }
  }, [state.filter, state.pagination.page, state.pagination.limit, buildQueryParams])

  const loadMore = useCallback(async () => {
    if (state.loadingMore || !state.pagination.hasMore) {
      return
    }

    const nextPage = state.pagination.page + 1
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page: nextPage }
    }))

    await fetchPosts(state.filter, false)
  }, [state.loadingMore, state.pagination.hasMore, state.pagination.page, state.filter, fetchPosts])

  const setFilter = useCallback((filter: PostsFilter) => {
    setState(prev => ({ ...prev, filter }))
    fetchPosts(filter, true)
  }, [fetchPosts])

  const clearFilter = useCallback(() => {
    const emptyFilter = {}
    setState(prev => ({ ...prev, filter: emptyFilter }))
    fetchPosts(emptyFilter, true)
  }, [fetchPosts])

  const refresh = useCallback(async () => {
    await fetchPosts(state.filter, true)
  }, [state.filter, fetchPosts])

  const addPost = useCallback((post: Post) => {
    setState(prev => ({
      ...prev,
      posts: [post, ...prev.posts],
      pagination: {
        ...prev.pagination,
        totalCount: prev.pagination.totalCount + 1
      }
    }))
  }, [])

  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    }))
  }, [])

  const removePost = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== postId),
      pagination: {
        ...prev.pagination,
        totalCount: Math.max(0, prev.pagination.totalCount - 1)
      }
    }))
  }, [])

  // Initial fetch
  useEffect(() => {
    if (Object.keys(state.filter).length > 0 || !initialFilter) {
      fetchPosts(state.filter, true)
    }
  }, []) // Empty dependency array for initial fetch only

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    ...state,
    fetchPosts,
    loadMore,
    setFilter,
    clearFilter,
    refresh,
    addPost,
    updatePost,
    removePost
  }
}