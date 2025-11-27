'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking'

interface SearchWithTrackingProps {
  onSearch: (query: string) => Promise<{ results: unknown[]; count: number }>
  placeholder?: string
}

/**
 * Search component with automatic behavior tracking
 * Tracks search queries and result counts
 */
export function SearchWithTracking({ onSearch, placeholder = '검색어를 입력하세요...' }: SearchWithTrackingProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { trackSearch } = useBehaviorTracking()

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const { results, count } = await onSearch(query)

      // Track search behavior
      await trackSearch(query, count)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [query, onSearch, trackSearch])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSearching}
        className="flex-1"
      />
      <Button
        onClick={handleSearch}
        disabled={isSearching || !query.trim()}
        className="shrink-0"
      >
        <Search className="w-4 h-4 mr-2" />
        검색
      </Button>
    </div>
  )
}
