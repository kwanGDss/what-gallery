import { NextRequest, NextResponse } from 'next/server'
import postsData from '@/data/posts.json'
import tagsData from '@/data/tags.json'
import { Post, SearchResponse, ContentCategory, Tag } from '@/types'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') as ContentCategory | null
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Type cast the imported JSON data
    const posts = postsData as Post[]
    const allTags = tagsData as Tag[]

    let results = posts

    // Apply search query
    if (query.trim()) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        post.creator.name.toLowerCase().includes(query.toLowerCase()) ||
        post.aiTool.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Apply category filter
    if (category) {
      results = results.filter(post => post.category === category)
    }

    // Apply tags filter
    if (tags.length > 0) {
      results = results.filter(post => 
        tags.some(tag => post.tags.includes(tag))
      )
    }

    // Calculate facets for filtering
    const categoryFacets = Object.values(['photos', 'illustrations', '3d'] as ContentCategory[])
      .map(cat => ({
        category: cat,
        count: results.filter(post => post.category === cat).length
      }))
      .filter(facet => facet.count > 0)

    const tagFacets = [...new Set(results.flatMap(post => post.tags))]
      .map(tag => ({
        tag: tag,
        count: results.filter(post => post.tags.includes(tag)).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // Top 20 tags

    const aiToolFacets = [...new Set(results.map(post => post.aiTool))]
      .map(tool => ({
        tool: tool,
        count: results.filter(post => post.aiTool === tool).length
      }))
      .sort((a, b) => b.count - a.count)

    // Pagination
    const totalResults = results.length
    const startIndex = (page - 1) * limit
    const paginatedResults = results.slice(startIndex, startIndex + limit)

    // Generate search suggestions (simple implementation)
    const suggestions = query.length >= 2 ? 
      allTags
        .filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(tag => tag.name)
      : []

    const response: SearchResponse = {
      results: paginatedResults,
      query: query,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      totalResults: totalResults,
      facets: {
        categories: categoryFacets,
        tags: tagFacets,
        aiTools: aiToolFacets
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: { code: 'SEARCH_ERROR', message: 'Failed to perform search' } },
      { status: 500 }
    )
  }
}