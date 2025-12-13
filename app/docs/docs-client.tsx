'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Clock, BookOpen, Lock, ChevronDown } from 'lucide-react'
import { FaRocket, FaCode, FaLightbulb, FaBug, FaBook } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'
import type { Doc, DocCategory } from './page'

interface DocsClientProps {
  docs: Doc[]
  categoryCounts: {
    all: number
    'getting-started': number
    implementation: number
    prompts: number
    errors: number
    concepts: number
  }
  selectedCategory?: DocCategory
}

// Category 설정
type CategoryConfig = {
  icon: IconType
  label: string
  color: string
  bgColor: string
  borderColor: string
  countActiveTextColor?: string
}

const CATEGORY_CONFIG: Record<'all' | DocCategory, CategoryConfig> = {
  all: {
    icon: FaBook,
    label: '전체',
    color: 'text-white',
    bgColor: 'bg-white',
    borderColor: 'border-white',
    countActiveTextColor: 'text-black',
  },
  'getting-started': {
    icon: FaRocket,
    label: '시작 가이드',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
  },
  implementation: {
    icon: FaCode,
    label: '기능 구현',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/50',
  },
  prompts: {
    icon: FaLightbulb,
    label: '프롬프트',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
  },
  errors: {
    icon: FaBug,
    label: '에러 해결',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
  },
  concepts: {
    icon: BookOpen,
    label: '개념 & 용어',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
  },
} as const

// 섹션 설정 (표시 순서와 메타데이터)
const SECTION_CONFIG = [
  {
    key: 'errors' as const,
    title: '🚨 자주 발생하는 에러 해결',
    description: '90%가 겪는 에러, 1분 안에 해결하세요',
    accentColor: 'bg-red-500',
    gridCols: 'grid-cols-1 md:grid-cols-3',
  },
  {
    key: 'prompts' as const,
    title: '💬 프롬프트 작성법',
    description: 'AI한테 정확하게 말하는 방법',
    accentColor: 'bg-indigo-500',
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  {
    key: 'getting-started' as const,
    title: '🚀 시작 가이드',
    description: '처음 시작하는 분들을 위한 필수 가이드',
    accentColor: 'bg-blue-500',
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  {
    key: 'implementation' as const,
    title: '🔨 기능 구현 가이드',
    description: '실전 기능 구현 단계별 가이드',
    accentColor: 'bg-purple-500',
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  {
    key: 'concepts' as const,
    title: '📖 개념 & 용어',
    description: '비개발자도 이해하는 쉬운 용어 설명',
    accentColor: 'bg-emerald-500',
    gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  },
]

// Difficulty 라벨
function getDifficultyLabel(difficulty: string) {
  if (difficulty === 'beginner') return { label: '초급', color: 'text-emerald-400' }
  if (difficulty === 'intermediate') return { label: '중급', color: 'text-yellow-500' }
  if (difficulty === 'advanced') return { label: '고급', color: 'text-red-400' }
  return { label: '입문', color: 'text-zinc-400' }
}

export function DocsClient({ docs, categoryCounts, selectedCategory }: DocsClientProps) {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  const queryCategory = searchParams.get('category')
  const activeCategory = useMemo<DocCategory | 'all'>(() => {
    const isValidDocCategory = (category: string): category is DocCategory =>
      ['getting-started', 'implementation', 'prompts', 'errors', 'concepts'].includes(category as DocCategory)

    if (queryCategory && isValidDocCategory(queryCategory)) {
      return queryCategory
    }

    if (selectedCategory && isValidDocCategory(selectedCategory)) {
      return selectedCategory
    }

    return 'all'
  }, [queryCategory, selectedCategory])

  // 필터링된 docs
  const filteredDocs = useMemo(() => {
    let result = docs

    // 카테고리 필터
    if (activeCategory !== 'all') {
      result = result.filter(doc => doc.category === activeCategory)
    }

    // 난이도 필터
    if (difficultyFilter !== 'all') {
      result = result.filter(doc => doc.difficulty === difficultyFilter)
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [docs, activeCategory, difficultyFilter, searchQuery])

  // 카테고리별로 문서 그룹핑
  const docsByCategory = useMemo(() => ({
    errors: docs.filter(d => d.category === 'errors'),
    prompts: docs.filter(d => d.category === 'prompts'),
    'getting-started': docs.filter(d => d.category === 'getting-started'),
    implementation: docs.filter(d => d.category === 'implementation'),
    concepts: docs.filter(d => d.category === 'concepts'),
  }), [docs])

  // 섹션별 표시 여부 (전체 보기 + 필터 없음 + 검색 없음)
  const showSectionView = activeCategory === 'all' && difficultyFilter === 'all' && !searchQuery.trim()

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      router.push('/docs')
    } else {
      router.push(`/docs?category=${category}`)
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #09090b;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }

        .glass-header {
          background: rgba(9, 9, 11, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .category-tab-active {
          background: rgba(255, 255, 255, 0.1);
          border-bottom: 2px solid white;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-50 glass-header border-b border-zinc-800 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">V</div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">VibeStack</span>
            </Link>

            <div className="flex items-center gap-4 ml-auto">
              {isSignedIn ? (
                <UserMenu />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-zinc-700 cursor-pointer" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* HERO: 검색 */}
          <section className="text-center py-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              무엇을 배우고 싶으신가요?
            </h1>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-base placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white transition-all shadow-lg"
                placeholder="검색어를 입력하세요 (예: '환경변수 설정', '에러 해결')"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
              <span className="text-zinc-500">인기 검색어:</span>
              <button className="text-zinc-400 hover:text-white hover:underline underline-offset-4">Next.js 시작하기</button>
              <span className="text-zinc-700">•</span>
              <button className="text-zinc-400 hover:text-white hover:underline underline-offset-4">Supabase 연결</button>
              <span className="text-zinc-700">•</span>
              <button className="text-zinc-400 hover:text-white hover:underline underline-offset-4">프롬프트 작성</button>
            </div>
          </section>

          {/* 카테고리 탭 (Horizontal Scroll) */}
          <section className="border-b border-zinc-800 pb-0 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max mx-auto justify-center">
              {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
                const config = CATEGORY_CONFIG[cat]
                const Icon = config.icon
                const count = cat === 'all' ? categoryCounts.all : categoryCounts[cat as DocCategory]
                const isActive = activeCategory === cat

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? `${config.color} border-b-2 ${config.borderColor}`
                        : 'text-zinc-400 hover:text-white border-b-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive
                          ? `${config.bgColor} ${config.countActiveTextColor ?? ''}`
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 통계 & 필터 */}
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-zinc-400">
              총 <span className="font-bold text-white">{filteredDocs.length}개</span>의 문서
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="appearance-none bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">모든 난이도</option>
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* 문서 표시: 섹션 뷰 or 그리드 뷰 */}
          {showSectionView ? (
            // ===== 섹션 뷰 (전체 보기) =====
            <div className="space-y-16">
              {SECTION_CONFIG.map((section) => {
                const sectionDocs = docsByCategory[section.key]
                if (sectionDocs.length === 0) return null

                return (
                  <section key={section.key}>
                    {/* 섹션 헤더 */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-6 ${section.accentColor} rounded-full`} />
                      <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">{section.description}</p>

                    {/* 섹션 그리드 */}
                    <div className={`grid ${section.gridCols} gap-6`}>
                      {sectionDocs.map((doc, index) => {
                        const difficultyInfo = getDifficultyLabel(doc.difficulty)
                        const categoryConfig = CATEGORY_CONFIG[doc.category]
                        const isGlossaryStyle = !!doc.termCategory

                        // === 에러 해결 카드 (터미널 스타일) ===
                        if (section.key === 'errors') {
                          return (
                            <Link
                              key={doc.id}
                              href={`/docs/${doc.slug}`}
                              className="group relative bg-[#1e1e1e] rounded-xl border border-zinc-800 hover:border-red-500/50 transition-all overflow-hidden shadow-lg"
                            >
                              {/* Terminal Header */}
                              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-zinc-700">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                <span className="ml-auto text-[10px] text-zinc-500 font-mono">Terminal</span>
                              </div>
                              {/* Content */}
                              <div className="p-5">
                                {/* Error Message Preview */}
                                <div className="font-mono text-red-400 text-xs bg-red-500/10 p-2 rounded mb-3 border border-red-500/20 truncate">
                                  Error: {doc.title.substring(0, 30)}...
                                </div>
                                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-red-400 transition-colors mb-2">
                                  {doc.title}
                                </h3>
                                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{doc.description}</p>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                  <Clock className="w-3 h-3" /> {doc.estimatedTime}분 소요
                                </div>
                              </div>
                            </Link>
                          )
                        }

                        // === 프롬프트 카드 (챗 스타일) ===
                        if (section.key === 'prompts') {
                          const isFirstPrompt = index === 0

                          if (isFirstPrompt) {
                            // Highlighted Card (2x1)
                            return (
                              <Link
                                key={doc.id}
                                href={`/docs/${doc.slug}`}
                                className="group col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-500 transition-all relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <div className="text-8xl text-indigo-400">🤖</div>
                                </div>
                                <div className="relative z-10">
                                  <span className="inline-block px-2 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded mb-3">
                                    MUST READ
                                  </span>
                                  <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
                                  <p className="text-zinc-400 text-sm mb-6 max-w-sm line-clamp-2">
                                    {doc.description}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                      <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-900"></div>
                                      <div className="w-6 h-6 rounded-full bg-zinc-600 border border-zinc-900"></div>
                                    </div>
                                    <span className="text-xs text-zinc-500">{doc.views} views</span>
                                  </div>
                                </div>
                              </Link>
                            )
                          } else {
                            // Standard Prompt Card
                            return (
                              <Link
                                key={doc.id}
                                href={`/docs/${doc.slug}`}
                                className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4 group-hover:bg-zinc-700 group-hover:text-white transition-colors">
                                    <categoryConfig.icon className="w-5 h-5" />
                                  </div>
                                  <h3 className="text-base font-bold text-zinc-100 mb-2 line-clamp-2">{doc.title}</h3>
                                  <p className="text-xs text-zinc-500 line-clamp-2">{doc.description}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                  <span className="text-[10px] text-zinc-500">{difficultyInfo.label}</span>
                                  <div className="text-zinc-600 text-xs group-hover:translate-x-1 transition-transform">→</div>
                                </div>
                              </Link>
                            )
                          }
                        }

                        // === 개념&용어 카드 (플래시카드 스타일) ===
                        if (section.key === 'concepts') {
                          return (
                            <Link
                              key={doc.id}
                              href={`/docs/${doc.slug}`}
                              className="group bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 hover:border-emerald-500/50 rounded-xl p-4 transition-all hover:-translate-y-1"
                            >
                              {isGlossaryStyle && doc.termCategory && (
                                <span className="text-[10px] font-bold text-emerald-500 mb-1 block">
                                  {doc.termCategory}
                                </span>
                              )}
                              <h3 className="text-lg font-bold text-white mb-2">{doc.title}</h3>
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                {isGlossaryStyle && doc.analogy ? (
                                  <>
                                    "{doc.analogy}"<br />
                                    <span className="text-zinc-600 text-[10px] block mt-1 line-clamp-2">
                                      {doc.description}
                                    </span>
                                  </>
                                ) : (
                                  <span className="line-clamp-3">{doc.description}</span>
                                )}
                              </p>
                            </Link>
                          )
                        }

                        // === 기본 카드 (시작 가이드, 기능 구현) ===
                        return (
                          <Link
                            key={doc.id}
                            href={`/docs/${doc.slug}`}
                            className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
                          >
                            {/* 카테고리 아이콘 섹션 */}
                            <div className={`h-32 ${categoryConfig.bgColor} relative overflow-hidden flex items-center justify-center`}>
                              <categoryConfig.icon className={`w-16 h-16 ${categoryConfig.color} opacity-30 group-hover:opacity-50 transition-opacity`} />
                              {doc.isPremium && (
                                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-purple-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> 프리미엄
                                </div>
                              )}
                              {isGlossaryStyle && (
                                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                  용어사전
                                </div>
                              )}
                            </div>

                            {/* 컨텐츠 */}
                            <div className="p-5">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded ${categoryConfig.bgColor} ${categoryConfig.color}`}>
                                  {categoryConfig.label}
                                </span>
                                {isGlossaryStyle && doc.termCategory && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                    {doc.termCategory}
                                  </span>
                                )}
                                <span className={`text-xs ${difficultyInfo.color}`}>
                                  {difficultyInfo.label}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                {doc.title}
                              </h3>

                              {isGlossaryStyle && doc.synonyms && doc.synonyms.length > 0 && (
                                <p className="text-xs text-zinc-500 mb-2">
                                  동의어: {doc.synonyms.join(', ')}
                                </p>
                              )}

                              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                                {doc.description}
                              </p>

                              {isGlossaryStyle && doc.analogy && (
                                <p className="text-xs text-indigo-400 italic mb-3 line-clamp-1">
                                  💡 "{doc.analogy}"
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {doc.estimatedTime}분
                                </span>
                                <span>{doc.views} views</span>
                              </div>

                              {isGlossaryStyle && doc.relatedTerms && doc.relatedTerms.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-zinc-800">
                                  <p className="text-xs text-zinc-500 mb-1">관련 용어:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {doc.relatedTerms.slice(0, 3).map((term, idx) => (
                                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                        {term}
                                      </span>
                                    ))}
                                    {doc.relatedTerms.length > 3 && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                                        +{doc.relatedTerms.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            // ===== 그리드 뷰 (필터/검색 사용시) =====
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => {
                const difficultyInfo = getDifficultyLabel(doc.difficulty)
                const categoryConfig = CATEGORY_CONFIG[doc.category]
                const isGlossaryStyle = !!doc.termCategory

                return (
                  <Link
                    key={doc.id}
                    href={`/docs/${doc.slug}`}
                    className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`h-32 ${categoryConfig.bgColor} relative overflow-hidden flex items-center justify-center`}>
                      <categoryConfig.icon className={`w-16 h-16 ${categoryConfig.color} opacity-30 group-hover:opacity-50 transition-opacity`} />
                      {doc.isPremium && (
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-purple-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 프리미엄
                        </div>
                      )}
                      {isGlossaryStyle && (
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-yellow-400 text-xs font-bold px-2 py-1 rounded">
                          용어사전
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded ${categoryConfig.bgColor} ${categoryConfig.color}`}>
                          {categoryConfig.label}
                        </span>
                        {isGlossaryStyle && doc.termCategory && (
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {doc.termCategory}
                          </span>
                        )}
                        <span className={`text-xs ${difficultyInfo.color}`}>
                          {difficultyInfo.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {doc.title}
                      </h3>

                      {isGlossaryStyle && doc.synonyms && doc.synonyms.length > 0 && (
                        <p className="text-xs text-zinc-500 mb-2">
                          동의어: {doc.synonyms.join(', ')}
                        </p>
                      )}

                      <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                        {doc.description}
                      </p>

                      {isGlossaryStyle && doc.analogy && (
                        <p className="text-xs text-indigo-400 italic mb-3 line-clamp-1">
                          💡 "{doc.analogy}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {doc.estimatedTime}분
                        </span>
                        <span>{doc.views} views</span>
                      </div>

                      {isGlossaryStyle && doc.relatedTerms && doc.relatedTerms.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-800">
                          <p className="text-xs text-zinc-500 mb-1">관련 용어:</p>
                          <div className="flex flex-wrap gap-1">
                            {doc.relatedTerms.slice(0, 3).map((term, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {term}
                              </span>
                            ))}
                            {doc.relatedTerms.length > 3 && (
                              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-500">
                                +{doc.relatedTerms.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </section>
          )}

          {/* Empty State */}
          {filteredDocs.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">
                {searchQuery ? '검색 결과가 없습니다' : '아직 문서가 없습니다'}
              </h3>
              <p className="text-zinc-500 mb-6">
                {searchQuery
                  ? '다른 검색어로 시도해보세요.'
                  : '곧 다양한 문서가 추가될 예정입니다.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-full transition-colors"
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-12 py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500 font-medium">
              <Link href="/tutorials" className="hover:text-white transition-colors">튜토리얼</Link>
              <Link href="/snippets" className="hover:text-white transition-colors">스니펫</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
