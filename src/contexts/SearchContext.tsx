"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Post, SearchQuery, ContentCategory, SortOption } from '@/types'

interface SearchResult {
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
}

interface CachedResult {
  query: SearchQuery
  result: SearchResult
  timestamp: number
}

interface SearchState {
  query: SearchQuery
  result: SearchResult | null
  loading: boolean
  error: string | null
  cache: CachedResult[]
  history: string[]
  suggestions: string[]
}

interface SearchAction {
  type: 'SEARCH_START' | 'SEARCH_SUCCESS' | 'SEARCH_ERROR' | 'CLEAR_SEARCH' |
        'UPDATE_QUERY' | 'LOAD_MORE_START' | 'LOAD_MORE_SUCCESS' | 'LOAD_MORE_ERROR' |
        'CLEAR_CACHE' | 'ADD_TO_HISTORY' | 'CLEAR_HISTORY' | 'SET_SUGGESTIONS' |
        'RESTORE_FROM_CACHE'
  payload?: any
}

interface SearchContextType extends SearchState {
  search: (query: SearchQuery) => Promise<void>
  updateQuery: (updates: Partial<SearchQuery>) => void
  loadMore: () => Promise<void>
  clearSearch: () => void
  clearCache: () => void
  clearHistory: () => void
  quickSearch: (term: string) => Promise<void>
  getSuggestions: (term: string) => string[]
}

const initialQuery: SearchQuery = {
  query: '',
  category: undefined,
  tags: [],
  creator: '',
  aiTool: '',
  license: undefined,
  sortBy: 'relevance',
  page: 1,
  limit: 12
}

const initialState: SearchState = {
  query: initialQuery,
  result: null,
  loading: false,
  error: null,
  cache: [],
  history: [],
  suggestions: []
}

const CACHE_MAX_SIZE = 50
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const HISTORY_MAX_SIZE = 20
const SEARCH_STORAGE_KEY = 'plot_search_history'

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        loading: true,
        error: null,
        query: action.payload.query
      }

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        result: action.payload.result,
        cache: addToCache(state.cache, action.payload.query, action.payload.result)
      }

    case 'SEARCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case 'LOAD_MORE_START':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'LOAD_MORE_SUCCESS':
      const currentResult = state.result
      if (!currentResult) return state

      const updatedResult: SearchResult = {
        ...currentResult,
        posts: [...currentResult.posts, ...action.payload.posts],
        pagination: {
          ...action.payload.pagination,
          page: action.payload.pagination.page
        }
      }

      return {
        ...state,
        loading: false,
        result: updatedResult,
        query: { ...state.query, page: action.payload.pagination.page }
      }

    case 'LOAD_MORE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case 'UPDATE_QUERY':
      return {
        ...state,
        query: { ...state.query, ...action.payload.updates, page: 1 }
      }

    case 'CLEAR_SEARCH':
      return {
        ...state,
        query: initialQuery,
        result: null,
        error: null
      }

    case 'RESTORE_FROM_CACHE':
      return {
        ...state,
        query: action.payload.query,
        result: action.payload.result,
        loading: false,
        error: null
      }

    case 'CLEAR_CACHE':
      return {
        ...state,
        cache: []
      }

    case 'ADD_TO_HISTORY':
      const newHistory = [
        action.payload.term,
        ...state.history.filter(term => term !== action.payload.term)
      ].slice(0, HISTORY_MAX_SIZE)

      return {
        ...state,
        history: newHistory
      }

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: []
      }

    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload.suggestions
      }

    default:
      return state
  }
}

function addToCache(cache: CachedResult[], query: SearchQuery, result: SearchResult): CachedResult[] {
  const now = Date.now()
  
  // Remove expired entries
  const validCache = cache.filter(item => now - item.timestamp < CACHE_TTL)
  
  // Add new entry
  const newCache = [
    { query, result, timestamp: now },
    ...validCache
  ].slice(0, CACHE_MAX_SIZE)

  return newCache
}

function findInCache(cache: CachedResult[], query: SearchQuery): CachedResult | null {
  const now = Date.now()
  return cache.find(item => {
    if (now - item.timestamp > CACHE_TTL) return false
    return JSON.stringify(item.query) === JSON.stringify(query)
  }) || null
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [state, dispatch] = useReducer(searchReducer, initialState)

  // Restore search history on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SEARCH_STORAGE_KEY)
      if (storedHistory) {
        const history = JSON.parse(storedHistory)
        dispatch({ type: 'ADD_TO_HISTORY', payload: { term: '' } }) // Initialize with stored history
        history.forEach((term: string) => {
          dispatch({ type: 'ADD_TO_HISTORY', payload: { term } })
        })
      }
    } catch (error) {
      console.error('Error restoring search history:', error)
    }
  }, [])

  // Persist search history
  useEffect(() => {
    if (state.history.length > 0) {
      localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(state.history))
    }
  }, [state.history])

  const search = async (query: SearchQuery) => {
    // Check cache first
    const cached = findInCache(state.cache, query)
    if (cached) {
      dispatch({
        type: 'RESTORE_FROM_CACHE',
        payload: { query, result: cached.result }
      })
      return
    }

    dispatch({ type: 'SEARCH_START', payload: { query } })

    try {
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

      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const result = await response.json()

      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: { query, result }
      })

      // Add to history if it's a text query
      if (query.query && query.query.trim()) {
        dispatch({
          type: 'ADD_TO_HISTORY',
          payload: { term: query.query.trim() }
        })
      }
    } catch (error) {
      dispatch({
        type: 'SEARCH_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Search failed' }
      })
    }
  }

  const loadMore = async () => {
    if (!state.result || !state.result.pagination.hasMore || state.loading) {
      return
    }

    const nextQuery = { ...state.query, page: state.query.page + 1 }

    dispatch({ type: 'LOAD_MORE_START' })

    try {
      const params = new URLSearchParams()
      if (nextQuery.query) params.append('query', nextQuery.query)
      if (nextQuery.category) params.append('category', nextQuery.category)
      if (nextQuery.creator) params.append('creator', nextQuery.creator)
      if (nextQuery.aiTool) params.append('aiTool', nextQuery.aiTool)
      if (nextQuery.license) params.append('license', nextQuery.license)
      if (nextQuery.tags && nextQuery.tags.length > 0) {
        nextQuery.tags.forEach(tag => params.append('tags', tag))
      }
      params.append('sortBy', nextQuery.sortBy)
      params.append('page', nextQuery.page.toString())
      params.append('limit', nextQuery.limit.toString())

      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Load more failed')
      }

      const data = await response.json()

      dispatch({
        type: 'LOAD_MORE_SUCCESS',
        payload: { 
          posts: data.posts,
          pagination: data.pagination
        }
      })
    } catch (error) {
      dispatch({
        type: 'LOAD_MORE_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Load more failed' }
      })
    }
  }

  const updateQuery = (updates: Partial<SearchQuery>) => {
    dispatch({ type: 'UPDATE_QUERY', payload: { updates } })
  }

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' })
  }

  const clearCache = () => {
    dispatch({ type: 'CLEAR_CACHE' })
  }

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' })
    localStorage.removeItem(SEARCH_STORAGE_KEY)
  }

  const quickSearch = async (term: string) => {
    const query: SearchQuery = {
      ...initialQuery,
      query: term,
      sortBy: 'relevance'
    }
    await search(query)
  }

  const getSuggestions = (term: string): string[] => {
    if (!term.trim()) return state.history.slice(0, 5)
    
    const filtered = state.history.filter(historyTerm =>
      historyTerm.toLowerCase().includes(term.toLowerCase())
    )
    
    return filtered.slice(0, 5)
  }

  const value: SearchContextType = {
    ...state,
    search,
    updateQuery,
    loadMore,
    clearSearch,
    clearCache,
    clearHistory,
    quickSearch,
    getSuggestions
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export { SearchContext }