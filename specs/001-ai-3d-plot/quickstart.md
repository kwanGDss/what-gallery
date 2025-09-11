# Quickstart Guide: Plot AI Content Gallery

**Generated**: 2025-09-10  
**Status**: Complete

## Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git for version control
- VS Code (recommended) with TypeScript and Tailwind CSS extensions

### Quick Start Commands

```bash
# 1. Initialize Next.js 15 project
npx create-next-app@latest plot-gallery --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Navigate to project
cd plot-gallery

# 3. Install additional dependencies
npm install @radix-ui/react-dialog @radix-ui/react-tabs next-themes lucide-react class-variance-authority clsx tailwind-merge

# 4. Install development dependencies
npm install -D @types/node @playwright/test playwright

# 5. Install shadcn/ui CLI
npx shadcn-ui@latest init

# 6. Install shadcn components
npx shadcn-ui@latest add button card dialog input tabs avatar badge

# 7. Initialize Playwright
npx playwright install
```

### Project Structure Setup

```bash
# Create directory structure
mkdir -p src/{components,types,lib,data,hooks}
mkdir -p src/components/{ui,layout,posts,auth,search,user}
mkdir -p src/app/{auth,posts,search}
mkdir -p tests/{e2e,unit}
mkdir -p public/{images,icons}

# Create data directories
mkdir -p public/images/{posts,thumbnails,avatars}
mkdir -p src/data/{posts,users,categories}
```

## Core File Creation

### 1. TypeScript Types
Create `src/types/index.ts`:
```typescript
// Core data models from data-model.md
export type ContentCategory = 'photos' | 'illustrations' | '3d';
export type SortOption = 'newest' | 'popular' | 'downloads' | 'views' | 'relevance';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: ContentCategory;
  creator: User;
  aiTool: string;
  tags: string[];
  stats: PostStats;
  uploadDate: string;
  featured: boolean;
  license: License;
}

// ... (rest of interfaces from data-model.md)
```

### 2. Sample Data Files
Create sample data in `src/data/`:

```typescript
// src/data/posts.json
[
  {
    "id": "post_001",
    "title": "Cyberpunk City Night",
    "description": "Futuristic cityscape with neon lights and rain",
    "imageUrl": "/images/posts/cyberpunk-city-001.jpg",
    "thumbnailUrl": "/images/thumbnails/cyberpunk-city-001-thumb.jpg",
    "category": "illustrations",
    // ... rest of sample data
  }
  // ... 19 more sample posts
]
```

### 3. Theme Configuration
Update `tailwind.config.js`:
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... shadcn color variables
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

## Essential Component Creation

### 1. Theme Provider
Create `src/components/providers/theme-provider.tsx`:
```typescript
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### 2. Root Layout Update
Update `src/app/layout.tsx`:
```typescript
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 3. Home Page Structure
Create `src/app/page.tsx`:
```typescript
import { PostGrid } from '@/components/posts/PostGrid'
import { Navigation } from '@/components/layout/Navigation'
import { CategoryTabs } from '@/components/navigation/CategoryTabs'
import { SearchBar } from '@/components/search/SearchBar'

// Load sample data
import postsData from '@/data/posts.json'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={(query) => console.log(query)} />
        <CategoryTabs 
          categories={[
            { id: 'photos', name: 'Photos', icon: 'camera' },
            { id: 'illustrations', name: 'Illustrations', icon: 'palette' },
            { id: '3d', name: '3D', icon: 'box' }
          ]}
          onCategoryChange={(category) => console.log(category)}
        />
        <PostGrid posts={postsData} />
      </div>
    </main>
  )
}
```

## API Routes Setup

### 1. Posts API
Create `src/app/api/posts/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import postsData from '@/data/posts.json'
import { Post } from '@/types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  
  let filteredPosts = postsData as Post[]
  
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category)
  }
  
  const startIndex = (page - 1) * limit
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit)
  
  return NextResponse.json({
    posts: paginatedPosts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit),
      totalItems: filteredPosts.length,
      hasMore: startIndex + limit < filteredPosts.length
    }
  })
}
```

## Testing Setup

### 1. Playwright Configuration
Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 2. First E2E Test
Create `tests/e2e/homepage.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test('homepage loads and displays posts', async ({ page }) => {
  await page.goto('/')
  
  // Check navigation is present
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible()
  
  // Check Plot branding is visible
  await expect(page.locator('text=Plot')).toBeVisible()
  
  // Check category tabs are present
  await expect(page.locator('[data-testid="category-tabs"]')).toBeVisible()
  
  // Check search bar is present
  await expect(page.locator('[data-testid="search-bar"]')).toBeVisible()
  
  // Check posts are loaded
  await expect(page.locator('[data-testid="post-grid"]')).toBeVisible()
  await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12) // Initial load
})

test('post hover interactions work', async ({ page }) => {
  await page.goto('/')
  
  // Hover over first post
  const firstPost = page.locator('[data-testid="post-card"]').first()
  await firstPost.hover()
  
  // Check hover overlay appears
  await expect(firstPost.locator('[data-testid="post-overlay"]')).toBeVisible()
  
  // Check creator info is shown
  await expect(firstPost.locator('[data-testid="creator-info"]')).toBeVisible()
  
  // Check action buttons appear
  await expect(firstPost.locator('[data-testid="download-btn"]')).toBeVisible()
  await expect(firstPost.locator('[data-testid="favorite-btn"]')).toBeVisible()
})
```

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Run Tests
```bash
# Run Playwright tests
npm run test:e2e

# Run tests in headless mode
npm run test:e2e:headless

# Run specific test
npx playwright test homepage.spec.ts
```

### 3. Component Development Order
1. **UI Components**: Button, Card, Dialog (shadcn)
2. **Layout Components**: Navigation, PageLayout
3. **Core Components**: PostCard, PostGrid
4. **Feature Components**: SearchBar, CategoryTabs
5. **Auth Components**: AuthForm, AuthLayout
6. **Modal Components**: PostModal

### 4. Data Integration
1. Create sample data files (20 posts minimum)
2. Set up API routes for data access
3. Implement client-side data fetching
4. Add loading and error states
5. Implement search and filtering

## Validation Checklist

- [ ] Next.js 15 project initialized with TypeScript
- [ ] Tailwind CSS configured with dark mode
- [ ] shadcn/ui components installed and configured
- [ ] Theme provider set up
- [ ] Sample data created (20+ posts)
- [ ] API routes functional
- [ ] Basic components render without errors
- [ ] Playwright tests pass
- [ ] Homepage displays posts in grid
- [ ] Navigation and branding visible
- [ ] Category tabs functional
- [ ] Search bar present
- [ ] Hover interactions work
- [ ] Theme toggle functional
- [ ] Mobile responsive layout

## Next Steps

1. Implement all components from component-props contract
2. Add authentication simulation
3. Create remaining pages (auth, search)
4. Implement infinite scroll
5. Add post modal functionality
6. Complete E2E test coverage
7. Optimize images and performance
8. Add accessibility features
9. Deploy to production environment

## Troubleshooting

### Common Issues
- **Hydration Errors**: Use `suppressHydrationWarning` for theme provider
- **Import Errors**: Check TypeScript paths configuration
- **Tailwind Not Working**: Verify content paths in config
- **shadcn Components**: Ensure proper installation and imports
- **Playwright Issues**: Check baseURL and server startup

### Development Tips
- Use `data-testid` attributes for reliable test selectors
- Implement components incrementally with tests
- Use TypeScript strict mode for better type safety
- Follow atomic design principles for components
- Test on multiple browsers and screen sizes