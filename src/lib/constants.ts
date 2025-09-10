import { ContentCategory, SortOption } from '@/types'

// API Configuration
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  POST_DETAIL: (id: string) => `/api/posts/${id}`,
  FEATURED_POSTS: '/api/posts/featured',
  SEARCH: '/api/search',
  CATEGORIES: '/api/categories',
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    GOOGLE: '/api/auth/google'
  }
} as const

// App Configuration
export const APP_CONFIG = {
  NAME: 'Plot',
  DESCRIPTION: 'AI Content Gallery Platform',
  URL: 'https://plot.gallery',
  VERSION: '1.0.0',
  AUTHOR: 'Plot Team',
  KEYWORDS: ['AI', 'art', 'gallery', 'creative', 'images']
} as const

// UI Constants
export const UI_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
  INFINITE_SCROLL_THRESHOLD: 100, // pixels from bottom
  DEBOUNCE_DELAY: 300, // milliseconds
  ANIMATION_DURATION: 200, // milliseconds
  TOAST_DURATION: 5000, // milliseconds
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const

// Content Categories
export const CATEGORIES: Record<ContentCategory, {
  name: ContentCategory
  displayName: string
  description: string
  icon: string
}> = {
  photos: {
    name: 'photos',
    displayName: 'Photos',
    description: 'AI-generated photography and realistic images',
    icon: '📸'
  },
  illustrations: {
    name: 'illustrations',
    displayName: 'Illustrations',
    description: 'Digital art, drawings, and artistic illustrations',
    icon: '🎨'
  },
  '3d': {
    name: '3d',
    displayName: '3D Renders',
    description: '3D models, renders, and architectural visualizations',
    icon: '🎭'
  }
} as const

// Sort Options
export const SORT_OPTIONS: Record<SortOption, {
  value: SortOption
  label: string
  description: string
}> = {
  relevance: {
    value: 'relevance',
    label: 'Relevance',
    description: 'Most relevant to your search'
  },
  newest: {
    value: 'newest',
    label: 'Newest',
    description: 'Recently uploaded content'
  },
  popular: {
    value: 'popular',
    label: 'Popular',
    description: 'Most liked and favorited'
  },
  downloads: {
    value: 'downloads',
    label: 'Downloads',
    description: 'Most downloaded content'
  },
  views: {
    value: 'views',
    label: 'Views',
    description: 'Most viewed content'
  }
} as const

// License Types
export const LICENSE_TYPES = {
  FREE: {
    type: 'free' as const,
    name: 'Free',
    description: 'Free to use with attribution',
    color: 'green',
    features: ['Personal use', 'Attribution required', 'No commercial use']
  },
  PREMIUM: {
    type: 'premium' as const,
    name: 'Premium',
    description: 'Premium license for extended use',
    color: 'blue',
    features: ['Commercial use', 'No attribution required', 'Extended license']
  },
  COMMERCIAL: {
    type: 'commercial' as const,
    name: 'Commercial',
    description: 'Full commercial license',
    color: 'purple',
    features: ['Full commercial rights', 'Resale allowed', 'Unlimited usage']
  }
} as const

// AI Tools
export const AI_TOOLS = {
  MIDJOURNEY: {
    name: 'Midjourney',
    description: 'AI image generation platform',
    website: 'https://midjourney.com',
    color: '#3b82f6'
  },
  DALLE: {
    name: 'DALL-E',
    description: 'OpenAI\'s image generation model',
    website: 'https://openai.com/dall-e-3',
    color: '#10b981'
  },
  STABLE_DIFFUSION: {
    name: 'Stable Diffusion',
    description: 'Open-source diffusion model',
    website: 'https://stability.ai',
    color: '#f59e0b'
  },
  LEONARDO: {
    name: 'Leonardo AI',
    description: 'Creative AI platform',
    website: 'https://leonardo.ai',
    color: '#8b5cf6'
  },
  FIREFLY: {
    name: 'Adobe Firefly',
    description: 'Adobe\'s generative AI',
    website: 'https://firefly.adobe.com',
    color: '#ef4444'
  }
} as const

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  MAX_TAGS: 5,
  MAX_HISTORY_ITEMS: 20,
  SUGGESTIONS_LIMIT: 5,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  CACHE_MAX_SIZE: 50
} as const

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  TAG_MIN_LENGTH: 1,
  TAG_MAX_LENGTH: 30,
  MAX_TAGS_PER_POST: 10,
  AI_TOOL_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 200
} as const

// File Upload Constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  THUMBNAIL_SIZE: 400,
  MAX_IMAGE_DIMENSION: 4096
} as const

// Grid Layout Constants
export const GRID_CONFIG = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4,
    EXTRA_LARGE: 5,
    ULTRA_WIDE: 6
  },
  GAP: 16, // pixels
  ASPECT_RATIOS: {
    PORTRAIT: { ratio: 'portrait', height: '400px' },
    SQUARE: { ratio: 'square', height: '320px' },
    LANDSCAPE: { ratio: 'landscape', height: '240px' },
    TALL: { ratio: 'tall', height: '480px' },
    WIDE: { ratio: 'wide', height: '200px' },
    MEDIUM: { ratio: 'medium', height: '360px' }
  }
} as const

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'system' as const,
  THEMES: ['light', 'dark', 'system'] as const,
  STORAGE_KEY: 'plot_theme'
} as const

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_SESSION: 'plot_auth_session',
  SEARCH_HISTORY: 'plot_search_history',
  USER_PREFERENCES: 'plot_user_preferences',
  RECENT_VIEWS: 'plot_recent_views',
  FAVORITES: 'plot_favorites',
  THEME: 'plot_theme'
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  
  // Auth specific
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  
  // Upload specific
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Please upload a valid image file.',
  UPLOAD_FAILED: 'File upload failed. Please try again.'
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  POST_UPLOADED: 'Post uploaded successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully!',
  FAVORITE_ADDED: 'Added to favorites!',
  FAVORITE_REMOVED: 'Removed from favorites!',
  DOWNLOAD_STARTED: 'Download started!',
  SETTINGS_SAVED: 'Settings saved successfully!'
} as const

// API Response Codes
export const API_CODES = {
  SUCCESS: 'SUCCESS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR'
} as const

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  WEBSITE: { name: 'Website', icon: '🌐', color: '#6b7280' },
  TWITTER: { name: 'Twitter', icon: '🐦', color: '#1da1f2' },
  INSTAGRAM: { name: 'Instagram', icon: '📷', color: '#e4405f' },
  ARTSTATION: { name: 'ArtStation', icon: '🎨', color: '#13aff0' },
  BEHANCE: { name: 'Behance', icon: '🎭', color: '#1769ff' },
  DRIBBBLE: { name: 'Dribbble', icon: '🏀', color: '#ea4c89' }
} as const

// Feature Flags
export const FEATURES = {
  ENABLE_AUTH: true,
  ENABLE_SEARCH: true,
  ENABLE_FAVORITES: true,
  ENABLE_DOWNLOADS: true,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_USER_PROFILES: true,
  ENABLE_COMMENTS: false, // Future feature
  ENABLE_UPLOADS: false, // Future feature
  ENABLE_COLLECTIONS: false, // Future feature
  ENABLE_ANALYTICS: true
} as const

// Default Values
export const DEFAULTS = {
  POSTS_PER_PAGE: 12,
  FEATURED_POSTS_COUNT: 6,
  SIMILAR_POSTS_COUNT: 6,
  MAX_RECENT_VIEWS: 10,
  SEARCH_DEBOUNCE_MS: 300,
  ANIMATION_DURATION_MS: 200,
  TOAST_DURATION_MS: 5000
} as const