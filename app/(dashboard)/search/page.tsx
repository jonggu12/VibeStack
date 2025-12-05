'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, Eye, Star, ChevronLeft, ChevronRight, Filter, X, Sparkles, BookOpen, Code2, FileText, Layers } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import type { AlgoliaContentRecord } from '@/lib/algolia'

type FilterType = 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary' | null
type FilterDifficulty = 'beginner' | 'intermediate' | 'advanced' | null

const typeConfig = {
  doc: { icon: FileText, label: '문서', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  tutorial: { icon: BookOpen, label: '튜토리얼', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  snippet: { icon: Code2, label: '스니펫', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  bundle: { icon: Layers, label: '번들', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  glossary: { icon: Sparkles, label: '용어사전', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
}

const difficultyConfig = {
  beginner: { label: '입문', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  intermediate: { label: '중급', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  advanced: { label: '고급', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

function getContentUrl(content: AlgoliaContentRecord): string {
  switch (content.type) {
    case 'doc':
      return `/docs/${content.slug}`
    case 'tutorial':
      return `/tutorials/${content.slug}`
    case 'snippet':
      return `/snippets/${content.slug}`
    case 'bundle':
      return `/bundles/${content.slug}`
    case 'glossary':
      return `/docs/glossary/${content.slug}`
    default:
      return `/${content.type}/${content.slug}`
  }
}

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

  const [searchInput, setSearchInput] = useState(initialQuery)
  const [filterType, setFilterType] = useState<FilterType>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [hasInitialSearched, setHasInitialSearched] = useState(false)

  // Initial search on mount if query exists
  useEffect(() => {
    if (initialQuery && !hasInitialSearched) {
      search(initialQuery, { type: filterType || undefined, difficulty: filterDifficulty || undefined })
      setHasInitialSearched(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, hasInitialSearched])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      search(searchInput, { type: filterType || undefined, difficulty: filterDifficulty || undefined })
    }
  }

  const handleFilterChange = (type: FilterType = null, difficulty: FilterDifficulty = null) => {
    setFilterType(type)
    setFilterDifficulty(difficulty)
    if (query) {
      search(query, { type: type || undefined, difficulty: difficulty || undefined })
    }
  }

  const handlePageChange = (page: number) => {
    search(query, { type: filterType || undefined, difficulty: filterDifficulty || undefined }, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilterType(null)
    setFilterDifficulty(null)
    if (query) {
      search(query, {})
    }
  }

  const activeFiltersCount = [filterType, filterDifficulty].filter(Boolean).length

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* HERO & SEARCH */}
          <section className="text-center py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">무엇을 찾고 계신가요?</h1>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              튜토리얼, 문서, 스니펫, 용어사전에서 원하는 콘텐츠를 검색하세요.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-base placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white transition-all shadow-lg"
                  placeholder="예: Next.js 인증, Stripe 결제, React 훅..."
                  autoFocus
                />
              </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFilters
                    ? 'bg-indigo-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Filter className="w-4 h-4" />
                필터
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  초기화
                </button>
              )}
            </div>
          </section>

          {/* FILTERS */}
          {showFilters && (
            <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">콘텐츠 타입</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const Icon = config.icon
                    const isActive = filterType === type
                    return (
                      <button
                        key={type}
                        onClick={() => handleFilterChange(isActive ? null : type as FilterType, filterDifficulty)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                          isActive
                            ? config.color
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">난이도</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(difficultyConfig).map(([difficulty, config]) => {
                    const isActive = filterDifficulty === difficulty
                    return (
                      <button
                        key={difficulty}
                        onClick={() => handleFilterChange(filterType, isActive ? null : difficulty as FilterDifficulty)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                          isActive
                            ? config.color
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* RESULTS SUMMARY */}
          {query && !isLoading && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-zinc-400">
                <span className="text-white font-bold">&quot;{query}&quot;</span>에 대한 검색 결과{' '}
                <span className="text-white font-bold">{totalHits}개</span>
                {processingTime && <span className="text-zinc-600"> ({processingTime}ms)</span>}
              </p>
            </div>
          )}

          {/* LOADING */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
                  <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* RESULTS */}
          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">검색 결과가 없습니다</h3>
              <p className="text-zinc-400 mb-6">
                &quot;{query}&quot;에 대한 결과를 찾을 수 없습니다.
              </p>
              <button
                onClick={clearFilters}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                필터를 초기화하고 다시 검색해보세요 →
              </button>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {results.map((result) => {
                const config = typeConfig[result.type]
                const diffConfig = difficultyConfig[result.difficulty]
                const Icon = config.icon

                return (
                  <Link
                    key={result.objectID}
                    href={getContentUrl(result)}
                    className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                        {diffConfig && (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${diffConfig.color}`}>
                            {diffConfig.label}
                          </span>
                        )}
                        {result.isPremium && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-lg border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                            Pro
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                      {result.title}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                      {result.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      {result.estimatedTimeMins && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.estimatedTimeMins}분
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {result.views || 0}
                      </span>
                      {result.avgRating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {result.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* PAGINATION */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
              <span className="text-sm text-zinc-400 px-4">
                <span className="text-white font-bold">{currentPage + 1}</span> / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

      {/* EMPTY STATE */}
      {!query && !isLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">검색어를 입력하세요</h3>
          <p className="text-zinc-400">
            찾고 싶은 튜토리얼, 문서, 스니펫을 검색해보세요.
          </p>
        </div>
      )}
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
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-8 mb-8">
        <div className="h-10 w-64 bg-zinc-800 rounded animate-pulse mx-auto mb-4" />
        <div className="h-6 w-96 bg-zinc-800 rounded animate-pulse mx-auto mb-8" />
        <div className="h-14 max-w-3xl bg-zinc-800 rounded-2xl animate-pulse mx-auto" />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
