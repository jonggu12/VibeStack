'use client'

import { useState, useCallback } from 'react'
import type { AlgoliaContentRecord, SearchResult } from '@/lib/algolia'
import type { SearchFiltersState } from '@/components/search/search-filters'

interface UseSearchReturn {
    results: AlgoliaContentRecord[]
    isLoading: boolean
    error: string | null
    totalHits: number
    totalPages: number
    currentPage: number
    processingTime: number
    query: string
    search: (query: string, filters?: SearchFiltersState, page?: number) => Promise<void>
    clearResults: () => void
}

export function useSearch(): UseSearchReturn {
    const [results, setResults] = useState<AlgoliaContentRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [totalHits, setTotalHits] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(0)
    const [processingTime, setProcessingTime] = useState(0)
    const [query, setQuery] = useState('')

    const search = useCallback(async (
        searchQuery: string,
        filters?: SearchFiltersState,
        page: number = 0
    ) => {
        setQuery(searchQuery)
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.set('q', searchQuery)

            if (filters?.type) {
                params.set('type', filters.type)
            }
            if (filters?.difficulty) {
                params.set('difficulty', filters.difficulty)
            }
            if (filters?.isPremium !== undefined) {
                params.set('isPremium', String(filters.isPremium))
            }
            if (filters?.tags && filters.tags.length > 0) {
                params.set('tags', filters.tags.join(','))
            }

            params.set('page', String(page))

            const response = await fetch(`/api/content/search?${params.toString()}`)

            if (!response.ok) {
                throw new Error('검색에 실패했습니다')
            }

            const data: SearchResult = await response.json()

            setResults(data.hits)
            setTotalHits(data.nbHits)
            setTotalPages(data.nbPages)
            setCurrentPage(data.page)
            setProcessingTime(data.processingTimeMS)
        } catch (err) {
            console.error('Search error:', err)
            setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다')
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearResults = useCallback(() => {
        setResults([])
        setTotalHits(0)
        setTotalPages(0)
        setCurrentPage(0)
        setProcessingTime(0)
        setQuery('')
        setError(null)
    }, [])

    return {
        results,
        isLoading,
        error,
        totalHits,
        totalPages,
        currentPage,
        processingTime,
        query,
        search,
        clearResults,
    }
}
