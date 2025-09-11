"use client"

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { User, UserSession } from '@/types'

interface AuthState {
  user: User | null
  authenticated: boolean
  favorites: string[]
  recentViews: string[]
  loading: boolean
  error: string | null
  sessionExpiry: string | null
}

interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_ERROR' | 'LOGOUT' | 
        'ADD_FAVORITE' | 'REMOVE_FAVORITE' | 'ADD_RECENT_VIEW' | 
        'RESTORE_SESSION' | 'SESSION_EXPIRED' | 'CLEAR_ERROR'
  payload?: string | User | { postId: string } | { error: string } | {
    user: User;
    authenticated?: boolean;
    favorites?: string[];
    recentViews?: string[];
    sessionExpiry?: string;
  } | undefined
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  googleAuth: () => Promise<void>
  logout: () => void
  addFavorite: (postId: string) => void
  removeFavorite: (postId: string) => void
  addRecentView: (postId: string) => void
  clearError: () => void
  isFavorite: (postId: string) => boolean
}

const initialState: AuthState = {
  user: null,
  authenticated: false,
  favorites: [],
  recentViews: [],
  loading: false,
  error: null,
  sessionExpiry: null
}

const AUTH_STORAGE_KEY = 'plot_auth_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: (action.payload as { user: User; favorites?: string[]; recentViews?: string[]; sessionExpiry?: string }).user,
        authenticated: true,
        favorites: (action.payload as { user: User; favorites?: string[]; recentViews?: string[]; sessionExpiry?: string }).favorites || [],
        recentViews: (action.payload as { user: User; favorites?: string[]; recentViews?: string[]; sessionExpiry?: string }).recentViews || [],
        sessionExpiry: (action.payload as { user: User; favorites?: string[]; recentViews?: string[]; sessionExpiry?: string }).sessionExpiry || null,
        loading: false,
        error: null
      }

    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        error: (action.payload as { error: string })?.error || 'Login failed',
        authenticated: false,
        user: null
      }

    case 'LOGOUT':
      return {
        ...initialState
      }

    case 'ADD_FAVORITE':
      if (state.favorites.includes((action.payload as { postId: string }).postId)) {
        return state
      }
      return {
        ...state,
        favorites: [...state.favorites, (action.payload as { postId: string }).postId]
      }

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== (action.payload as { postId: string }).postId)
      }

    case 'ADD_RECENT_VIEW':
      const recentViews = [
        (action.payload as { postId: string }).postId,
        ...state.recentViews.filter(id => id !== (action.payload as { postId: string }).postId)
      ].slice(0, 10) // Keep only last 10 views
      
      return {
        ...state,
        recentViews
      }

    case 'RESTORE_SESSION':
      return {
        ...state,
        ...(action.payload as { user: User; authenticated?: boolean; favorites?: string[]; recentViews?: string[]; sessionExpiry?: string }),
        loading: false
      }

    case 'SESSION_EXPIRED':
      return {
        ...initialState,
        error: 'Session expired. Please log in again.'
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore session on mount
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedSession = localStorage.getItem(AUTH_STORAGE_KEY)
        if (!storedSession) return

        const session: UserSession = JSON.parse(storedSession)
        
        // Check if session is expired
        if (session.sessionExpiry && new Date(session.sessionExpiry) < new Date()) {
          localStorage.removeItem(AUTH_STORAGE_KEY)
          dispatch({ type: 'SESSION_EXPIRED' })
          return
        }

        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            user: session.user,
            authenticated: session.authenticated,
            favorites: session.favorites,
            recentViews: session.recentViews,
            sessionExpiry: session.sessionExpiry
          }
        })
      } catch (error) {
        console.error('Error restoring session:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    restoreSession()
  }, [])

  // Persist session changes
  useEffect(() => {
    if (state.authenticated && state.user) {
      const session: UserSession = {
        user: state.user,
        authenticated: state.authenticated,
        favorites: state.favorites,
        recentViews: state.recentViews,
        preferences: state.user.preferences,
        sessionExpiry: state.sessionExpiry || undefined
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [state.authenticated, state.user, state.favorites, state.recentViews, state.sessionExpiry])

  // Check session expiry periodically
  useEffect(() => {
    if (!state.authenticated || !state.sessionExpiry) return

    const checkExpiry = () => {
      if (new Date(state.sessionExpiry!) < new Date()) {
        dispatch({ type: 'SESSION_EXPIRED' })
      }
    }

    const interval = setInterval(checkExpiry, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [state.authenticated, state.sessionExpiry])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      const sessionExpiry = new Date(Date.now() + SESSION_DURATION).toISOString()

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          favorites: data.favorites || [],
          recentViews: data.recentViews || [],
          sessionExpiry
        }
      })
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Login failed' }
      })
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Account creation failed')
      }

      const data = await response.json()
      const sessionExpiry = new Date(Date.now() + SESSION_DURATION).toISOString()

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          favorites: [],
          recentViews: [],
          sessionExpiry
        }
      })
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Account creation failed' }
      })
      throw error
    }
  }

  const googleAuth = async () => {
    dispatch({ type: 'LOGIN_START' })

    try {
      // Simulate Google OAuth flow
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Google authentication failed')
      }

      const data = await response.json()
      const sessionExpiry = new Date(Date.now() + SESSION_DURATION).toISOString()

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          favorites: data.favorites || [],
          recentViews: data.recentViews || [],
          sessionExpiry
        }
      })
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Google authentication failed' }
      })
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const addFavorite = (postId: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: { postId } })
  }

  const removeFavorite = (postId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: { postId } })
  }

  const addRecentView = (postId: string) => {
    dispatch({ type: 'ADD_RECENT_VIEW', payload: { postId } })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const isFavorite = (postId: string) => {
    return state.favorites.includes(postId)
  }

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    googleAuth,
    logout,
    addFavorite,
    removeFavorite,
    addRecentView,
    clearError,
    isFavorite
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }