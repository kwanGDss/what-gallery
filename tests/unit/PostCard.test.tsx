import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PostCard } from '@/components/posts/PostCard'
import { Post } from '@/types'
import '@testing-library/jest-dom'

const mockPost: Post = {
  id: 'test-post-1',
  title: 'Test AI Artwork',
  description: 'This is a test AI-generated artwork',
  imageUrl: '/test-image.jpg',
  thumbnailUrl: '/test-thumbnail.jpg',
  category: 'illustrations',
  creator: {
    id: 'creator-1',
    name: 'Test Artist',
    email: 'test@example.com',
    profilePicture: '/test-avatar.jpg',
    bio: 'Test artist bio',
    stats: {
      subscriberCount: 100,
      postCount: 10,
      totalViews: 1000,
      totalDownloads: 50
    },
    verified: true,
    joinDate: '2024-01-01T00:00:00Z',
    preferences: {
      theme: 'light',
      notifications: true,
      emailUpdates: false,
      favoriteCategories: ['illustrations']
    }
  },
  aiTool: 'Midjourney',
  tags: ['ai', 'art', 'digital'],
  stats: {
    views: 1234,
    downloads: 56,
    favorites: 78
  },
  uploadDate: '2024-01-15T10:00:00Z',
  featured: false,
  license: {
    type: 'free',
    attribution: true,
    commercial: false,
    modifications: true
  }
}

const mockProps = {
  post: mockPost,
  onPostClick: jest.fn(),
  onFavorite: jest.fn(),
  onDownload: jest.fn(),
  showCreator: true,
  showStats: true
}

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

describe('PostCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders post card with correct content', () => {
    render(<PostCard {...mockProps} />)
    
    expect(screen.getByText('Test AI Artwork')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument() // views
    expect(screen.getByText('56')).toBeInTheDocument() // downloads
    expect(screen.getByText('Midjourney')).toBeInTheDocument()
    expect(screen.getByAltText('Test AI Artwork')).toBeInTheDocument()
  })

  it('shows creator info when showCreator is true', () => {
    render(<PostCard {...mockProps} showCreator={true} />)
    
    // Creator info should be visible on hover
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('hides creator info when showCreator is false', () => {
    render(<PostCard {...mockProps} showCreator={false} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    expect(screen.queryByTestId('creator-info')).not.toBeInTheDocument()
  })

  it('shows stats when showStats is true', () => {
    render(<PostCard {...mockProps} showStats={true} />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('56')).toBeInTheDocument()
  })

  it('hides stats when showStats is false', () => {
    render(<PostCard {...mockProps} showStats={false} />)
    
    expect(screen.queryByText('1,234')).not.toBeInTheDocument()
    expect(screen.queryByText('56')).not.toBeInTheDocument()
  })

  it('calls onPostClick when card is clicked', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.click(card)
    
    expect(mockProps.onPostClick).toHaveBeenCalledWith('test-post-1')
  })

  it('calls onPostClick when Enter key is pressed', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.keyDown(card, { key: 'Enter' })
    
    expect(mockProps.onPostClick).toHaveBeenCalledWith('test-post-1')
  })

  it('calls onPostClick when Space key is pressed', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.keyDown(card, { key: ' ' })
    
    expect(mockProps.onPostClick).toHaveBeenCalledWith('test-post-1')
  })

  it('shows overlay on hover', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    expect(screen.getByTestId('post-overlay')).toBeInTheDocument()
  })

  it('hides overlay when not hovering', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseLeave(card)
    
    expect(screen.queryByTestId('post-overlay')).not.toBeInTheDocument()
  })

  it('calls onFavorite when favorite button is clicked', async () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    const favoriteBtn = screen.getByTestId('favorite-btn')
    fireEvent.click(favoriteBtn)
    
    expect(mockProps.onFavorite).toHaveBeenCalledWith('test-post-1')
  })

  it('calls onDownload when download button is clicked', async () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    const downloadBtn = screen.getByTestId('download-btn')
    fireEvent.click(downloadBtn)
    
    expect(mockProps.onDownload).toHaveBeenCalledWith('test-post-1')
  })

  it('prevents event bubbling when action buttons are clicked', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    const favoriteBtn = screen.getByTestId('favorite-btn')
    fireEvent.click(favoriteBtn)
    
    // onPostClick should not be called when favorite button is clicked
    expect(mockProps.onPostClick).not.toHaveBeenCalled()
  })

  it('shows loading state during download', async () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    const downloadBtn = screen.getByTestId('download-btn')
    fireEvent.click(downloadBtn)
    
    // Should show loading animation
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
    
    // Wait for download to complete
    await waitFor(() => {
      expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('toggles favorite state correctly', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    fireEvent.mouseEnter(card)
    
    const favoriteBtn = screen.getByTestId('favorite-btn')
    
    // Initially not favorited
    expect(favoriteBtn).toHaveAttribute('data-favorited', 'false')
    
    // Click to favorite
    fireEvent.click(favoriteBtn)
    
    // Should be favorited
    expect(favoriteBtn).toHaveAttribute('data-favorited', 'true')
  })

  it('applies loading styles when isLoading is true', () => {
    render(<PostCard {...mockProps} isLoading={true} />)
    
    const card = screen.getByTestId('post-card')
    expect(card).toHaveClass('animate-pulse')
  })

  it('applies custom className', () => {
    render(<PostCard {...mockProps} className="custom-class" />)
    
    const card = screen.getByTestId('post-card')
    expect(card).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<PostCard {...mockProps} />)
    
    const card = screen.getByTestId('post-card')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('data-category', 'illustrations')
    
    // Check image alt text
    const image = screen.getByAltText('Test AI Artwork')
    expect(image).toBeInTheDocument()
  })

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      post: mockPost,
      onPostClick: jest.fn()
    }
    
    render(<PostCard {...minimalProps} />)
    
    expect(screen.getByText('Test AI Artwork')).toBeInTheDocument()
    expect(screen.getByTestId('post-card')).toBeInTheDocument()
  })
})