'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, BookOpen, Sparkles, ArrowRight, Users, Clock } from 'lucide-react'
import { FaPlug, FaBell, FaDatabase, FaCube, FaKey, FaBolt, FaHammer, FaRocket, FaShieldAlt, FaBox } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

export default function GlossaryPage() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  // 용어 데이터 (나중에 DB에서 가져올 예정)
  const glossaryTerms = [
    {
      id: 1,
      title: 'API',
      subtitle: 'API가 뭐예요?',
      analogy: '음식점 주문',
      description: '프로그램끼리 대화하는 방법. 음식점에서 종업원을 통해 주문하는 것처럼!',
      category: 'basic',
      slug: 'api',
      views: 2340,
      readTime: 2,
      icon: FaPlug,
      iconColor: 'text-blue-400'
    },
    {
      id: 2,
      title: '웹훅 (Webhook)',
      subtitle: '웹훅이 뭐예요?',
      analogy: '택배 알림',
      description: '뭔가 일어났을 때 자동으로 알려주는 시스템. 택배 도착 문자처럼!',
      category: 'basic',
      slug: 'webhook',
      views: 1823,
      readTime: 2,
      icon: FaBell,
      iconColor: 'text-yellow-400'
    },
    {
      id: 3,
      title: '데이터베이스',
      subtitle: '데이터베이스가 뭐예요?',
      analogy: '엑셀 파일',
      description: '데이터를 저장하는 곳. 온라인 엑셀 파일이라고 생각하면 돼요.',
      category: 'basic',
      slug: 'database',
      views: 1562,
      readTime: 2,
      icon: FaDatabase,
      iconColor: 'text-emerald-400'
    },
    {
      id: 4,
      title: '컴포넌트',
      subtitle: '컴포넌트가 뭐예요?',
      analogy: '레고 블록',
      description: '재사용 가능한 UI 조각. 레고 블록처럼 조립해서 화면을 만들어요.',
      category: 'nextjs',
      slug: 'component',
      views: 1892,
      readTime: 2,
      icon: FaCube,
      iconColor: 'text-indigo-400'
    },
    {
      id: 5,
      title: '환경변수',
      subtitle: '환경변수가 뭐예요?',
      analogy: '비밀 메모',
      description: 'API 키 같은 비밀 정보를 저장하는 곳. 코드에 직접 안 쓰고 따로 보관해요.',
      category: 'tools',
      slug: 'env-variables',
      views: 1234,
      readTime: 2,
      icon: FaKey,
      iconColor: 'text-orange-400'
    },
    {
      id: 6,
      title: 'SSR vs CSR',
      subtitle: 'SSR과 CSR이 뭐예요?',
      analogy: '주문 방식',
      description: '서버에서 만들기 vs 브라우저에서 만들기. 주방 조리 vs 테이블 조리!',
      category: 'nextjs',
      slug: 'ssr-csr',
      views: 982,
      readTime: 3,
      icon: FaBolt,
      iconColor: 'text-purple-400'
    },
    {
      id: 7,
      title: '빌드 (Build)',
      subtitle: '빌드가 뭐예요?',
      analogy: '요리 준비',
      description: '코드를 실행 가능한 파일로 만드는 과정. 재료를 손질하는 것처럼!',
      category: 'tools',
      slug: 'build',
      views: 743,
      readTime: 2,
      icon: FaHammer,
      iconColor: 'text-zinc-400'
    },
    {
      id: 8,
      title: '배포 (Deploy)',
      subtitle: '배포가 뭐예요?',
      analogy: '가게 오픈',
      description: '내 앱을 인터넷에 올리는 것. 가게 문을 여는 것과 같아요!',
      category: 'tools',
      slug: 'deploy',
      views: 1456,
      readTime: 2,
      icon: FaRocket,
      iconColor: 'text-pink-400'
    },
    {
      id: 9,
      title: 'CORS',
      subtitle: 'CORS가 뭐예요?',
      analogy: '경비원',
      description: '다른 사이트에서 내 서버에 접근하는 걸 막는 보안 정책.',
      category: 'error',
      slug: 'cors',
      views: 1092,
      readTime: 2,
      icon: FaShieldAlt,
      iconColor: 'text-red-400'
    },
    {
      id: 10,
      title: 'npm',
      subtitle: 'npm이 뭐예요?',
      analogy: '앱스토어',
      description: '개발자용 앱스토어. 다른 사람이 만든 코드를 다운받아 쓸 수 있어요.',
      category: 'tools',
      slug: 'npm',
      views: 1673,
      readTime: 2,
      icon: FaBox,
      iconColor: 'text-cyan-400'
    },
  ]

  const categories = [
    { id: 'all', name: '전체', count: glossaryTerms.length, color: 'white' },
    { id: 'basic', name: '기본 개념', count: glossaryTerms.filter(t => t.category === 'basic').length, color: 'indigo' },
    { id: 'nextjs', name: 'Next.js 용어', count: glossaryTerms.filter(t => t.category === 'nextjs').length, color: 'blue' },
    { id: 'tools', name: '개발 도구', count: glossaryTerms.filter(t => t.category === 'tools').length, color: 'emerald' },
    { id: 'error', name: '에러 용어', count: glossaryTerms.filter(t => t.category === 'error').length, color: 'red' },
  ]

  // 인기 용어 (조회수 기준 TOP 5)
  const popularTerms = [...glossaryTerms]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

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
              <Link href="/docs/glossary/api" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">API</Link>
              <span className="text-zinc-700">•</span>
              <Link href="/docs/glossary/webhook" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">웹훅</Link>
              <span className="text-zinc-700">•</span>
              <Link href="/docs/glossary/database" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">데이터베이스</Link>
            </div>
          </section>

          {/* POPULAR TERMS */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-white">인기 용어 TOP 5</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term) => {
                const Icon = term.icon
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
                const Icon = term.icon
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
