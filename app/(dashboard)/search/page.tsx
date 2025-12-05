'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Clock, Eye, Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Sparkles, BookOpen, Code2, FileText, Layers, Zap, TrendingUp, Calendar } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'
import type { AlgoliaContentRecord } from '@/lib/algolia'

type FilterType = 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary' | null
type FilterDifficulty = 'beginner' | 'intermediate' | 'advanced' | null
type FilterStack = 'nextjs' | 'react' | 'clerk' | 'supabase' | 'stripe' | 'tailwind' | 'uploadthing' | 'resend' | null
type FilterTime = 'quick' | 'medium' | 'long' | null
type SortBy = 'relevance' | 'popular' | 'rating' | 'newest' | null

const typeConfig = {
  doc: { icon: FileText, label: '문서', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  tutorial: { icon: BookOpen, label: '튜토리얼', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  snippet: { icon: Code2, label: '스니펫', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  bundle: { icon: Layers, label: '번들', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  glossary: { icon: Sparkles, label: '용어사전', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
}

const difficultyConfig = {
  beginner: { label: '입문', emoji: '🌱', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  intermediate: { label: '중급', emoji: '⚡', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  advanced: { label: '고급', emoji: '🔥', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const stackConfig = {
  nextjs: { label: 'Next.js', emoji: '⚡', color: 'bg-white/10 text-white border-white/20' },
  react: { label: 'React', emoji: '⚛️', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  clerk: { label: 'Clerk', emoji: '🔐', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  supabase: { label: 'Supabase', emoji: '🗄️', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  stripe: { label: 'Stripe', emoji: '💳', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  tailwind: { label: 'Tailwind', emoji: '🎨', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  uploadthing: { label: 'Uploadthing', emoji: '📤', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  resend: { label: 'Resend', emoji: '✉️', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
}

const timeConfig = {
  quick: { label: '빠름 (<30분)', emoji: '⚡', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  medium: { label: '보통 (30분-1시간)', emoji: '⏱️', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  long: { label: '긴편 (1시간+)', emoji: '🕐', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
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
  const [filterStack, setFilterStack] = useState<FilterStack>(null)
  const [filterTime, setFilterTime] = useState<FilterTime>(null)
  const [sortBy, setSortBy] = useState<SortBy>('relevance')
  const [freeOnly, setFreeOnly] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
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
      performSearch()
    }
  }

  const performSearch = () => {
    search(searchInput, {
      type: filterType || undefined,
      difficulty: filterDifficulty || undefined
    })
  }

  const handleFilterChange = (
    type: FilterType = filterType,
    difficulty: FilterDifficulty = filterDifficulty
  ) => {
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

  const activeBasicFiltersCount = [filterType, filterDifficulty].filter(Boolean).length
  const activeAdvancedFiltersCount = [filterStack, filterTime, sortBy !== 'relevance' ? sortBy : null, freeOnly ? 'free' : null].filter(Boolean).length

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
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
      </section>

      {/* FILTERS */}
      <section className="max-w-5xl mx-auto space-y-4">
        {/* Basic Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-zinc-800">
          {/* Type Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilterChange(null, filterDifficulty)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                filterType === null
                  ? 'bg-zinc-700 text-white border-zinc-600'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600'
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
                  onClick={() => handleFilterChange(type as FilterType, filterDifficulty)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    isActive ? config.color : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              )
            })}
          </div>

          <div className="w-px h-6 bg-zinc-700" />

          {/* Difficulty Filters */}
          <div className="flex items-center gap-2">
            {Object.entries(difficultyConfig).map(([difficulty, config]) => {
              const isActive = filterDifficulty === difficulty
              return (
                <button
                  key={difficulty}
                  onClick={() => handleFilterChange(filterType, isActive ? null : difficulty as FilterDifficulty)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    isActive ? config.color : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <span>{config.emoji}</span>
                  {config.label}
                </button>
              )
            })}
          </div>

          <div className="w-px h-6 bg-zinc-700" />

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ml-auto ${
              showAdvancedFilters
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-600'
            }`}
          >
            {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            고급 필터
            {activeAdvancedFiltersCount > 0 && (
              <span className="bg-white text-black rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                {activeAdvancedFiltersCount}
              </span>
            )}
          </button>

          {(activeBasicFiltersCount > 0 || activeAdvancedFiltersCount > 0) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-red-500 hover:text-red-400 transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
            {/* Stack Filters */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">스택 / 기술</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stackConfig).map(([stack, config]) => {
                  const isActive = filterStack === stack
                  return (
                    <button
                      key={stack}
                      onClick={() => setFilterStack(isActive ? null : stack as FilterStack)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                        isActive ? config.color : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <span>{config.emoji}</span>
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Sort & Time Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Sort */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">정렬</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sortConfig).map(([sort, config]) => {
                    const Icon = config.icon
                    const isActive = sortBy === sort
                    return (
                      <button
                        key={sort}
                        onClick={() => setSortBy(isActive ? 'relevance' : sort as SortBy)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          isActive
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">예상 소요 시간</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(timeConfig).map(([time, config]) => {
                    const isActive = filterTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setFilterTime(isActive ? null : time as FilterTime)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                          isActive ? config.color : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <span>{config.emoji}</span>
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Free Only Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">무료 콘텐츠만 보기</h3>
                <p className="text-xs text-zinc-500">Pro 콘텐츠를 제외하고 검색합니다</p>
              </div>
              <button
                onClick={() => setFreeOnly(!freeOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  freeOnly ? 'bg-indigo-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    freeOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ERROR */}
      {error && (
        <div className="max-w-5xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* RESULTS SUMMARY */}
      {query && !isLoading && (
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
          <p className="text-zinc-400">
            <span className="text-white font-bold">&quot;{query}&quot;</span>에 대한 검색 결과{' '}
            <span className="text-white font-bold">{totalHits}개</span>
            {processingTime && <span className="text-zinc-600"> ({processingTime}ms)</span>}
          </p>
        </div>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4">
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
        <div className="max-w-5xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">검색 결과가 없습니다</h3>
          <p className="text-zinc-400 mb-6">
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

      {!isLoading && results.length > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4">
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
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border ${diffConfig.color}`}>
                        <span>{diffConfig.emoji}</span>
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
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 pt-8">
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
        <div className="max-w-5xl mx-auto text-center py-16">
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
