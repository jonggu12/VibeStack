'use client'

import Link from 'next/link'
import { Search, Clock, Signal, CheckCircle, Lock, Plus, ArrowRight, Users } from 'lucide-react'
import { FaDiscord, FaRobot, FaListCheck, FaEnvelope, FaFeather, FaCartShopping } from 'react-icons/fa6'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

interface Tutorial {
  id: string
  title: string
  description: string
  slug: string
  estimatedTime: number
  difficulty: string
  successRate: number
  completedCount: number
  tags: string[]
  isPremium: boolean
  gradient: string
}

interface TutorialsClientProps {
  tutorials: Tutorial[]
}

// Helper to get icon for tutorial
function getIconForTutorial(slug: string, tags: string[]) {
  if (slug.includes('todo') || slug.includes('saas')) return FaListCheck
  if (slug.includes('email') || slug.includes('landing')) return FaEnvelope
  if (slug.includes('blog') || slug.includes('portfolio')) return FaFeather
  if (slug.includes('ai') || slug.includes('chatbot') || slug.includes('bot')) return FaRobot
  if (slug.includes('commerce') || slug.includes('shop')) return FaCartShopping
  return FaListCheck
}

// Helper to get difficulty label
function getDifficultyLabel(difficulty: string) {
  if (difficulty === 'beginner') return { label: '초급', color: 'text-zinc-400' }
  if (difficulty === 'intermediate') return { label: '중급', color: 'text-yellow-500' }
  if (difficulty === 'advanced') return { label: '고급', color: 'text-red-400' }
  return { label: '입문', color: 'text-zinc-400' }
}

export function TutorialsClient({ tutorials }: TutorialsClientProps) {
  const { isSignedIn } = useUser()

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

        .card-gradient-1 { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
        .card-gradient-2 { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); }
        .card-gradient-3 { background: linear-gradient(135deg, #ea580c 0%, #db2777 100%); }
        .card-gradient-locked { background: linear-gradient(135deg, #3f3f46 0%, #18181b 100%); }
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

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
          {/* HERO SECTION */}
          <section className="text-center py-10 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              매주 새로운 프로젝트 업데이트
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">무엇을 만들고 싶으신가요?</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
              이론 공부는 그만하세요. 만들고 싶은 결과물을 선택하고,<br className="hidden sm:block" />
              AI에게 프롬프트를 던져서 <strong>오늘 안에 완성</strong>하세요.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-base placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 text-white transition-all shadow-lg"
                  placeholder="프로젝트 검색 (예: 쇼핑몰, 챗봇, 블로그...)"
                />
              </div>
            </div>
          </section>

          {/* FILTERS & GRID */}
          <section>
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
              <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold shadow-lg shadow-white/10">
                전체보기 ({tutorials.length})
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🚀 SaaS / 웹앱
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🤖 AI / 챗봇
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                🛍️ 커머스
              </button>
              <button className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-sm hover:text-white hover:border-zinc-500 transition-colors">
                📢 마케팅 / 랜딩
              </button>

              <div className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
                <select className="bg-transparent border-none focus:ring-0 text-zinc-400 cursor-pointer hover:text-white">
                  <option>인기순</option>
                  <option>최신순</option>
                  <option>난이도순</option>
                </select>
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => {
                const Icon = getIconForTutorial(tutorial.slug, tutorial.tags)
                const difficultyInfo = getDifficultyLabel(tutorial.difficulty)

                return (
                  <Link key={tutorial.id} href={`/tutorials/${tutorial.slug}`} className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 relative">
                    {/* Thumbnail */}
                    <div className={`h-48 bg-gradient-to-br ${tutorial.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-4 right-4 text-white/20 text-8xl transform rotate-12 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
                        <Icon />
                      </div>
                      <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                        {tutorial.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{tutorial.title}</h3>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                        {tutorial.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tutorial.estimatedTime}분</span>
                          <span className={`flex items-center gap-1 ${difficultyInfo.color}`}>
                            <Signal className="w-3 h-3" /> {difficultyInfo.label}
                          </span>
                        </div>
                        <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {tutorial.successRate}% 성공
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}

              {/* Coming Soon Card */}
              <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[350px] hover:border-zinc-700 hover:bg-zinc-900/30 transition-all group">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-300 mb-2">새로운 프로젝트 투표</h3>
                <p className="text-sm text-zinc-500 max-w-xs mb-6">
                  다음에 보고 싶은 튜토리얼이 있나요? 커뮤니티에서 투표해주세요.
                </p>
                <button className="px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 text-xs font-bold hover:bg-white hover:text-black transition-colors">
                  투표하러 가기
                </button>
              </div>
            </div>

            {tutorials.length === 0 && (
              <div className="text-center py-20">
                <FaListCheck className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-400 mb-2">아직 튜토리얼이 없습니다</h3>
                <p className="text-zinc-500">곧 다양한 프로젝트 튜토리얼이 추가될 예정입니다.</p>
              </div>
            )}
          </section>

          {/* BANNER */}
          <section className="py-10">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
                혼자 만드는 게 두려우신가요?
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto mb-8 relative z-10">
                지금 850명의 메이커들이 Discord에서 서로의 에러를 해결해주고 있습니다.<br className="hidden sm:block" />
                혼자 고민하지 말고 함께 만드세요.
              </p>
              <button className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto relative z-10">
                <FaDiscord /> 커뮤니티 참여하기 (무료)
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
              <Link href="/tutorials" className="hover:text-white transition-colors">튜토리얼</Link>
              <Link href="/docs" className="hover:text-white transition-colors">문서</Link>
              <Link href="/snippets" className="hover:text-white transition-colors">스니펫</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
