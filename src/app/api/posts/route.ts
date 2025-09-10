import { NextRequest, NextResponse } from 'next/server'
import postsData from '@/data/posts.json'
import { Post, PostsResponse, ContentCategory } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as ContentCategory | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const creator = searchParams.get('creator') || ''
    const aiTool = searchParams.get('aiTool') || ''
    const sortBy = searchParams.get('sortBy') || 'newest'

    // Type cast the imported JSON data
    let filteredPosts = postsData as Post[]

    // Apply filters
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }

    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        tags.some(tag => post.tags.includes(tag))
      )
    }

    if (creator) {
      filteredPosts = filteredPosts.filter(post => post.creator.id === creator)
    }

    if (aiTool) {
      filteredPosts = filteredPosts.filter(post => post.aiTool === aiTool)
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => b.stats.views - a.stats.views)
        break
      case 'downloads':
        filteredPosts.sort((a, b) => b.stats.downloads - a.stats.downloads)
        break
      case 'views':
        filteredPosts.sort((a, b) => b.stats.views - a.stats.views)
        break
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        break
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit)
    const totalPages = Math.ceil(filteredPosts.length / limit)
    const hasMore = startIndex + limit < filteredPosts.length

    // Generate available filters
    const allPosts = postsData as Post[]
    const availableCategories = [...new Set(allPosts.map(post => post.category))] as ContentCategory[]
    const availableTags = [...new Set(allPosts.flatMap(post => post.tags))]
    const availableAiTools = [...new Set(allPosts.map(post => post.aiTool))]
    const availableCreators = [...new Set(allPosts.map(post => post.creator.id))]

    const response: PostsResponse = {
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: filteredPosts.length,
        hasMore: hasMore
      },
      filters: {
        appliedFilters: {
          category,
          page,
          limit,
          search: search || undefined,
          tags: tags.length > 0 ? tags : undefined,
          creator: creator || undefined,
          aiTool: aiTool || undefined,
          sortBy: sortBy as 'newest' | 'popular' | 'downloads' | 'views'
        },
        availableFilters: {
          categories: availableCategories,
          tags: availableTags,
          aiTools: availableAiTools,
          creators: availableCreators
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: { code: 'POSTS_FETCH_ERROR', message: 'Failed to fetch posts' } },
      { status: 500 }
    )
  }
}