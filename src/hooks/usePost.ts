"use client"

import { useState, useEffect, useCallback } from 'react'
import { Post } from '@/types'

interface UsePostState {
  post: Post | null
  similarPosts: Post[]
  loading: boolean
  error: string | null
}

interface UsePostReturn extends UsePostState {
  fetchPost: (id: string) => Promise<void>
  clearPost: () => void
  refreshPost: () => Promise<void>
}

export function usePost(initialId?: string): UsePostReturn {
  const [state, setState] = useState<UsePostState>({
    post: null,
    similarPosts: [],
    loading: false,
    error: null
  })

  const fetchPost = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`/api/posts/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found')
        }
        throw new Error('Failed to fetch post')
      }

      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        post: data.post,
        similarPosts: data.similarPosts || [],
        loading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post'
      }))
    }
  }, [])

  const clearPost = useCallback(() => {
    setState({
      post: null,
      similarPosts: [],
      loading: false,
      error: null
    })
  }, [])

  const refreshPost = useCallback(async () => {
    if (state.post?.id) {
      await fetchPost(state.post.id)
    }
  }, [state.post?.id, fetchPost])

  // Fetch initial post if provided
  useEffect(() => {
    if (initialId) {
      fetchPost(initialId)
    }
  }, [initialId, fetchPost])

  return {
    ...state,
    fetchPost,
    clearPost,
    refreshPost
  }
}