import { Post, SearchQuery, ContentCategory, SortOption } from '@/types'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = 'An error occurred'
        let errorCode: string | undefined

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          errorCode = errorData.code
        } catch {
          errorMessage = response.statusText || errorMessage
        }

        throw new ApiError(errorMessage, response.status, errorCode)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return response.text() as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0)
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      )
    }
  }

  // Posts API
  async getPosts(params: {
    page?: number
    limit?: number
    category?: ContentCategory
    creator?: string
    aiTool?: string
    sortBy?: SortOption
    featured?: boolean
  } = {}) {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<{
      posts: Post[]
      pagination: {
        page: number
        limit: number
        total: number
        hasMore: boolean
      }
    }>(`/posts?${searchParams}`)
  }

  async getPost(id: string) {
    return this.request<{
      post: Post
      similarPosts: Post[]
    }>(`/posts/${id}`)
  }

  async getFeaturedPosts(limit: number = 6) {
    return this.request<{
      posts: Post[]
    }>(`/posts/featured?limit=${limit}`)
  }

  // Search API
  async search(query: SearchQuery) {
    const params = new URLSearchParams()
    
    if (query.query) params.append('query', query.query)
    if (query.category) params.append('category', query.category)
    if (query.creator) params.append('creator', query.creator)
    if (query.aiTool) params.append('aiTool', query.aiTool)
    if (query.license) params.append('license', query.license)
    if (query.tags && query.tags.length > 0) {
      query.tags.forEach(tag => params.append('tags', tag))
    }
    params.append('sortBy', query.sortBy)
    params.append('page', query.page.toString())
    params.append('limit', query.limit.toString())

    return this.request<{
      posts: Post[]
      totalCount: number
      facets: {
        categories: { category: ContentCategory; count: number }[]
        creators: { name: string; count: number }[]
        aiTools: { tool: string; count: number }[]
      }
      pagination: {
        page: number
        limit: number
        hasMore: boolean
      }
    }>(`/search?${params}`)
  }

  // Categories API
  async getCategories() {
    return this.request<{
      categories: {
        name: ContentCategory
        displayName: string
        description: string
        postCount: number
        featured: Post[]
      }[]
    }>('/categories')
  }

  // Auth API
  async signIn(email: string, password: string) {
    return this.request<{
      user: any
      token: string
      favorites?: string[]
      recentViews?: string[]
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signUp(name: string, email: string, password: string) {
    return this.request<{
      user: any
      token: string
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  }

  async googleAuth() {
    return this.request<{
      user: any
      token: string
      favorites?: string[]
      recentViews?: string[]
    }>('/auth/google', {
      method: 'POST',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Convenience functions
export const api = {
  // Posts
  posts: {
    list: (params?: Parameters<typeof apiClient.getPosts>[0]) => 
      apiClient.getPosts(params),
    get: (id: string) => apiClient.getPost(id),
    featured: (limit?: number) => apiClient.getFeaturedPosts(limit),
  },

  // Search
  search: (query: SearchQuery) => apiClient.search(query),

  // Categories
  categories: () => apiClient.getCategories(),

  // Auth
  auth: {
    signIn: (email: string, password: string) => 
      apiClient.signIn(email, password),
    signUp: (name: string, email: string, password: string) =>
      apiClient.signUp(name, email, password),
    google: () => apiClient.googleAuth(),
  },
}

// Error helpers
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

export function isNetworkError(error: unknown): boolean {
  return isApiError(error) && error.status === 0
}

export function isAuthError(error: unknown): boolean {
  return isApiError(error) && (error.status === 401 || error.status === 403)
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404
}

export function isValidationError(error: unknown): boolean {
  return isApiError(error) && error.status === 400
}