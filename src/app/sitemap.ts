import { MetadataRoute } from 'next'
import postsData from '@/data/posts.json'
import { Post } from '@/types'

export const dynamic = 'force-static'

const posts = postsData as Post[]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plot.gallery'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/photos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/illustrations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/3d`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Dynamic post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.uploadDate),
    changeFrequency: 'weekly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }))

  // Creator pages
  const uniqueCreators = Array.from(
    new Set(posts.map(post => post.creator.id))
  )
  const creatorPages: MetadataRoute.Sitemap = uniqueCreators.map((creatorId) => {
    const creator = posts.find(post => post.creator.id === creatorId)?.creator
    return {
      url: `${baseUrl}/creators/${creatorId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }
  })

  // Tag pages
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  )
  const tagPages: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...postPages, ...creatorPages, ...tagPages]
}