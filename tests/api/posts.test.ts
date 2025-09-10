/**
 * @jest-environment node
 */

import { GET } from '@/app/api/posts/route'
import { GET as getPostById } from '@/app/api/posts/[id]/route'
import { GET as getFeaturedPosts } from '@/app/api/posts/featured/route'
import { NextRequest } from 'next/server'

// Mock the data imports
jest.mock('@/data/posts.json', () => [
  {
    id: 'post_001',
    title: 'Test Post 1',
    description: 'Test description 1',
    imageUrl: '/test-image-1.jpg',
    thumbnailUrl: '/test-thumb-1.jpg',
    category: 'illustrations',
    creator: {
      id: 'creator_001',
      name: 'Test Artist',
      profilePicture: '/test-avatar.jpg'
    },
    aiTool: 'Midjourney',
    tags: ['test', 'ai'],
    stats: { views: 100, downloads: 10, favorites: 5 },
    uploadDate: '2024-01-01T00:00:00Z',
    featured: true,
    license: { type: 'free', attribution: true, commercial: false, modifications: true }
  },
  {
    id: 'post_002',
    title: 'Test Post 2',
    description: 'Test description 2',
    imageUrl: '/test-image-2.jpg',
    thumbnailUrl: '/test-thumb-2.jpg',
    category: 'photos',
    creator: {
      id: 'creator_002',
      name: 'Test Photographer',
      profilePicture: '/test-avatar-2.jpg'
    },
    aiTool: 'DALL-E',
    tags: ['photo', 'landscape'],
    stats: { views: 200, downloads: 20, favorites: 15 },
    uploadDate: '2024-01-02T00:00:00Z',
    featured: false,
    license: { type: 'premium', attribution: false, commercial: true, modifications: true }
  },
  {
    id: 'post_003',
    title: 'Test Post 3',
    description: 'Test description 3',
    imageUrl: '/test-image-3.jpg',
    thumbnailUrl: '/test-thumb-3.jpg',
    category: '3d',
    creator: {
      id: 'creator_003',
      name: 'Test 3D Artist',
      profilePicture: '/test-avatar-3.jpg'
    },
    aiTool: 'Stable Diffusion',
    tags: ['3d', 'render'],
    stats: { views: 150, downloads: 15, favorites: 8 },
    uploadDate: '2024-01-03T00:00:00Z',
    featured: true,
    license: { type: 'commercial', attribution: false, commercial: true, modifications: false }
  }
])

function createMockRequest(url: string): NextRequest {
  return new NextRequest(url, {
    method: 'GET'
  })
}

describe('/api/posts', () => {
  describe('GET /api/posts', () => {
    it('returns all posts with default pagination', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(3)
      expect(data.pagination.currentPage).toBe(1)
      expect(data.pagination.totalItems).toBe(3)
      expect(data.pagination.hasMore).toBe(false)
    })

    it('applies pagination correctly', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?page=1&limit=2')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2)
      expect(data.pagination.currentPage).toBe(1)
      expect(data.pagination.totalItems).toBe(3)
      expect(data.pagination.hasMore).toBe(true)
    })

    it('filters posts by category', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?category=photos')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0].category).toBe('photos')
    })

    it('filters posts by creator', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?creator=creator_001')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0].creator.id).toBe('creator_001')
    })

    it('filters posts by AI tool', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?aiTool=DALL-E')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0].aiTool).toBe('DALL-E')
    })

    it('sorts posts by newest', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?sortBy=newest')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts[0].id).toBe('post_003') // Most recent
      expect(data.posts[2].id).toBe('post_001') // Oldest
    })

    it('sorts posts by popular (favorites)', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?sortBy=popular')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts[0].stats.favorites).toBe(15) // Most popular
      expect(data.posts[2].stats.favorites).toBe(5)  // Least popular
    })

    it('sorts posts by downloads', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?sortBy=downloads')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts[0].stats.downloads).toBe(20) // Most downloads
      expect(data.posts[2].stats.downloads).toBe(10) // Least downloads
    })

    it('sorts posts by views', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?sortBy=views')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts[0].stats.views).toBe(200) // Most views
      expect(data.posts[2].stats.views).toBe(100) // Least views
    })

    it('handles invalid page parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?page=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.currentPage).toBe(1) // Defaults to page 1
    })

    it('handles invalid limit parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?limit=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.limit).toBe(12) // Defaults to 12
    })

    it('handles empty category filter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?category=nonexistent')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0)
    })

    it('combines multiple filters', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?category=illustrations&sortBy=newest')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
      expect(data.posts[0].category).toBe('illustrations')
    })
  })

  describe('GET /api/posts/[id]', () => {
    it('returns post by ID with similar posts', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/post_001')
      const response = await getPostById(request, { params: { id: 'post_001' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.post.id).toBe('post_001')
      expect(data.post.title).toBe('Test Post 1')
      expect(data.similarPosts).toBeInstanceOf(Array)
    })

    it('returns similar posts from same category', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/post_001')
      const response = await getPostById(request, { params: { id: 'post_001' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should not include similar posts from different categories
      data.similarPosts.forEach((post: any) => {
        expect(post.category).toBe('illustrations')
        expect(post.id).not.toBe('post_001') // Should not include the post itself
      })
    })

    it('limits similar posts to 6', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/post_001')
      const response = await getPostById(request, { params: { id: 'post_001' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.similarPosts.length).toBeLessThanOrEqual(6)
    })

    it('returns 404 for non-existent post', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/nonexistent')
      const response = await getPostById(request, { params: { id: 'nonexistent' } })

      expect(response.status).toBe(404)
    })

    it('handles empty ID parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/')
      const response = await getPostById(request, { params: { id: '' } })

      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/posts/featured', () => {
    it('returns only featured posts', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2) // Only 2 featured posts in mock data
      data.posts.forEach((post: any) => {
        expect(post.featured).toBe(true)
      })
    })

    it('applies limit parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured?limit=1')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(1)
    })

    it('sorts featured posts by newest by default', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should be sorted by upload date descending
      const dates = data.posts.map((post: any) => new Date(post.uploadDate))
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime())
      }
    })

    it('handles limit parameter exceeding available posts', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured?limit=100')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2) // Only 2 featured posts available
    })

    it('handles invalid limit parameter', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured?limit=invalid')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2) // Returns all featured posts
    })

    it('returns empty array when no featured posts', async () => {
      // Mock empty featured posts
      jest.doMock('@/data/posts.json', () => [
        {
          id: 'post_001',
          featured: false,
          // ... other properties
        }
      ])

      const request = createMockRequest('http://localhost:3000/api/posts/featured')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0)
    })
  })

  describe('Error Handling', () => {
    it('handles malformed requests gracefully', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?page=-1&limit=-5')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.currentPage).toBeGreaterThan(0)
      expect(data.pagination.limit).toBeGreaterThan(0)
    })

    it('handles extremely large page numbers', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts?page=99999')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0)
      expect(data.pagination.hasMore).toBe(false)
    })
  })

  describe('Response Format', () => {
    it('returns correct response structure for posts list', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('posts')
      expect(data).toHaveProperty('pagination')
      expect(data.pagination).toHaveProperty('page')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('total')
      expect(data.pagination).toHaveProperty('hasMore')
    })

    it('returns correct response structure for single post', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/post_001')
      const response = await getPostById(request, { params: { id: 'post_001' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('post')
      expect(data).toHaveProperty('similarPosts')
      expect(data.post).toHaveProperty('id')
      expect(data.post).toHaveProperty('title')
      expect(data.post).toHaveProperty('creator')
      expect(data.post).toHaveProperty('stats')
    })

    it('returns correct response structure for featured posts', async () => {
      const request = createMockRequest('http://localhost:3000/api/posts/featured')
      const response = await getFeaturedPosts(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('posts')
      expect(Array.isArray(data.posts)).toBe(true)
    })
  })
})