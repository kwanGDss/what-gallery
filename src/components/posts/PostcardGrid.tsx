import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, Download, MoreHorizontal, Wand2, Edit, Sparkles, FolderPlus, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostcardProps {
  id: string
  title: string
  imageUrl: string
  creator: {
    name: string
    avatar: string
  }
  width: number
  height: number
}

interface PostcardGridProps {
  posts: PostcardProps[]
}

const PostcardItem: React.FC<{ post: PostcardProps }> = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Download functionality here
    console.log('Download', post.title)
  }

  const handleMenuAction = (action: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    console.log(`${action} action for`, post.title)
    
    if (action === 'select') {
      setIsSelected(!isSelected)
    }
  }

  return (
    <div 
      className="relative group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`postcard-${post.id}`}
    >
      {/* Image Container */}
      <div className="relative">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={post.width}
          height={post.height}
          className="w-full h-auto object-cover"
        />
        
        {/* Overlay with action buttons */}
        <div 
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top right actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
              data-testid={`like-button-${post.id}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full transition-colors duration-200"
                  data-testid={`menu-button-${post.id}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-white dark:bg-gray-800 border shadow-lg rounded-lg"
              >
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction('create', e)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  Use to create
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction('retouch', e)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Retouch
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction('effects', e)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Add FX</span>
                  <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    New
                  </span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction('collection', e)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4" />
                  Add to collection
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={(e) => handleMenuAction('select', e)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Check className={`w-4 h-4 ${isSelected ? 'text-blue-500' : ''}`} />
                  <span className={isSelected ? 'text-blue-500 font-medium' : ''}>
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bottom left download button */}
          <div className="absolute bottom-3 left-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg transition-colors duration-200"
              data-testid={`download-button-${post.id}`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 left-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={post.creator.avatar}
              alt={post.creator.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {post.creator.name}
            </span>
          </div>
        </div>
        <h3 className="font-medium text-gray-900 dark:text-white mt-2 line-clamp-2">
          {post.title}
        </h3>
      </div>
    </div>
  )
}

const PostcardGrid: React.FC<PostcardGridProps> = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {posts.map((post) => (
          <PostcardItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default PostcardGrid