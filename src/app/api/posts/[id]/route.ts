import { NextRequest, NextResponse } from 'next/server'
import postsData from '@/data/posts.json'
import usersData from '@/data/users.json'
import { Post, PostDetailResponse, User } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id
    
    // Type cast the imported JSON data
    const posts = postsData as Post[]
    const users = usersData as User[]
    
    // Find the post
    const post = posts.find(p => p.id === postId)
    
    if (!post) {
      return NextResponse.json(
        { error: { code: 'POST_NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      )
    }

    // Find the full creator details
    const creator = users.find(u => u.id === post.creator.id)
    
    if (!creator) {
      return NextResponse.json(
        { error: { code: 'CREATOR_NOT_FOUND', message: 'Creator not found' } },
        { status: 404 }
      )
    }

    // Find similar posts (same category, excluding current post)
    const similarPosts = posts
      .filter(p => p.id !== postId && p.category === post.category)
      .slice(0, 6) // Limit to 6 similar posts

    // If not enough similar posts from same category, add from other categories
    if (similarPosts.length < 6) {
      const additionalPosts = posts
        .filter(p => p.id !== postId && p.category !== post.category)
        .slice(0, 6 - similarPosts.length)
      
      similarPosts.push(...additionalPosts)
    }

    const response: PostDetailResponse = {
      post: post,
      similarPosts: similarPosts,
      creator: creator
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching post detail:', error)
    return NextResponse.json(
      { error: { code: 'POST_DETAIL_ERROR', message: 'Failed to fetch post details' } },
      { status: 500 }
    )
  }
}