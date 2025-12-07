'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Clock, Users, ArrowRight, BookOpen, Wrench, Rocket, Bug } from 'lucide-react'
import { FaReact, FaLock, FaDatabase as FaDb, FaCog, FaExclamationTriangle, FaBug, FaTimesCircle, FaSyncAlt, FaCode, FaBolt } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

interface Guide {
  id: string
  title: string
  description: string
  slug: string
  category: string
  iconName: string
  gradient: string
  readTime: number
  views: number
  tags: string[]
}

// Icon mapper
const iconMap: Record<string, any> = {
  'FaReact': FaReact,
  'FaLock': FaLock,
  'FaDb': FaDb,
  'FaCog': FaCog,
  'FaExclamationTriangle': FaExclamationTriangle,
  'FaBug': FaBug,
  'FaTimesCircle': FaTimesCircle,
  'FaSyncAlt': FaSyncAlt,
  'FaCode': FaCode,
  'FaBolt': FaBolt,
}

interface GuidesClientProps {
  gettingStarted: Guide[]
  development: Guide[]
  errorSolving: Guide[]
  deployment: Guide[]
}

export function GuidesClient({ gettingStarted, development, errorSolving, deployment }: GuidesClientProps) {
  const { isSignedIn } = useUser()
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

        .gradient-1 { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
        .gradient-2 { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); }
        .gradient-3 { background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%); }
        .gradient-4 { background: linear-gradient(135deg, #dc2626 0%, #e11d48 100%); }
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
                placeholder="검색어를 입력하세요 (예: '환경변수 설정', '배포 에러', 'use client')"
              />
              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-1">Cmd + K</span>
              </div>
            </div>

            {/* Popular Search Terms */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-zinc-500">인기 검색어:</span>
              <Link href="/docs/module-not-found" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">Module not found</Link>
              <span className="text-zinc-700">•</span>
              <Link href="/docs/supabase-setup" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">Supabase 연결</Link>
              <span className="text-zinc-700">•</span>
              <Link href="/docs/first-prompt" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">프롬프트 공식</Link>
            </div>
          </section>

          {/* FILTERS */}
          <section>
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
              <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold shadow-lg shadow-white/10">
                전체보기
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🚀 시작하기
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🛠️ 개발
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🐛 에러 해결
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                📦 배포
              </button>

              <div className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
                <select className="bg-transparent border-none focus:ring-0 text-zinc-400 cursor-pointer hover:text-white">
                  <option>인기순</option>
                  <option>최신순</option>
                  <option>조회순</option>
                </select>
              </div>
            </div>

            {/* GUIDE GRID */}
            <div className="space-y-10">
              {/* Section 1: Getting Started */}
              {gettingStarted.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">시작하기</h2>
                      <p className="text-sm text-zinc-500">개발 환경 설정부터 첫 프로젝트까지</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gettingStarted.map((guide) => {
                      const Icon = iconMap[guide.iconName] || FaCode
                      return (
                        <Link key={guide.id} href={`/docs/${guide.slug}`} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all hover:-translate-y-0.5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${guide.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">{guide.title}</h3>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                            {guide.description}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}분</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guide.views.toLocaleString()}명</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: Development */}
              {development.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">개발</h2>
                      <p className="text-sm text-zinc-500">기능 추가부터 DB 연결까지</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {development.map((guide) => {
                      const Icon = iconMap[guide.iconName] || FaCode
                      return (
                        <Link key={guide.id} href={`/docs/${guide.slug}`} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all hover:-translate-y-0.5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${guide.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{guide.title}</h3>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                            {guide.description}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}분</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guide.views.toLocaleString()}명</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Error Solving */}
              {errorSolving.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Bug className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">에러 해결</h2>
                      <p className="text-sm text-zinc-500">자주 발생하는 에러 빠른 해결법</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {errorSolving.map((guide) => {
                      const Icon = iconMap[guide.iconName] || FaCode
                      return (
                        <Link key={guide.id} href={`/docs/${guide.slug}`} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5 transition-all hover:-translate-y-0.5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${guide.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-zinc-100 group-hover:text-red-400 transition-colors">{guide.title}</h3>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                            {guide.description}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {guide.readTime}분</span>
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guide.views.toLocaleString()}명</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="py-8">
            <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">찾는 가이드가 없으신가요?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                궁금한 내용을 요청해주세요. 24시간 안에 가이드를 작성해드립니다.
              </p>
              <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-full transition-colors">
                가이드 요청하기
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
