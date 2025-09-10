import { NextRequest, NextResponse } from 'next/server'
import postsData from '@/data/posts.json'
import { Post } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '6')
    
    // Type cast the imported JSON data
    const posts = postsData as Post[]
    
    // Filter featured posts and limit the results
    const featuredPosts = posts
      .filter(post => post.featured)
      .slice(0, limit)

    // If not enough featured posts, supplement with most popular posts
    if (featuredPosts.length < limit) {
      const popularPosts = posts
        .filter(post => !post.featured)
        .sort((a, b) => b.stats.views - a.stats.views)
        .slice(0, limit - featuredPosts.length)
      
      featuredPosts.push(...popularPosts)
    }

    const response = {
      posts: featuredPosts
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return NextResponse.json(
      { error: { code: 'FEATURED_POSTS_ERROR', message: 'Failed to fetch featured posts' } },
      { status: 500 }
    )
  }
}