/**
 * @jest-environment node
 */

import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'

// Mock the data imports
jest.mock('@/data/posts.json', () => [
  {
    id: 'post_001',
    title: 'Cyberpunk City Night',
    description: 'Futuristic cityscape with neon lights and rain',
    imageUrl: '/test-image-1.jpg',
    thumbnailUrl: '/test-thumb-1.jpg',
    category: 'illustrations',
    creator: {
      id: 'creator_001',
      name: 'Digital Artist',
      profilePicture: '/test-avatar.jpg'
    },
    aiTool: 'Midjourney',
    tags: ['cyberpunk', 'city', 'neon', 'futuristic'],
    stats: { views: 1234, downloads: 89, favorites: 156 },
    uploadDate: '2024-01-01T00:00:00Z',
    featured: true,
    license: { type: 'free', attribution: true, commercial: false, modifications: true }
  },
  {
    id: 'post_002',
    title: 'Mountain Landscape',
    description: 'Beautiful mountain scenery at sunset',
    imageUrl: '/test-image-2.jpg',
    thumbnailUrl: '/test-thumb-2.jpg',
    category: 'photos',
    creator: {
      id: 'creator_002',
      name: 'Nature Photographer',
      profilePicture: '/test-avatar-2.jpg'
    },
    aiTool: 'DALL-E',
    tags: ['landscape', 'mountain', 'sunset', 'nature'],
    stats: { views: 2345, downloads: 123, favorites: 89 },
    uploadDate: '2024-01-02T00:00:00Z',
    featured: false,
    license: { type: 'premium', attribution: false, commercial: true, modifications: true }
  },
  {
    id: 'post_003',
    title: 'Abstract 3D Render',
    description: 'Modern abstract geometric shapes',
    imageUrl: '/test-image-3.jpg',
    thumbnailUrl: '/test-thumb-3.jpg',
    category: '3d',
    creator: {
      id: 'creator_003',
      name: 'Digital Artist',
      profilePicture: '/test-avatar-3.jpg'
    },
    aiTool: 'Stable Diffusion',
    tags: ['abstract', '3d', 'geometric', 'modern'],
    stats: { views: 1567, downloads: 67, favorites: 234 },
    uploadDate: '2024-01-03T00:00:00Z',
    featured: true,
    license: { type: 'commercial', attribution: false, commercial: true, modifications: false }
  },
  {
    id: 'post_004',
    title: 'Cyberpunk Portrait',
    description: 'Futuristic character design with cybernetic enhancements',
    imageUrl: '/test-image-4.jpg',
    thumbnailUrl: '/test-thumb-4.jpg',
    category: 'illustrations',
    creator: {
      id: 'creator_001',
      name: 'Digital Artist',
      profilePicture: '/test-avatar.jpg'
    },
    aiTool: 'Midjourney',
    tags: ['cyberpunk', 'portrait', 'character', 'scifi'],
    stats: { views: 890, downloads: 45, favorites: 123 },
    uploadDate: '2024-01-04T00:00:00Z',
    featured: false,
    license: { type: 'free', attribution: true, commercial: false, modifications: true }
  }
])

function createMockRequest(url: string): NextRequest {
  return new NextRequest(url, {
    method: 'GET'
  })
}

describe('/api/search', () => {
  describe('Text Search', () => {
    it('searches posts by title', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=cyberpunk')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2)
      data.posts.forEach((post: any) => {
        expect(post.title.toLowerCase()).toContain('cyberpunk')
      })
    })

    it('searches posts by description', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=futuristic')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      const hasMatch = data.posts.some((post: any) => 
        post.description.toLowerCase().includes('futuristic') ||
        post.title.toLowerCase().includes('futuristic') ||
        post.tags.some((tag: string) => tag.toLowerCase().includes('futuristic'))
      )
      expect(hasMatch).toBe(true)
    })

    it('searches posts by tags', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=landscape')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0].tags).toContain('landscape')
    })

    it('searches posts by creator name', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=Digital%20Artist')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.creator.name).toBe('Digital Artist')
      })
    })

    it('searches posts by AI tool', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=Midjourney')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.aiTool).toBe('Midjourney')
      })
    })

    it('performs case-insensitive search', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=CYBERPUNK')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2)
    })

    it('returns empty results for non-matching query', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=nonexistent')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0)
      expect(data.totalCount).toBe(0)
    })
  })

  describe('Category Filtering', () => {
    it('filters posts by category', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?category=illustrations')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.category).toBe('illustrations')
      })
    })

    it('combines text search with category filter', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=cyberpunk&category=illustrations')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      data.posts.forEach((post: any) => {
        expect(post.category).toBe('illustrations')
        const matchesQuery = 
          post.title.toLowerCase().includes('cyberpunk') ||
          post.description.toLowerCase().includes('cyberpunk') ||
          post.tags.some((tag: string) => tag.toLowerCase().includes('cyberpunk'))
        expect(matchesQuery).toBe(true)
      })
    })
  })

  describe('Creator and AI Tool Filtering', () => {
    it('filters posts by creator', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?creator=Digital%20Artist')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.creator.name).toBe('Digital Artist')
      })
    })

    it('filters posts by AI tool', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?aiTool=DALL-E')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.aiTool).toBe('DALL-E')
      })
    })
  })

  describe('Tag Filtering', () => {
    it('filters posts by single tag', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?tags=abstract')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.tags).toContain('abstract')
      })
    })

    it('filters posts by multiple tags', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?tags=cyberpunk&tags=city')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        const hasBothTags = post.tags.includes('cyberpunk') && post.tags.includes('city')
        expect(hasBothTags).toBe(true)
      })
    })
  })

  describe('License Filtering', () => {
    it('filters posts by license type', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?license=free')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      data.posts.forEach((post: any) => {
        expect(post.license.type).toBe('free')
      })
    })
  })

  describe('Sorting', () => {
    it('sorts by relevance (default)', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=cyberpunk&sortBy=relevance')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeGreaterThan(0)
      // Relevance sorting should prioritize exact matches in title/description
    })

    it('sorts by newest', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?sortBy=newest')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      const dates = data.posts.map((post: any) => new Date(post.uploadDate))
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime())
      }
    })

    it('sorts by popular (favorites)', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?sortBy=popular')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      const favorites = data.posts.map((post: any) => post.stats.favorites)
      for (let i = 1; i < favorites.length; i++) {
        expect(favorites[i-1]).toBeGreaterThanOrEqual(favorites[i])
      }
    })

    it('sorts by downloads', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?sortBy=downloads')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      const downloads = data.posts.map((post: any) => post.stats.downloads)
      for (let i = 1; i < downloads.length; i++) {
        expect(downloads[i-1]).toBeGreaterThanOrEqual(downloads[i])
      }
    })

    it('sorts by views', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?sortBy=views')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      const views = data.posts.map((post: any) => post.stats.views)
      for (let i = 1; i < views.length; i++) {
        expect(views[i-1]).toBeGreaterThanOrEqual(views[i])
      }
    })
  })

  describe('Pagination', () => {
    it('applies pagination correctly', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?page=1&limit=2')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts.length).toBeLessThanOrEqual(2)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 2,
        hasMore: expect.any(Boolean)
      })
    })

    it('handles page beyond available results', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?page=999&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0)
      expect(data.pagination.hasMore).toBe(false)
    })
  })

  describe('Facets', () => {
    it('returns category facets', async () => {
      const request = createMockRequest('http://localhost:3000/api/search')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.facets).toHaveProperty('categories')
      expect(Array.isArray(data.facets.categories)).toBe(true)
      
      const categoryCounts = data.facets.categories
      expect(categoryCounts.length).toBeGreaterThan(0)
      categoryCounts.forEach((facet: any) => {
        expect(facet).toHaveProperty('category')
        expect(facet).toHaveProperty('count')
        expect(typeof facet.count).toBe('number')
      })
    })

    it('returns creator facets', async () => {
      const request = createMockRequest('http://localhost:3000/api/search')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.facets).toHaveProperty('creators')
      expect(Array.isArray(data.facets.creators)).toBe(true)
      
      const creatorCounts = data.facets.creators
      creatorCounts.forEach((facet: any) => {
        expect(facet).toHaveProperty('name')
        expect(facet).toHaveProperty('count')
        expect(typeof facet.count).toBe('number')
      })
    })

    it('returns AI tool facets', async () => {
      const request = createMockRequest('http://localhost:3000/api/search')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.facets).toHaveProperty('aiTools')
      expect(Array.isArray(data.facets.aiTools)).toBe(true)
      
      const toolCounts = data.facets.aiTools
      toolCounts.forEach((facet: any) => {
        expect(facet).toHaveProperty('tool')
        expect(facet).toHaveProperty('count')
        expect(typeof facet.count).toBe('number')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles invalid sort parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?sortBy=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should default to relevance sorting
      expect(data.posts).toBeInstanceOf(Array)
    })

    it('handles invalid pagination parameters', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?page=invalid&limit=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(1) // Default page
      expect(data.pagination.limit).toBe(12) // Default limit
    })

    it('handles negative pagination parameters', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?page=-1&limit=-5')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBeGreaterThan(0)
      expect(data.pagination.limit).toBeGreaterThan(0)
    })

    it('handles empty query parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toBeInstanceOf(Array)
      // Should return all posts when query is empty
    })
  })

  describe('Response Format', () => {
    it('returns correct response structure', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=cyberpunk')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('posts')
      expect(data).toHaveProperty('totalCount')
      expect(data).toHaveProperty('facets')
      expect(data).toHaveProperty('pagination')
      
      expect(Array.isArray(data.posts)).toBe(true)
      expect(typeof data.totalCount).toBe('number')
      expect(data.facets).toHaveProperty('categories')
      expect(data.facets).toHaveProperty('creators')
      expect(data.facets).toHaveProperty('aiTools')
      expect(data.pagination).toHaveProperty('page')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('hasMore')
    })

    it('returns correct total count', async () => {
      const request = createMockRequest('http://localhost:3000/api/search?query=cyberpunk')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.totalCount).toBe(data.posts.length)
    })
  })
})