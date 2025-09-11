import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/components/search/SearchBar'
import { ContentCategory } from '@/types'
import '@testing-library/jest-dom'

const mockProps = {
  onSearch: jest.fn(),
  onCategoryChange: jest.fn(),
  onSortChange: jest.fn(),
  loading: false,
  placeholder: 'Search for AI artworks...'
}

// Mock debounce to make tests synchronous
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  debounce: (fn: any) => fn
}))

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with placeholder', () => {
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    expect(searchInput).toBeInTheDocument()
  })

  it('calls onSearch when typing in search input', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.type(searchInput, 'cyberpunk')
    
    expect(mockProps.onSearch).toHaveBeenCalledWith('cyberpunk')
  })

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.type(searchInput, 'landscape')
    await user.keyboard('{Enter}')
    
    expect(mockProps.onSearch).toHaveBeenCalledWith('landscape')
  })

  it('shows search icon when not loading', () => {
    render(<SearchBar {...mockProps} loading={false} />)
    
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    render(<SearchBar {...mockProps} loading={true} />)
    
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  })

  it('renders category filter dropdown', () => {
    render(<SearchBar {...mockProps} />)
    
    const categoryButton = screen.getByText('All Categories')
    expect(categoryButton).toBeInTheDocument()
  })

  it('calls onCategoryChange when category is selected', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const categoryButton = screen.getByText('All Categories')
    await user.click(categoryButton)
    
    const photosOption = screen.getByText('Photos')
    await user.click(photosOption)
    
    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('photos')
  })

  it('renders sort dropdown', () => {
    render(<SearchBar {...mockProps} />)
    
    const sortButton = screen.getByText('Relevance')
    expect(sortButton).toBeInTheDocument()
  })

  it('calls onSortChange when sort option is selected', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const sortButton = screen.getByText('Relevance')
    await user.click(sortButton)
    
    const newestOption = screen.getByText('Newest')
    await user.click(newestOption)
    
    expect(mockProps.onSortChange).toHaveBeenCalledWith('newest')
  })

  it('displays current search value', () => {
    render(<SearchBar {...mockProps} value="test search" />)
    
    const searchInput = screen.getByDisplayValue('test search')
    expect(searchInput).toBeInTheDocument()
  })

  it('displays current category selection', () => {
    render(<SearchBar {...mockProps} selectedCategory="illustrations" />)
    
    expect(screen.getByText('Illustrations')).toBeInTheDocument()
  })

  it('displays current sort selection', () => {
    render(<SearchBar {...mockProps} selectedSort="popular" />)
    
    expect(screen.getByText('Popular')).toBeInTheDocument()
  })

  it('shows clear button when there is search text', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.type(searchInput, 'test')
    
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument()
  })

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.type(searchInput, 'test')
    
    const clearButton = screen.getByLabelText(/clear search/i)
    await user.click(clearButton)
    
    expect(searchInput).toHaveValue('')
    expect(mockProps.onSearch).toHaveBeenCalledWith('')
  })

  it('shows suggestions when focused and has recent searches', async () => {
    const user = userEvent.setup()
    const propsWithSuggestions = {
      ...mockProps,
      suggestions: ['cyberpunk', 'landscape', 'portrait']
    }
    
    render(<SearchBar {...propsWithSuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.click(searchInput)
    
    expect(screen.getByText('cyberpunk')).toBeInTheDocument()
    expect(screen.getByText('landscape')).toBeInTheDocument()
    expect(screen.getByText('portrait')).toBeInTheDocument()
  })

  it('calls onSearch when suggestion is clicked', async () => {
    const user = userEvent.setup()
    const propsWithSuggestions = {
      ...mockProps,
      suggestions: ['cyberpunk', 'landscape']
    }
    
    render(<SearchBar {...propsWithSuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.click(searchInput)
    
    const suggestion = screen.getByText('cyberpunk')
    await user.click(suggestion)
    
    expect(mockProps.onSearch).toHaveBeenCalledWith('cyberpunk')
  })

  it('hides suggestions when input loses focus', async () => {
    const user = userEvent.setup()
    const propsWithSuggestions = {
      ...mockProps,
      suggestions: ['cyberpunk']
    }
    
    render(<SearchBar {...propsWithSuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.click(searchInput)
    
    expect(screen.getByText('cyberpunk')).toBeInTheDocument()
    
    await user.tab() // Move focus away
    
    await waitFor(() => {
      expect(screen.queryByText('cyberpunk')).not.toBeInTheDocument()
    })
  })

  it('filters suggestions based on input text', async () => {
    const user = userEvent.setup()
    const propsWithSuggestions = {
      ...mockProps,
      suggestions: ['cyberpunk city', 'cyber warrior', 'landscape']
    }
    
    render(<SearchBar {...propsWithSuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.type(searchInput, 'cyber')
    await user.click(searchInput)
    
    expect(screen.getByText('cyberpunk city')).toBeInTheDocument()
    expect(screen.getByText('cyber warrior')).toBeInTheDocument()
    expect(screen.queryByText('landscape')).not.toBeInTheDocument()
  })

  it('navigates suggestions with keyboard', async () => {
    const user = userEvent.setup()
    const propsWithSuggestions = {
      ...mockProps,
      suggestions: ['cyberpunk', 'landscape', 'portrait']
    }
    
    render(<SearchBar {...propsWithSuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.click(searchInput)
    
    // Arrow down to first suggestion
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('cyberpunk')).toHaveClass('highlighted')
    
    // Arrow down to second suggestion
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('landscape')).toHaveClass('highlighted')
    
    // Enter to select
    await user.keyboard('{Enter}')
    expect(mockProps.onSearch).toHaveBeenCalledWith('landscape')
  })

  it('shows keyboard shortcut hint', () => {
    render(<SearchBar {...mockProps} showShortcut={true} />)
    
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument()
  })

  it('focuses input when keyboard shortcut is pressed', () => {
    render(<SearchBar {...mockProps} showShortcut={true} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    
    // Simulate Ctrl+K
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    
    expect(searchInput).toHaveFocus()
  })

  it('handles disabled state', () => {
    render(<SearchBar {...mockProps} disabled={true} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    expect(searchInput).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<SearchBar {...mockProps} className="custom-search" />)
    
    const container = screen.getByTestId('search-bar')
    expect(container).toHaveClass('custom-search')
  })

  it('has proper accessibility attributes', () => {
    render(<SearchBar {...mockProps} />)
    
    const searchInput = screen.getByRole('searchbox')
    expect(searchInput).toHaveAttribute('aria-label', 'Search for AI artworks')
    
    const categoryButton = screen.getByRole('button', { name: /category/i })
    expect(categoryButton).toHaveAttribute('aria-haspopup', 'listbox')
    
    const sortButton = screen.getByRole('button', { name: /sort/i })
    expect(sortButton).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('handles empty suggestions gracefully', async () => {
    const user = userEvent.setup()
    const propsWithEmptySuggestions = {
      ...mockProps,
      suggestions: []
    }
    
    render(<SearchBar {...propsWithEmptySuggestions} />)
    
    const searchInput = screen.getByPlaceholderText('Search for AI artworks...')
    await user.click(searchInput)
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})