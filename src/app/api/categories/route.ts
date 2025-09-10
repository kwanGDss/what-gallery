import { NextRequest, NextResponse } from 'next/server'
import categoriesData from '@/data/categories.json'
import postsData from '@/data/posts.json'
import { Post, CategoriesResponse, ContentCategory } from '@/types'

export async function GET(_request: NextRequest) {
  try {
    // Type cast the imported JSON data
    interface RawCategory {
      id: string;
      name: string;
      description: string;
      icon: string;
    }
    const rawCategories = categoriesData as RawCategory[]
    const posts = postsData as Post[]

    // Transform categories data to match the expected interface
    const categories = rawCategories.map(cat => {
      // Count posts in this category
      const categoryPosts = posts.filter(post => post.category === cat.id)
      const postCount = categoryPosts.length

      // Get featured posts for this category (first 3 posts)
      const featured = categoryPosts
        .filter(post => post.featured)
        .slice(0, 3)

      // If not enough featured posts, supplement with most popular
      if (featured.length < 3) {
        const popularPosts = categoryPosts
          .filter(post => !post.featured)
          .sort((a, b) => b.stats.views - a.stats.views)
          .slice(0, 3 - featured.length)
        
        featured.push(...popularPosts)
      }

      return {
        id: cat.id as ContentCategory,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        postCount: postCount,
        featured: featured
      }
    })

    const response: CategoriesResponse = {
      categories: categories
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: { code: 'CATEGORIES_ERROR', message: 'Failed to fetch categories' } },
      { status: 500 }
    )
  }
}