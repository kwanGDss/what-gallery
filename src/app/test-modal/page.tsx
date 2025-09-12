'use client'

import React, { useState } from 'react'
import { PostModal } from '@/components/posts/PostModal'
import { Button } from '@/components/ui/button'
import { Post } from '@/types'

// Mock post data for testing
const mockPost: Post = {
  id: 'test_001',
  title: 'Cyberpunk City Night',
  description: 'Futuristic cityscape with neon lights and rain reflecting on wet streets. A stunning vision of tomorrow created using advanced AI technology.',
  imageUrl: 'https://picsum.photos/1200/800?random=cyberpunk-city-001.jpg',
  thumbnailUrl: 'https://picsum.photos/400/300?random=thumb-cyberpunk-city-001-thumb.jpg',
  category: 'illustrations',
  creator: {
    id: 'user_001',
    name: 'AI_Artist_Pro',
    profilePicture: 'https://picsum.photos/64/64?random=avatar-ai-artist-pro.jpg',
    stats: {
      subscriberCount: 15420,
      postsCount: 89,
      totalDownloads: 234567
    }
  },
  aiTool: 'Midjourney',
  tags: ['cyberpunk', 'cityscape', 'neon', 'futuristic', 'rain', 'night'],
  stats: {
    views: 12340,
    downloads: 890,
    favorites: 1560
  },
  uploadDate: '2025-09-08T10:00:00Z',
  featured: true,
  license: {
    type: 'free',
    attribution: true,
    commercial: false,
    modifications: true
  }
}

const mockSimilarPosts: Post[] = [
  {
    ...mockPost,
    id: 'similar_001',
    title: 'Neon Street',
    imageUrl: 'https://picsum.photos/800/600?random=neon-street-001.jpg'
  },
  {
    ...mockPost,
    id: 'similar_002',
    title: 'Future City',
    imageUrl: 'https://picsum.photos/800/600?random=future-city-002.jpg'
  },
  {
    ...mockPost,
    id: 'similar_003',
    title: 'Rain Night',
    imageUrl: 'https://picsum.photos/800/600?random=rain-night-003.jpg'
  },
  {
    ...mockPost,
    id: 'similar_004',
    title: 'Digital Dreams',
    imageUrl: 'https://picsum.photos/800/600?random=digital-dreams-004.jpg'
  },
  {
    ...mockPost,
    id: 'similar_005',
    title: 'Cyber Alley',
    imageUrl: 'https://picsum.photos/800/600?random=cyber-alley-005.jpg'
  },
  {
    ...mockPost,
    id: 'similar_006',
    title: 'Neon Reflections',
    imageUrl: 'https://picsum.photos/800/600?random=neon-reflections-006.jpg'
  },
  {
    ...mockPost,
    id: 'similar_007',
    title: 'Future Landscape',
    imageUrl: 'https://picsum.photos/800/600?random=future-landscape-007.jpg'
  },
  {
    ...mockPost,
    id: 'similar_008',
    title: 'Tech Metropolis',
    imageUrl: 'https://picsum.photos/800/600?random=tech-metropolis-008.jpg'
  }
]

export default function TestModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFavorite = (postId: string) => {
    console.log('Favoriting post:', postId)
  }

  const handleDownload = (postId: string) => {
    console.log('Downloading post:', postId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Test PostModal - Lummi.ai Style</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This tests the new full-screen PostModal inspired by Lummi.ai
        </p>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="text-lg px-8 py-4"
        >
          Open Full Screen Modal
        </Button>

        <PostModal
          post={mockPost}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFavorite={handleFavorite}
          onDownload={handleDownload}
          similarPosts={mockSimilarPosts}
        />
      </div>
    </div>
  )
}