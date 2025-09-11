"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { PostGrid } from '@/components/posts/PostGrid'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Post, ContentCategory } from '@/types'
import { Camera, Palette, Box } from 'lucide-react'

const categoryConfig = {
  'photos': {
    title: 'AI Photos',
    description: 'Discover stunning AI-generated photographs and realistic images',
    icon: Camera,
    gradient: 'from-blue-500 to-cyan-500'
  },
  'illustrations': {
    title: 'AI Illustrations', 
    description: 'Explore creative AI-generated illustrations and digital art',
    icon: Palette,
    gradient: 'from-purple-500 to-pink-500'
  },
  '3d': {
    title: '3D AI Renders',
    description: 'Browse amazing AI-generated 3D models and renders',
    icon: Box,
    gradient: 'from-orange-500 to-red-500'
  }
}

export default function CategoryPage() {
  const params = useParams()
  const category = params?.category as ContentCategory
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  const config = categoryConfig[category]

  useEffect(() => {
    if (!config) {
      setError('Category not found')
      setLoading(false)
      return
    }

    const fetchCategoryPosts = async () => {
      setLoading(true)
      setError(undefined)

      try {
        const response = await fetch(`/api/posts?category=${category}`)
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryPosts()
  }, [category, config])

  const handlePostClick = (postId: string) => {
    console.log('Open post modal:', postId)
    // In a real app, this would open the post modal or navigate to post page
  }

  if (!config) {
    return (
      <PageLayout title="Category Not Found" showCategoryTabs={false}>
        <div className="w-full px-2 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">
              The category &quot;{category}&quot; does not exist.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout title={`${config.title} - Error`} currentCategory={category}>
        <div className="w-full px-2 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading {config.title}</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const IconComponent = config.icon

  return (
    <PageLayout 
      title={config.title}
      description={config.description}
      currentCategory={category}
    >
      <div className="w-full px-2 py-6">
        {/* Category Header */}
        <div className="mb-8">
          <div className={`bg-gradient-to-r ${config.gradient} p-8 rounded-lg text-white mb-6`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{config.title}</h1>
                <p className="text-white/90">{config.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {posts.length > 0 ? posts.length : '...'}
                </div>
                <div className="text-sm text-white/75">Images</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-white/75">Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-sm text-white/75">Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text={`Loading ${config.title.toLowerCase()}...`} />
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <PostGrid
                posts={posts}
                loading={loading}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No {config.title} Yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for amazing {config.title.toLowerCase()}!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}