"use client"

import { useState, useEffect } from 'react'
import { SearchFilters } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange?: (filters: SearchFilters) => void
  placeholder?: string
  suggestions?: string[]
  filters?: SearchFilters
  loading?: boolean
  className?: string
}

export function SearchBar({
  onSearch,
  onFilterChange,
  placeholder = "Search AI-generated content...",
  suggestions = [],
  filters,
  loading = false,
  className
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      setShowFilters(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
    setShowSuggestions(false)
  }

  return (
    <div className={cn("relative w-full", className)} data-testid="search-bar">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(e.target.value.length >= 2 && suggestions.length > 0)
            }}
            onFocus={() => {
              if (query.length >= 2 && suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            onBlur={() => {
              // Delay to allow suggestion clicks
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-14 pr-20 h-12 text-base"
            data-testid="search-input"
            disabled={loading}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="default"
                onClick={clearSearch}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {onFilterChange && (
              <Button
                type="button"
                variant="ghost"
                size="default"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 w-8 p-0"
                data-testid="search-filters-toggle"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hidden submit button for form submission */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg"
          data-testid="search-suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
              data-testid="suggestion-item"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Search Filters */}
      {showFilters && (
        <div 
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg p-4"
          data-testid="search-filters"
        >
          <h4 className="font-semibold mb-3">Filters</h4>
          
          {/* Category Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex gap-2 flex-wrap">
              {['photos', 'illustrations', '3d'].map((category) => (
                <Button
                  key={category}
                  variant={filters?.category === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onFilterChange?.({
                      ...filters,
                      category: filters?.category === category ? undefined : category
                    })
                  }}
                  data-testid={`filter-category-${category}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Tool Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">AI Tool</label>
            <select 
              className="w-full px-3 py-2 border rounded-md"
              value={filters?.aiTool || ''}
              onChange={(e) => {
                onFilterChange?.({
                  ...filters,
                  aiTool: e.target.value || undefined
                })
              }}
              data-testid="filter-ai-tool"
            >
              <option value="">All Tools</option>
              <option value="Midjourney" data-testid="ai-tool-midjourney">Midjourney</option>
              <option value="DALL-E 3">DALL-E 3</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
              <option value="Blender AI">Blender AI</option>
            </select>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onFilterChange?.({})
                setShowFilters(false)
              }}
            >
              Clear
            </Button>
            
            <Button
              size="sm"
              onClick={() => setShowFilters(false)}
              data-testid="apply-filters"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}