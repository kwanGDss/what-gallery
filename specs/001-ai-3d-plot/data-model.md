# Data Model: Plot AI Content Gallery Platform

**Generated**: 2025-09-10  
**Status**: Complete

## Core Entities

### Post
Represents AI-generated content items displayed in the gallery.

```typescript
interface Post {
  id: string;                    // Unique identifier
  title: string;                 // Post title
  description: string;           // Post description
  imageUrl: string;             // URL to the image file
  thumbnailUrl: string;         // URL to optimized thumbnail
  category: ContentCategory;     // Content type classification
  creator: User;                // Creator information
  aiTool: string;               // AI tool used (e.g., "Midjourney", "DALL-E")
  tags: string[];               // Content tags for search/filtering
  stats: PostStats;             // View/download statistics
  uploadDate: string;           // ISO date string
  featured: boolean;            // Whether post is featured
  license: License;             // Usage rights information
}

type ContentCategory = 'photos' | 'illustrations' | '3d';

interface PostStats {
  views: number;                // View count
  downloads: number;            // Download count
  favorites: number;            // Favorite/bookmark count
}

interface License {
  type: 'free' | 'premium' | 'commercial';
  attribution: boolean;         // Whether attribution required
  commercial: boolean;          // Commercial use allowed
  modifications: boolean;       // Modifications allowed
}
```

### User
Represents platform users (creators and viewers).

```typescript
interface User {
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

interface UserStats {
  subscriberCount: number;      // Follower count
  postCount: number;            // Number of posts created
  totalViews: number;           // Total views across all posts
  totalDownloads: number;       // Total downloads across all posts
}

interface SocialLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  artstation?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  favoriteCategories: ContentCategory[];
}
```

### Tag
Represents content tags for search and categorization.

```typescript
interface Tag {
  id: string;                   // Unique identifier
  name: string;                 // Tag name (e.g., "cyberpunk", "portrait")
  category?: ContentCategory;   // Associated category (optional)
  popularity: number;           // Usage frequency score
  color?: string;               // Display color (hex)
  description?: string;         // Tag description
}
```

### SearchQuery
Represents user search queries and filters.

```typescript
interface SearchQuery {
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

type SortOption = 'newest' | 'popular' | 'downloads' | 'views' | 'relevance';
```

### UserSession
Represents authenticated user sessions.

```typescript
interface UserSession {
  user: User;                   // User information
  authenticated: boolean;       // Authentication status
  favorites: string[];          // Favorited post IDs
  recentViews: string[];        // Recently viewed post IDs
  preferences: UserPreferences; // User settings
  sessionExpiry?: string;       // Session expiration (ISO date)
}
```

## Data Relationships

### Entity Relationships
- **Post** belongs to one **User** (creator)
- **Post** has many **Tags** (many-to-many)
- **User** has many **Posts** (one-to-many)
- **UserSession** contains one **User**
- **SearchQuery** can reference **Tags**, **ContentCategory**, **User**

### State Transitions

#### Post States
1. **Draft** → **Published** (when uploaded and approved)
2. **Published** → **Featured** (when marked as featured)
3. **Published** → **Archived** (when removed from active display)

#### User Session States
1. **Anonymous** → **Authenticated** (successful login)
2. **Authenticated** → **Anonymous** (logout)
3. **Authenticated** → **Expired** (session timeout)

## Validation Rules

### Post Validation
- `title`: Required, 1-100 characters
- `description`: Required, 1-500 characters
- `imageUrl`: Required, valid URL, supported formats (jpg, png, webp)
- `category`: Required, must be valid ContentCategory
- `tags`: Maximum 10 tags, each 1-30 characters
- `aiTool`: Required, 1-50 characters

### User Validation
- `name`: Required, 1-50 characters, alphanumeric + spaces
- `email`: Valid email format (when provided)
- `bio`: Maximum 200 characters
- `profilePicture`: Valid URL, image format

### Search Validation
- `query`: Maximum 100 characters
- `tags`: Maximum 5 tags in filter
- `page`: Minimum 1
- `limit`: 12-48 items (standard grid layouts)

## Static Data Structure

### Sample Data Location
```
/data/
├── posts.json          # Sample posts (20 items)
├── users.json          # Sample users/creators
├── tags.json           # Available tags
└── categories.json     # Category definitions
```

### Sample Post Data Pattern
```json
{
  "id": "post_001",
  "title": "Cyberpunk City Night",
  "description": "Futuristic cityscape with neon lights and rain",
  "imageUrl": "/images/posts/cyberpunk-city-001.jpg",
  "thumbnailUrl": "/images/thumbnails/cyberpunk-city-001-thumb.jpg",
  "category": "illustrations",
  "creator": {
    "id": "user_001",
    "name": "AI_Artist_Pro",
    "profilePicture": "/images/avatars/ai-artist-pro.jpg"
  },
  "aiTool": "Midjourney",
  "tags": ["cyberpunk", "cityscape", "neon", "futuristic"],
  "stats": {
    "views": 1234,
    "downloads": 89,
    "favorites": 156
  },
  "uploadDate": "2025-09-08T10:00:00Z",
  "featured": true,
  "license": {
    "type": "free",
    "attribution": true,
    "commercial": false,
    "modifications": true
  }
}
```

## Implementation Notes

1. **Type Safety**: All interfaces exported from `@/types/index.ts`
2. **Data Loading**: Static JSON files loaded via Next.js API routes
3. **Caching**: Static data cached in memory for performance
4. **Search**: Client-side filtering and search implementation
5. **Pagination**: Virtual pagination for infinite scroll
6. **Images**: Optimized with Next.js Image component
7. **State Management**: React Context for global state, local for component state