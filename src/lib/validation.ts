import { ContentCategory, SortOption, License } from '@/types'

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Password validation
export interface PasswordValidation {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Name validation
export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 1 && trimmed.length <= 50 && /^[a-zA-Z\s]+$/.test(trimmed)
}

// Post validation
export interface PostValidationErrors {
  title?: string
  description?: string
  imageUrl?: string
  category?: string
  tags?: string
  aiTool?: string
}

export function validatePost(data: {
  title?: string
  description?: string
  imageUrl?: string
  category?: string
  tags?: string[]
  aiTool?: string
}): { isValid: boolean; errors: PostValidationErrors } {
  const errors: PostValidationErrors = {}

  // Title validation
  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must not exceed 100 characters'
  }

  // Description validation
  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required'
  } else if (data.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters'
  }

  // Image URL validation
  if (!data.imageUrl || !data.imageUrl.trim()) {
    errors.imageUrl = 'Image URL is required'
  } else if (!isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Invalid image URL'
  } else if (!isImageUrl(data.imageUrl)) {
    errors.imageUrl = 'URL must point to a valid image (jpg, png, webp, gif)'
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required'
  } else if (!isValidCategory(data.category)) {
    errors.category = 'Invalid category'
  }

  // Tags validation
  if (data.tags && data.tags.length > 10) {
    errors.tags = 'Maximum 10 tags allowed'
  } else if (data.tags) {
    for (const tag of data.tags) {
      if (!tag.trim() || tag.trim().length > 30) {
        errors.tags = 'Each tag must be 1-30 characters'
        break
      }
    }
  }

  // AI Tool validation
  if (!data.aiTool || !data.aiTool.trim()) {
    errors.aiTool = 'AI tool is required'
  } else if (data.aiTool.trim().length > 50) {
    errors.aiTool = 'AI tool name must not exceed 50 characters'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Search validation
export interface SearchValidationErrors {
  query?: string
  tags?: string
  page?: string
  limit?: string
}

export function validateSearch(data: {
  query?: string
  tags?: string[]
  page?: number
  limit?: number
}): { isValid: boolean; errors: SearchValidationErrors } {
  const errors: SearchValidationErrors = {}

  // Query validation
  if (data.query && data.query.length > 100) {
    errors.query = 'Search query must not exceed 100 characters'
  }

  // Tags validation
  if (data.tags && data.tags.length > 5) {
    errors.tags = 'Maximum 5 tags allowed in search'
  }

  // Page validation
  if (data.page !== undefined && data.page < 1) {
    errors.page = 'Page must be at least 1'
  }

  // Limit validation
  if (data.limit !== undefined && (data.limit < 1 || data.limit > 48)) {
    errors.limit = 'Limit must be between 1 and 48'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Image URL validation
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']
  const lowercaseUrl = url.toLowerCase()
  
  return imageExtensions.some(ext => 
    lowercaseUrl.includes(ext) || 
    lowercaseUrl.match(new RegExp(`\\${ext}(\\?|$)`))
  )
}

// Category validation
export function isValidCategory(category: string): category is ContentCategory {
  return ['photos', 'illustrations', '3d'].includes(category)
}

// Sort option validation
export function isValidSortOption(sortBy: string): sortBy is SortOption {
  return ['newest', 'popular', 'downloads', 'views', 'relevance'].includes(sortBy)
}

// License validation
export function isValidLicenseType(license: string): license is License['type'] {
  return ['free', 'premium', 'commercial'].includes(license)
}

// Tag validation
export function validateTag(tag: string): boolean {
  const trimmed = tag.trim()
  return trimmed.length >= 1 && trimmed.length <= 30 && /^[a-zA-Z0-9\s-_]+$/.test(trimmed)
}

// Sanitization helpers
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

export function sanitizeTags(tags: string[]): string[] {
  return tags
    .map(tag => sanitizeString(tag))
    .filter(tag => tag.length > 0 && validateTag(tag))
    .slice(0, 10) // Ensure max 10 tags
}

export function sanitizeSearchQuery(query: string): string {
  return sanitizeString(query).substring(0, 100)
}

// Form validation helpers
export function getValidationClass(isValid: boolean, hasError: boolean): string {
  if (hasError) return 'border-destructive focus:border-destructive'
  if (isValid) return 'border-green-500 focus:border-green-500'
  return ''
}

export function formatValidationErrors(errors: Record<string, string>): string[] {
  return Object.values(errors).filter(Boolean)
}