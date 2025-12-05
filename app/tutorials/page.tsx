'use client'

import Link from 'next/link'
import { Search, Clock, Signal, CheckCircle, Lock, Plus, ArrowRight, Users } from 'lucide-react'
import { FaDiscord, FaRobot, FaListCheck, FaEnvelope, FaFeather, FaCartShopping } from 'react-icons/fa6'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

export default function TutorialsPage() {
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

          {/* CONTINUE LEARNING */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl border border-zinc-700 shadow-lg">
                  📝
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">In Progress</span>
                    <span className="text-zinc-500 text-xs">• 마지막 편집: 2시간 전</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">나만의 SaaS (Todo 앱)</h3>
                  <p className="text-sm text-zinc-400">Step 3. Supabase 데이터베이스 연결</p>
                </div>
              </div>

              <div className="w-full sm:w-1/3 flex flex-col items-end gap-2">
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex justify-between w-full text-xs">
                  <span className="text-zinc-500">65% 완료</span>
                  <Link href="#" className="text-white font-bold hover:underline flex items-center gap-1">
                    계속하기 <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FILTERS & GRID */}
          <section>
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
              <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold shadow-lg shadow-white/10">
                전체보기
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
              {/* Card 1: SaaS (Popular) */}
              <Link href="#" className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    🔥 Popular
                  </span>
                </div>

                <div className="h-48 card-gradient-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-4 right-4 text-white/20 text-8xl transform rotate-12 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
                    <FaListCheck />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Next.js 14</span>
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Supabase</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">45분 만에 만드는 Todo SaaS</h3>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                    가장 기본적이지만 모든 기능이 들어있습니다. 로그인, DB CRUD, 배포까지 한 번에 끝내세요.
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 45분</span>
                      <span className="flex items-center gap-1"><Signal className="w-3 h-3" /> 초급</span>
                    </div>
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 94% 성공
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 2: Landing Page */}
              <Link href="#" className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 card-gradient-2 relative overflow-hidden">
                  <div className="absolute bottom-4 right-4 text-white/20 text-8xl transform -rotate-6 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
                    <FaEnvelope />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">HTML/CSS</span>
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Resend</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">대기자 명단 (이메일 수집)</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                    내 아이디어를 검증하고 싶나요? 멋진 랜딩 페이지를 만들고 이메일을 수집해보세요.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 30분</span>
                      <span className="flex items-center gap-1"><Signal className="w-3 h-3" /> 입문</span>
                    </div>
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 98% 성공
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 3: Blog */}
              <Link href="#" className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 card-gradient-3 relative overflow-hidden">
                  <div className="absolute bottom-4 right-4 text-white/20 text-8xl transform rotate-6 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
                    <FaFeather />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Next.js</span>
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">MDX</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2">개발자 블로그 & 포트폴리오</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                    Notion보다 빠르고 예쁜 나만의 블로그. 마크다운으로 글을 쓰고 배포하세요.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 90분</span>
                      <span className="flex items-center gap-1"><Signal className="w-3 h-3" /> 초급</span>
                    </div>
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 91% 성공
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 4: AI Chatbot */}
              <Link href="#" className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-gradient-to-br from-sky-600 to-blue-700 relative overflow-hidden">
                  <div className="absolute bottom-4 right-4 text-white/20 text-8xl transform -rotate-3 group-hover:scale-110 group-hover:text-white/30 transition-all duration-500">
                    <FaRobot />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">OpenAI API</span>
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Vercel AI</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors mb-2">나만의 AI 챗봇 만들기</h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                    ChatGPT API를 연동하여 특정 주제(예: 타로카드, 심리상담) 챗봇을 만듭니다.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2시간</span>
                      <span className="flex items-center gap-1 text-yellow-500"><Signal className="w-3 h-3" /> 중급</span>
                    </div>
                    <div className="text-zinc-500 text-xs flex items-center gap-1">
                      <Users className="w-3 h-3" /> 230명 완료
                    </div>
                  </div>
                </div>
              </Link>

              {/* Card 5: E-commerce (Locked/Pro) */}
              <div className="group relative block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black mb-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-white font-bold text-sm">Pro 플랜 전용</p>
                  <button className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full transition-colors">
                    업그레이드하고 잠금해제
                  </button>
                </div>

                <div className="h-48 card-gradient-locked relative overflow-hidden grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-black/80 text-white border border-zinc-700 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                      <Lock className="w-2 h-2" /> Pro
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white/10 text-8xl transform rotate-3">
                    <FaCartShopping />
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Stripe</span>
                    <span className="bg-black/30 backdrop-blur text-white text-[10px] px-2 py-1 rounded border border-white/10">Zustand</span>
                  </div>
                </div>
                <div className="p-5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-lg font-bold text-zinc-300 mb-2">디지털 상품 판매 스토어</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                    PDF, 전자책, 강의 등 디지털 파일을 판매하고 자동으로 이메일을 발송합니다.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3시간</span>
                      <span className="flex items-center gap-1 text-red-400"><Signal className="w-3 h-3" /> 고급</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Coming Soon */}
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
