'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, BookOpen, Sparkles, ArrowRight, Users, Clock } from 'lucide-react'
import { FaPlug, FaBell, FaDatabase, FaCube, FaKey, FaBolt, FaHammer, FaRocket, FaShieldAlt, FaBox } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

interface GlossaryTerm {
  id: number
  dbId: string
  title: string
  subtitle: string
  analogy: string
  description: string
  category: string
  slug: string
  views: number
  readTime: number
  iconName: string
  iconColor: string
}

// Icon component mapper
const iconMap: Record<string, any> = {
  'FaPlug': FaPlug,
  'FaBell': FaBell,
  'FaDatabase': FaDatabase,
  'FaCube': FaCube,
  'FaKey': FaKey,
  'FaBolt': FaBolt,
  'FaHammer': FaHammer,
  'FaRocket': FaRocket,
  'FaShieldAlt': FaShieldAlt,
  'FaBox': FaBox,
}

interface Category {
  id: string
  name: string
  count: number
  color: string
}

interface GlossaryClientProps {
  glossaryTerms: GlossaryTerm[]
  categories: Category[]
  popularTerms: GlossaryTerm[]
}

export function GlossaryClient({ glossaryTerms, categories, popularTerms }: GlossaryClientProps) {
  const { isSignedIn } = useUser() || { isSignedIn: false }
  const pathname = usePathname()

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
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">V</div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">VibeStack</span>
            </Link>

            {/* Desktop Nav - Sub Tabs */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/docs"
                className={`h-16 flex items-center transition-colors ${
                  pathname === '/docs'
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                전체
              </Link>
              <Link
                href="/docs/guides"
                className={`h-16 flex items-center transition-colors ${
                  pathname.startsWith('/docs/guides')
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                가이드
              </Link>
              <Link
                href="/docs/glossary"
                className={`h-16 flex items-center transition-colors ${
                  pathname.startsWith('/docs/glossary')
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                용어 사전
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserMenu />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-zinc-700 cursor-pointer" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* HERO + SEARCH */}
          <section className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              무엇이 막히셨나요?
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-20 py-4 bg-zinc-900/80 border border-zinc-700 rounded-2xl text-base shadow-xl placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-all backdrop-blur"
                placeholder="검색어를 입력하세요 (예: 'API', '웹훅', '데이터베이스')"
              />
              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-1">Cmd + K</span>
              </div>
            </div>

            {/* Popular Search Terms */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-zinc-500">인기 검색어:</span>
              {popularTerms.slice(0, 3).map((term, idx) => (
                <span key={term.id}>
                  <Link href={`/docs/glossary/${term.slug}`} className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">
                    {term.title}
                  </Link>
                  {idx < Math.min(2, popularTerms.length - 1) && <span className="text-zinc-700 ml-2">•</span>}
                </span>
              ))}
            </div>
          </section>

          {/* POPULAR TERMS */}
          {popularTerms.length > 0 && (
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-white">인기 용어 TOP 5</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTerms.map((term) => {
                  const Icon = iconMap[term.iconName] || FaPlug
                  return (
                    <Link
                      key={term.id}
                      href={`/docs/glossary/${term.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-white transition-colors group"
                    >
                      <Icon className={`w-4 h-4 ${term.iconColor}`} />
                      <span className="font-medium">{term.title}</span>
                      <span className="text-xs text-zinc-500">({term.views.toLocaleString()}명)</span>
                      <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* CATEGORY FILTERS */}
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    cat.id === 'all'
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
                <select className="bg-transparent border-none focus:ring-0 text-zinc-400 cursor-pointer hover:text-white">
                  <option>가나다순</option>
                  <option>인기순</option>
                  <option>최신순</option>
                </select>
              </div>
            </div>

            {/* GLOSSARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {glossaryTerms.map((term) => {
                const Icon = iconMap[term.iconName] || FaPlug
                return (
                  <Link
                    key={term.id}
                    href={`/docs/glossary/${term.slug}`}
                    className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <Icon className={`w-6 h-6 ${term.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">
                          {term.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          비유: {term.analogy}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                      {term.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {term.readTime}분
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {term.views.toLocaleString()}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>

            {glossaryTerms.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-400 mb-2">아직 용어가 없습니다</h3>
                <p className="text-zinc-500">곧 다양한 용어들이 추가될 예정입니다.</p>
              </div>
            )}
          </section>

          {/* CTA BANNER */}
          <section className="py-8">
            <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">찾는 용어가 없으신가요?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                궁금한 용어를 요청해주세요. 24시간 안에 쉬운 설명을 추가해드립니다.
              </p>
              <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-full transition-colors">
                용어 요청하기
              </button>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-12 py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500 font-medium">
              <Link href="/docs" className="hover:text-white transition-colors">문서</Link>
              <Link href="/tutorials" className="hover:text-white transition-colors">튜토리얼</Link>
              <Link href="/snippets" className="hover:text-white transition-colors">스니펫</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
