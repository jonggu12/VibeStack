'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search/search-bar'
import { SearchFilters, SearchFiltersState } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { useSearch } from '@/hooks/use-search'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

function SearchContent() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const {
        results,
        isLoading,
        error,
        totalHits,
        totalPages,
        currentPage,
        processingTime,
        query,
        search,
    } = useSearch()

    const [filters, setFilters] = useState<SearchFiltersState>({})
    const [showFilters, setShowFilters] = useState(false)
    const [hasInitialSearched, setHasInitialSearched] = useState(false)

    // Initial search on mount if query exists (only once)
    useEffect(() => {
        if (initialQuery && !hasInitialSearched) {
            search(initialQuery, filters)
            setHasInitialSearched(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery, hasInitialSearched])

    const handleSearch = (newQuery: string) => {
        search(newQuery, filters)
    }

    const handleFiltersChange = (newFilters: SearchFiltersState) => {
        setFilters(newFilters)
        if (query) {
            search(query, newFilters)
        }
    }

    const handlePageChange = (page: number) => {
        search(query, filters, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">검색</h1>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="문서, 튜토리얼, 스니펫 검색..."
                        autoFocus
                    />
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        필터
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-4">
                        <h2 className="font-semibold mb-4">필터</h2>
                        <SearchFilters
                            filters={filters}
                            onChange={handleFiltersChange}
                            availableTags={['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind', 'Clerk', 'Stripe']}
                        />
                    </div>
                </aside>

                {/* Mobile Filters */}
                {showFilters && (
                    <div className="md:hidden p-4 bg-muted rounded-lg mb-4">
                        <SearchFilters
                            filters={filters}
                            onChange={handleFiltersChange}
                            availableTags={['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind', 'Clerk', 'Stripe']}
                        />
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {/* Search Results */}
                    <SearchResults
                        results={results}
                        query={query}
                        isLoading={isLoading}
                        totalHits={totalHits}
                        processingTime={processingTime}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0 || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                이전
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                {currentPage + 1} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1 || isLoading}
                            >
                                다음
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageSkeleton />}>
            <SearchContent />
        </Suspense>
    )
}

function SearchPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <div className="h-10 w-32 bg-muted rounded animate-pulse mb-4" />
                <div className="h-10 w-full max-w-2xl bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-8">
                <div className="hidden md:block w-64">
                    <div className="h-6 w-16 bg-muted rounded animate-pulse mb-4" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}
