'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, Eye, Star, ChevronLeft, ChevronRight, ChevronDown, Sparkles, BookOpen, Code2, FileText, Layers, Zap, TrendingUp, Calendar, Sprout, Flame, Atom, Lock, Database, CreditCard, Palette, Upload, Mail, Timer } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import type { AlgoliaContentRecord } from '@/lib/algolia'

type FilterType = 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary' | null
type FilterDifficulty = 'beginner' | 'intermediate' | 'advanced' | null
type FilterStack = 'nextjs' | 'react' | 'clerk' | 'supabase' | 'stripe' | 'tailwind' | 'uploadthing' | 'resend' | null
type FilterTime = 'quick' | 'medium' | 'long' | null
type SortBy = 'relevance' | 'popular' | 'rating' | 'newest'

const typeConfig = {
  doc: { icon: FileText, label: '문서', color: 'text-blue-400 border-blue-400' },
  tutorial: { icon: BookOpen, label: '튜토리얼', color: 'text-indigo-400 border-indigo-400' },
  snippet: { icon: Code2, label: '스니펫', color: 'text-emerald-400 border-emerald-400' },
  bundle: { icon: Layers, label: '번들', color: 'text-purple-400 border-purple-400' },
  glossary: { icon: Sparkles, label: '용어사전', color: 'text-cyan-400 border-cyan-400' },
}

const difficultyConfig = {
  beginner: { label: '입문', icon: Sprout },
  intermediate: { label: '중급', icon: Zap },
  advanced: { label: '고급', icon: Flame },
}

const stackConfig = {
  nextjs: { label: 'Next.js', icon: Zap },
  react: { label: 'React', icon: Atom },
  clerk: { label: 'Clerk', icon: Lock },
  supabase: { label: 'Supabase', icon: Database },
  stripe: { label: 'Stripe', icon: CreditCard },
  tailwind: { label: 'Tailwind', icon: Palette },
  uploadthing: { label: 'Uploadthing', icon: Upload },
  resend: { label: 'Resend', icon: Mail },
}

const timeConfig = {
  quick: { label: '30분 미만', icon: Zap },
  medium: { label: '30분-1시간', icon: Clock },
  long: { label: '1시간 이상', icon: Timer },
}

const sortConfig = {
  relevance: { label: '관련도순', icon: Search },
  popular: { label: '인기순', icon: TrendingUp },
  rating: { label: '평점순', icon: Star },
  newest: { label: '최신순', icon: Calendar },
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
      return `/docs/${content.slug}`
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
  const [filterStack, setFilterStack] = useState<FilterStack>(null)
  const [filterTime, setFilterTime] = useState<FilterTime>(null)
  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [freeOnly, setFreeOnly] = useState(false)
  const [hasInitialSearched, setHasInitialSearched] = useState(false)

  // Dropdown states
  const [stackDropdownOpen, setStackDropdownOpen] = useState(false)
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

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
      performSearch()
    }
  }

  const performSearch = () => {
    search(searchInput, {
      type: filterType || undefined,
      difficulty: filterDifficulty || undefined
    })
  }

  const handleTypeChange = (type: FilterType) => {
    setFilterType(type)
    if (query) {
      search(query, { type: type || undefined, difficulty: filterDifficulty || undefined })
    }
  }

  const handlePageChange = (page: number) => {
    search(query, { type: filterType || undefined, difficulty: filterDifficulty || undefined }, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAllFilters = () => {
    setFilterType(null)
    setFilterDifficulty(null)
    setFilterStack(null)
    setFilterTime(null)
    setSortBy('relevance')
    setFreeOnly(false)
    if (query) {
      search(query, {})
    }
  }

  const hasActiveFilters = filterType || filterDifficulty || filterStack || filterTime || sortBy !== 'relevance' || freeOnly

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* TOP BAR: Type Tabs + Sort */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
        {/* Type Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleTypeChange(null)}
            className={`text-sm font-medium transition-colors pb-2 border-b-2 ${
              filterType === null
                ? 'text-white border-indigo-400'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            전체
          </button>
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon
            const isActive = filterType === type
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type as FilterType)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors pb-2 border-b-2 ${
                  isActive
                    ? `text-white ${config.color}`
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            )
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 rounded-lg transition-colors"
          >
            정렬: {sortConfig[sortBy].label}
            <ChevronDown className="w-4 h-4" />
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">
              {Object.entries(sortConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key as SortBy)
                      setSortDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      sortBy === key
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* SEARCH BAR + FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-all"
              placeholder="검색어를 입력하세요..."
            />
          </div>
        </form>

        {/* Stack Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStackDropdownOpen(!stackDropdownOpen)}
            className={`w-full md:w-auto flex items-center gap-2 px-4 py-2.5 text-sm transition-colors bg-zinc-900 border rounded-lg ${
              filterStack
                ? 'text-white border-indigo-500'
                : 'text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {filterStack ? stackConfig[filterStack].label : '스택 선택'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {stackDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <button
                onClick={() => {
                  setFilterStack(null)
                  setStackDropdownOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  !filterStack
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                전체
              </button>
              {Object.entries(stackConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFilterStack(key as FilterStack)
                      setStackDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      filterStack === key
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
            className={`w-full md:w-auto flex items-center gap-2 px-4 py-2.5 text-sm transition-colors bg-zinc-900 border rounded-lg ${
              filterDifficulty
                ? 'text-white border-indigo-500'
                : 'text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {filterDifficulty ? difficultyConfig[filterDifficulty].label : '난이도'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {difficultyDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setFilterDifficulty(null)
                  setDifficultyDropdownOpen(false)
                  if (query) {
                    search(query, { type: filterType || undefined, difficulty: undefined })
                  }
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  !filterDifficulty
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                전체
              </button>
              {Object.entries(difficultyConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => {
                      const difficulty = key as FilterDifficulty
                      setFilterDifficulty(difficulty)
                      setDifficultyDropdownOpen(false)
                      if (query) {
                        search(query, { type: filterType || undefined, difficulty: difficulty || undefined })
                      }
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      filterDifficulty === key
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Time Dropdown */}
        <div className="relative">
          <button
            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            className={`w-full md:w-auto flex items-center gap-2 px-4 py-2.5 text-sm transition-colors bg-zinc-900 border rounded-lg ${
              filterTime
                ? 'text-white border-indigo-500'
                : 'text-zinc-400 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {filterTime ? timeConfig[filterTime].label : '시간'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {timeDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setFilterTime(null)
                  setTimeDropdownOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  !filterTime
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                전체
              </button>
              {Object.entries(timeConfig).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFilterTime(key as FilterTime)
                      setTimeDropdownOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                      filterTime === key
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Free Only Toggle */}
        <button
          onClick={() => setFreeOnly(!freeOnly)}
          className={`w-full md:w-auto px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border ${
            freeOnly
              ? 'bg-indigo-500 text-white border-indigo-500'
              : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600'
          }`}
        >
          무료만
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* RESULTS SUMMARY */}
      {query && !isLoading && (
        <div className="flex items-center justify-between text-sm mb-4">
          <p className="text-zinc-400">
            <span className="text-white font-medium">&quot;{query}&quot;</span>에 대한 검색 결과{' '}
            <span className="text-white font-medium">{totalHits}개</span>
            {processingTime && <span className="text-zinc-600"> ({processingTime}ms)</span>}
          </p>
        </div>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-zinc-800 rounded w-1/2 mb-4" />
              <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
              <div className="h-3 bg-zinc-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* NO RESULTS */}
      {!isLoading && query && results.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">검색 결과가 없습니다</h3>
          <p className="text-sm text-zinc-400 mb-6">
            &quot;{query}&quot;에 대한 결과를 찾을 수 없습니다.
          </p>
          <button
            onClick={clearAllFilters}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            필터를 초기화하고 다시 검색해보세요 →
          </button>
        </div>
      )}

      {/* RESULTS */}
      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {results.map((result) => {
            const config = typeConfig[result.type]
            const diffConfig = result.difficulty ? difficultyConfig[result.difficulty] : null
            const Icon = config.icon
            const DiffIcon = diffConfig?.icon

            return (
              <Link
                key={result.objectID}
                href={getContentUrl(result)}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  {diffConfig && DiffIcon && (
                    <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
                      <DiffIcon className="w-3 h-3" />
                      {diffConfig.label}
                    </span>
                  )}
                  {result.isPremium && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                      Pro
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                  {result.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                  {result.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  {result.estimatedTimeMins && result.estimatedTimeMins > 0 && (
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
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </button>
          <span className="text-sm text-zinc-400 px-3">
            <span className="text-white font-medium">{currentPage + 1}</span> / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
          <h3 className="text-lg font-bold text-white mb-2">검색어를 입력하세요</h3>
          <p className="text-sm text-zinc-400">
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="h-10 w-full bg-zinc-800 rounded animate-pulse mb-6" />
      <div className="h-12 w-full bg-zinc-800 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}
