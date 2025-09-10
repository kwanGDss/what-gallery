# API Routes Contract: Plot AI Content Gallery

**Generated**: 2025-09-10  
**Status**: Complete - Static Implementation

## Overview
Initial implementation uses Next.js API routes serving static JSON data. No external database required.

## Core API Endpoints

### GET /api/posts
**Purpose**: Retrieve posts with filtering and pagination
**Method**: GET
**Query Parameters**:
```typescript
interface PostsQuery {
  category?: 'photos' | 'illustrations' | '3d';
  page?: number;        // Default: 1
  limit?: number;       // Default: 12, Max: 48
  search?: string;      // Search in title/description
  tags?: string;        // Comma-separated tags
  creator?: string;     // Creator ID
  aiTool?: string;      // AI tool filter
  sortBy?: 'newest' | 'popular' | 'downloads' | 'views';
}
```

**Response**:
```typescript
interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
  filters: {
    appliedFilters: PostsQuery;
    availableFilters: {
      categories: ContentCategory[];
      tags: string[];
      aiTools: string[];
      creators: string[];
    };
  };
}
```

**Status Codes**:
- 200: Success
- 400: Invalid query parameters
- 500: Server error

### GET /api/posts/[id]
**Purpose**: Retrieve single post with full details
**Method**: GET
**Parameters**: 
- `id`: Post ID (string)

**Response**:
```typescript
interface PostDetailResponse {
  post: Post;
  similarPosts: Post[]; // 6 similar posts
  creator: User;        // Full creator details
}
```

**Status Codes**:
- 200: Success
- 404: Post not found
- 500: Server error

### GET /api/posts/featured
**Purpose**: Retrieve featured posts for homepage hero
**Method**: GET
**Query Parameters**: 
- `limit?: number` (Default: 6)

**Response**:
```typescript
interface FeaturedResponse {
  posts: Post[];
}
```

### GET /api/search
**Purpose**: Search posts with advanced filtering
**Method**: GET
**Query Parameters**:
```typescript
interface SearchQuery {
  q: string;            // Search query
  category?: ContentCategory;
  tags?: string;        // Comma-separated
  page?: number;
  limit?: number;
}
```

**Response**:
```typescript
interface SearchResponse {
  results: Post[];
  query: string;
  suggestions?: string[]; // Search suggestions
  totalResults: number;
  facets: {
    categories: { category: ContentCategory; count: number }[];
    tags: { tag: string; count: number }[];
    aiTools: { tool: string; count: number }[];
  };
}
```

### GET /api/users/[id]
**Purpose**: Retrieve user profile with posts
**Method**: GET
**Parameters**: 
- `id`: User ID (string)

**Response**:
```typescript
interface UserProfileResponse {
  user: User;
  posts: Post[];       // User's posts
  stats: UserStats;    // Updated statistics
}
```

### GET /api/categories
**Purpose**: Retrieve all content categories with metadata
**Method**: GET

**Response**:
```typescript
interface CategoriesResponse {
  categories: {
    id: ContentCategory;
    name: string;
    description: string;
    icon: string;        // Icon name/path
    postCount: number;
    featured: Post[];    // 3 featured posts per category
  }[];
}
```

### GET /api/tags
**Purpose**: Retrieve popular tags
**Method**: GET
**Query Parameters**:
- `limit?: number` (Default: 50)
- `category?: ContentCategory`

**Response**:
```typescript
interface TagsResponse {
  tags: Tag[];
  trending: Tag[];     // Top 10 trending tags
}
```

## Authentication Endpoints (Simulated)

### POST /api/auth/signin
**Purpose**: Simulate user sign-in
**Method**: POST
**Body**:
```typescript
interface SignInRequest {
  email: string;
  password: string;
}
```

**Response**:
```typescript
interface AuthResponse {
  user: User;
  token: string;       // Simulated JWT
  expiresAt: string;   // ISO date string
}
```

### POST /api/auth/signup
**Purpose**: Simulate user registration
**Method**: POST
**Body**:
```typescript
interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}
```

**Response**: Same as SignInResponse

### POST /api/auth/google
**Purpose**: Simulate Google OAuth signin
**Method**: POST
**Body**:
```typescript
interface GoogleAuthRequest {
  idToken: string;     // Google ID token (simulated)
}
```

**Response**: Same as AuthResponse

### POST /api/auth/signout
**Purpose**: Sign out user
**Method**: POST
**Headers**: `Authorization: Bearer {token}`

**Response**:
```typescript
interface SignOutResponse {
  success: boolean;
  message: string;
}
```

## User Action Endpoints (Future)

### POST /api/posts/[id]/favorite
**Purpose**: Add/remove post from favorites
**Method**: POST
**Headers**: `Authorization: Bearer {token}`
**Body**:
```typescript
interface FavoriteRequest {
  action: 'add' | 'remove';
}
```

### POST /api/posts/[id]/download
**Purpose**: Track download and provide download URL
**Method**: POST
**Headers**: `Authorization: Bearer {token}` (optional)

**Response**:
```typescript
interface DownloadResponse {
  downloadUrl: string;
  tracked: boolean;    // Whether download was tracked
}
```

## Error Response Format

All endpoints return errors in consistent format:
```typescript
interface ErrorResponse {
  error: {
    code: string;        // Error code (e.g., 'INVALID_QUERY')
    message: string;     // Human-readable message
    details?: any;       // Additional error details
  };
  timestamp: string;     // ISO date string
  path: string;          // Request path
}
```

## Implementation Notes

1. **Static Data**: All endpoints serve from static JSON files initially
2. **Caching**: Implement in-memory caching for better performance
3. **Validation**: Use Zod for request/response validation
4. **Rate Limiting**: Future implementation for production
5. **CORS**: Configure for development and production domains
6. **Logging**: Structured logging for all requests
7. **Testing**: Each endpoint requires contract tests before implementation