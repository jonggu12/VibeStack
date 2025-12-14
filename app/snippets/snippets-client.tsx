'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  ChevronDown,
  Folder,
  Lock,
  CreditCard,
  Database,
  Cloud,
  Mail,
  Palette,
  Zap,
  Code2,
  CheckCircle,
  Link2,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'
import { SnippetCard } from './snippet-card'
import type { Snippet } from './actions'

interface SnippetsClientProps {
  snippets: Snippet[]
}

// 카테고리 설정
const CATEGORIES = [
  { value: 'all', label: '전체 카테고리', icon: Folder },
  { value: 'auth', label: 'Auth (인증/권한)', icon: Lock },
  { value: 'payment', label: 'Payment (결제)', icon: CreditCard },
  { value: 'database', label: 'Database (데이터베이스)', icon: Database },
  { value: 'storage', label: 'Storage (파일 저장소)', icon: Cloud },
  { value: 'email', label: 'Email (이메일)', icon: Mail },
  { value: 'ui', label: 'UI (컴포넌트)', icon: Palette },
  { value: 'hooks', label: 'Hooks (유틸리티)', icon: Zap },
  { value: 'api', label: 'API (엔드포인트)', icon: Code2 },
  { value: 'validation', label: 'Validation (검증)', icon: CheckCircle },
  { value: 'integration', label: 'Integration (연동)', icon: Link2 },
]

export function SnippetsClient({ snippets }: SnippetsClientProps) {
  const { isSignedIn } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 필터링 로직
  const filteredSnippets = snippets.filter((snippet) => {
    // 1. 검색어 필터링 (제목, 설명, 태그에서 검색)
    const matchesSearch =
      searchQuery === '' ||
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // 2. 카테고리 필터링 (snippet_category 사용)
    if (activeFilter === 'all') {
      return matchesSearch
    }

    // UI 필터는 'ui-ux'로 저장되어 있지만 DB에는 'ui'로 저장됨
    const categoryMap: Record<string, string> = {
      'ui-ux': 'ui',
    }

    const filterCategory = categoryMap[activeFilter] || activeFilter
    const matchesCategory = snippet.snippet_category === filterCategory

    return matchesSearch && matchesCategory
  })

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
      `}</style>

      <div className="min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-50 glass-header border-b border-zinc-800 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                V
              </div>
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
          {/* HERO: SEARCH & FILTER */}
          <section className="border-b border-zinc-800 pb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">필요한 기능을 골라보세요</h1>
              <p className="text-zinc-400 max-w-2xl">
                로그인, 결제, DB 연결 등 복잡한 기능들을 <strong>"복사-붙여넣기"</strong> 한 번으로 끝내세요.
                AI에게 시킬 프롬프트도 함께 제공됩니다.
              </p>
            </div>

            {/* Search & Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-all"
                  placeholder="기능 검색 (예: 구글 로그인, Stripe 결제, 버튼 컴포넌트)"
                />
              </div>

              {/* Category Dropdown */}
              <div className="sm:w-64 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="block w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white hover:border-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const currentCategory = CATEGORIES.find((cat) => cat.value === activeFilter)
                        const Icon = currentCategory?.icon || Folder
                        return (
                          <>
                            <Icon className="w-4 h-4 text-zinc-400" />
                            <span>{currentCategory?.label || '전체 카테고리'}</span>
                          </>
                        )
                      })()}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.value}
                          onClick={() => {
                            setActiveFilter(category.value)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-colors ${
                            activeFilter === category.value
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{category.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Results Count */}
            {(searchQuery || activeFilter !== 'all') && (
              <div className="mt-4 text-sm text-zinc-400">
                {filteredSnippets.length}개의 스니펫 찾음
              </div>
            )}
          </section>

          {/* MAIN GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-zinc-500 text-lg">검색 결과가 없습니다.</p>
              </div>
            ) : (
              filteredSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))
            )}

            {/* Request New Snippet Card */}
            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[200px] hover:border-zinc-700 hover:bg-zinc-900/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-sm font-bold text-zinc-300 mb-1">찾는 코드가 없나요?</h3>
              <p className="text-xs text-zinc-500 max-w-xs mb-4">
                필요한 기능을 요청하시면 24시간 내에 추가해드립니다.
              </p>
              <button className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-white hover:text-black transition-colors">
                스니펫 요청하기
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-12 py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">
                V
              </div>
              <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500 font-medium">
              <Link href="#" className="hover:text-white transition-colors">
                서비스 소개
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
