# Component Props Contract: Plot AI Content Gallery

**Generated**: 2025-09-10  
**Status**: Complete

## Core Component Interfaces

### PostCard Component
**Purpose**: Display post thumbnail with hover interactions
**File**: `@/components/posts/PostCard.tsx`

```typescript
interface PostCardProps {
  post: Post;
  onPostClick: (postId: string) => void;
  onFavorite?: (postId: string) => void;
  onDownload?: (postId: string) => void;
  showCreator?: boolean;          // Default: true
  showStats?: boolean;            // Default: true
  isLoading?: boolean;            // Loading state
  className?: string;             // Additional CSS classes
}
```

### PostModal Component
**Purpose**: Display full post details in modal overlay
**File**: `@/components/posts/PostModal.tsx`

```typescript
interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onFavorite?: (postId: string) => void;
  onDownload?: (postId: string) => void;
  similarPosts?: Post[];          // Related content
  className?: string;
}
```

### PostGrid Component
**Purpose**: Grid layout with infinite scroll for posts
**File**: `@/components/posts/PostGrid.tsx`

```typescript
interface PostGridProps {
  posts: Post[];
  onLoadMore?: () => void;
  loading?: boolean;
  hasMore?: boolean;
  columns?: number;               // Default: responsive
  gap?: number;                   // Default: 4 (Tailwind spacing)
  className?: string;
  emptyState?: React.ReactNode;   // Custom empty state
}
```

### SearchBar Component
**Purpose**: Search input with filters and suggestions
**File**: `@/components/search/SearchBar.tsx`

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  placeholder?: string;           // Default: "Search AI-generated content..."
  suggestions?: string[];         // Search suggestions
  filters?: SearchFilters;        // Current filters
  loading?: boolean;              // Search loading state
  className?: string;
}

interface SearchFilters {
  category?: ContentCategory;
  tags?: string[];
  aiTool?: string;
  creator?: string;
  sortBy?: SortOption;
}
```

### Navigation Component
**Purpose**: Top navigation bar with branding and user actions
**File**: `@/components/layout/Navigation.tsx`

```typescript
interface NavigationProps {
  currentCategory?: ContentCategory;
  onCategoryChange: (category: ContentCategory | null) => void;
  user?: User;                    // Current user (if authenticated)
  onAuthAction: (action: 'signin' | 'signup' | 'signout') => void;
  onMenuToggle?: () => void;      // Mobile menu toggle
  className?: string;
}
```

### CategoryTabs Component
**Purpose**: Category filter tabs (Photos, Illustrations, 3D)
**File**: `@/components/navigation/CategoryTabs.tsx`

```typescript
interface CategoryTabsProps {
  activeCategory?: ContentCategory;
  onCategoryChange: (category: ContentCategory | null) => void;
  categories: {
    id: ContentCategory;
    name: string;
    icon: string;
    count?: number;               // Post count per category
  }[];
  className?: string;
}
```

### UserProfile Component
**Purpose**: User profile display with stats
**File**: `@/components/user/UserProfile.tsx`

```typescript
interface UserProfileProps {
  user: User;
  showStats?: boolean;            // Default: true
  showBio?: boolean;              // Default: true
  showSocial?: boolean;           // Default: true
  size?: 'sm' | 'md' | 'lg';      // Default: 'md'
  onFollow?: (userId: string) => void;
  isFollowing?: boolean;
  className?: string;
}
```

### AuthForm Component
**Purpose**: Login/signup form with validation
**File**: `@/components/auth/AuthForm.tsx`

```typescript
interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onGoogleAuth?: () => Promise<void>;
  loading?: boolean;
  error?: string;
  onModeChange?: (mode: 'signin' | 'signup') => void;
  className?: string;
}

interface AuthFormData {
  email: string;
  password: string;
  name?: string;                  // Only for signup
  rememberMe?: boolean;           // Only for signin
}
```

### HamburgerMenu Component
**Purpose**: Mobile menu with footer content and settings
**File**: `@/components/layout/HamburgerMenu.tsx`

```typescript
interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark' | 'system';
  menuItems: MenuItem[];
  className?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  divider?: boolean;              // Add divider after item
}
```

### ThemeToggle Component
**Purpose**: Dark/light mode toggle switch
**File**: `@/components/ui/ThemeToggle.tsx`

```typescript
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';      // Default: 'md'
  variant?: 'icon' | 'switch' | 'select'; // Default: 'icon'
  showLabel?: boolean;            // Default: false
  className?: string;
}
```

### LoadingSpinner Component
**Purpose**: Loading indicator with different variants
**File**: `@/components/ui/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';      // Default: 'md'
  variant?: 'spin' | 'dots' | 'pulse'; // Default: 'spin'
  color?: 'primary' | 'secondary' | 'accent'; // Default: 'primary'
  className?: string;
  text?: string;                  // Optional loading text
}
```

## Layout Components

### PageLayout Component
**Purpose**: Main page wrapper with navigation and footer
**File**: `@/components/layout/PageLayout.tsx`

```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;                 // Page title for SEO
  description?: string;           // Page description for SEO
  showNavigation?: boolean;       // Default: true
  showFooter?: boolean;           // Default: true
  className?: string;
}
```

### AuthLayout Component
**Purpose**: Split layout for auth pages (3/10 form, 7/10 image)
**File**: `@/components/layout/AuthLayout.tsx`

```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;       // Right side background image
  title?: string;                 // Form area title
  subtitle?: string;              // Form area subtitle
  showBranding?: boolean;         // Default: true
  className?: string;
}
```

## Utility Components

### ErrorBoundary Component
**Purpose**: React error boundary with fallback UI
**File**: `@/components/ui/ErrorBoundary.tsx`

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

### InfiniteScroll Component
**Purpose**: Infinite scroll wrapper with intersection observer
**File**: `@/components/ui/InfiniteScroll.tsx`

```typescript
interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;             // Default: 100px from bottom
  className?: string;
}
```

### ImageWithFallback Component
**Purpose**: Image component with loading states and fallbacks
**File**: `@/components/ui/ImageWithFallback.tsx`

```typescript
interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;          // Fallback image URL
  placeholder?: 'blur' | 'empty'; // Loading placeholder
  blurDataURL?: string;          // Base64 blur placeholder
  width?: number;
  height?: number;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
```

## Component Composition Patterns

### Page Components
Each page combines multiple components:

```typescript
// HomePage composition
interface HomePageProps {
  featuredPosts: Post[];
  categories: ContentCategory[];
  initialPosts: Post[];
}

// CategoryPage composition  
interface CategoryPageProps {
  category: ContentCategory;
  posts: Post[];
  filters: SearchFilters;
}

// AuthPage composition
interface AuthPageProps {
  mode: 'signin' | 'signup';
  redirectUrl?: string;
}
```

## Prop Validation Notes

1. **Required Props**: All required props clearly marked in interfaces
2. **Default Values**: Documented in prop comments where applicable
3. **Event Handlers**: Consistent naming (on[Action]) with optional chaining
4. **Styling**: className prop on all components for customization
5. **Loading States**: loading boolean prop where applicable
6. **Error Handling**: error prop for form components
7. **Accessibility**: All interactive components support keyboard navigation
8. **TypeScript**: Strict typing with no `any` types allowed