// Core data models for Plot AI Content Gallery Platform

export type ContentCategory = 'photos' | 'illustrations' | '3d';
export type SortOption = 'newest' | 'popular' | 'downloads' | 'views' | 'relevance';

export interface PostStats {
  views: number;                // View count
  downloads: number;            // Download count
  favorites: number;            // Favorite/bookmark count
}

export interface License {
  type: 'free' | 'premium' | 'commercial';
  attribution: boolean;         // Whether attribution required
  commercial: boolean;          // Commercial use allowed
  modifications: boolean;       // Modifications allowed
}

export interface User {
  id: string;                   // Unique identifier
  name: string;                 // Display name
  email?: string;               // Email (for authenticated users)
  profilePicture: string;       // Profile image URL
  bio?: string;                 // User bio/description
  stats: UserStats;             // User statistics
  social?: SocialLinks;         // Social media links
  verified: boolean;            // Verified creator status
  joinDate: string;             // ISO date string
  preferences: UserPreferences; // User settings
}

export interface UserStats {
  subscriberCount: number;      // Follower count
  postCount: number;            // Number of posts created
  totalViews: number;           // Total views across all posts
  totalDownloads: number;       // Total downloads across all posts
}

export interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  artstation?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  favoriteCategories: ContentCategory[];
}

export interface Post {
  id: string;                   // Unique identifier
  title: string;                // Post title
  description: string;          // Post description
  imageUrl: string;             // URL to the image file
  thumbnailUrl: string;         // URL to optimized thumbnail
  category: ContentCategory;    // Content type classification
  creator: User;                // Creator information
  aiTool: string;               // AI tool used (e.g., "Midjourney", "DALL-E")
  tags: string[];               // Content tags for search/filtering
  stats: PostStats;             // View/download statistics
  uploadDate: string;           // ISO date string
  featured: boolean;            // Whether post is featured
  license: License;             // Usage rights information
}

export interface Tag {
  id: string;                   // Unique identifier
  name: string;                 // Tag name (e.g., "cyberpunk", "portrait")
  category?: ContentCategory;   // Associated category (optional)
  popularity: number;           // Usage frequency score
  color?: string;               // Display color (hex)
  description?: string;         // Tag description
}

export interface SearchQuery {
  query?: string;               // Text search query
  category?: ContentCategory;   // Filter by category
  tags?: string[];              // Filter by tags
  creator?: string;             // Filter by creator
  aiTool?: string;              // Filter by AI tool
  license?: License['type'];    // Filter by license type
  sortBy: SortOption;           // Sort criteria
  page: number;                 // Pagination
  limit: number;                // Items per page
}

export interface UserSession {
  user: User;                   // User information
  authenticated: boolean;       // Authentication status
  favorites: string[];          // Favorited post IDs
  recentViews: string[];        // Recently viewed post IDs
  preferences: UserPreferences; // User settings
  sessionExpiry?: string;       // Session expiration (ISO date)
}

// API Response Types
export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
  filters: {
    appliedFilters: Partial<SearchQuery>;
    availableFilters: {
      categories: ContentCategory[];
      tags: string[];
      aiTools: string[];
      creators: string[];
    };
  };
}

export interface PostDetailResponse {
  post: Post;
  similarPosts: Post[];         // 6 similar posts
  creator: User;                // Full creator details
}

export interface SearchResponse {
  results: Post[];
  query: string;
  suggestions?: string[];       // Search suggestions
  totalResults: number;
  facets: {
    categories: { category: ContentCategory; count: number }[];
    tags: { tag: string; count: number }[];
    aiTools: { tool: string; count: number }[];
  };
}

export interface UserProfileResponse {
  user: User;
  posts: Post[];               // User's posts
  stats: UserStats;            // Updated statistics
}

export interface CategoriesResponse {
  categories: {
    id: ContentCategory;
    name: string;
    description: string;
    icon: string;              // Icon name/path
    postCount: number;
    featured: Post[];          // 3 featured posts per category
  }[];
}

export interface TagsResponse {
  tags: Tag[];
  trending: Tag[];             // Top 10 trending tags
}

// Authentication Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;               // Simulated JWT
  expiresAt: string;           // ISO date string
}

export interface GoogleAuthRequest {
  idToken: string;             // Google ID token (simulated)
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}

// Component Props Types
export interface SearchFilters {
  category?: ContentCategory;
  tags?: string[];
  aiTool?: string;
  creator?: string;
  sortBy?: SortOption;
}

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  divider?: boolean;           // Add divider after item
}

// Error Response Format
export interface ErrorResponse {
  error: {
    code: string;              // Error code (e.g., 'INVALID_QUERY')
    message: string;           // Human-readable message
    details?: any;             // Additional error details
  };
  timestamp: string;           // ISO date string
  path: string;                // Request path
}