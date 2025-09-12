'use client'

import React from 'react'
import PostcardGrid from '@/components/posts/PostcardGrid'

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    title: 'Cozy Group Gathering',
    imageUrl: 'https://images.unsplash.com/photo-1544776527-3a5e2a78a6e9?w=400&h=300&fit=crop',
    creator: {
      name: 'Pablo Stanley',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 300
  },
  {
    id: '2',
    title: 'Minimalist Green Decor',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop',
    creator: {
      name: 'Natasha Kovalev',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5af?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 500
  },
  {
    id: '3',
    title: 'Freckled Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    creator: {
      name: 'lébéa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 600
  },
  {
    id: '4',
    title: 'Light and Shadow Play',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&fit=crop',
    creator: {
      name: 'rena',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 350
  },
  {
    id: '5',
    title: 'Cheerful Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=450&fit=crop',
    creator: {
      name: 'Deep Patel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 450
  },
  {
    id: '6',
    title: 'Abstract Color Waves',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=280&fit=crop',
    creator: {
      name: 'Nika',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 280
  },
  {
    id: '7',
    title: 'Serene Mountain Vista',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop',
    creator: {
      name: 'Daniil Filatov',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 550
  },
  {
    id: '8',
    title: 'Desert Billboard at Night',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=320&fit=crop',
    creator: {
      name: 'Binks AI',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 320
  },
  {
    id: '9',
    title: 'Preserved Blue Flower',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=480&fit=crop',
    creator: {
      name: 'Ava Thiery',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5af?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 480
  },
  {
    id: '10',
    title: 'Human-Robot Interaction',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
    creator: {
      name: 'Mariate',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    width: 400,
    height: 400
  }
]

export default function PostcardsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Gallery Postcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hover over images to see the interactive popup menus - similar to Lummi.ai
          </p>
        </div>
        
        <PostcardGrid posts={mockPosts} />
      </div>
    </div>
  )
}