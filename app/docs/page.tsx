'use client'

import Link from 'next/link'
import { Search, ArrowRight, Bot, BookOpen, Terminal, Rocket, Database, Lightbulb } from 'lucide-react'
import { FaReact } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

export default function DocsPage() {
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

        .hero-pattern {
          background-image: radial-gradient(#6366f1 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.1;
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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/tutorials" className="text-zinc-400 hover:text-white transition-colors">프로젝트</Link>
              <Link href="/docs" className="text-white border-b-2 border-indigo-500 h-16 flex items-center">문서</Link>
              <Link href="/snippets" className="text-zinc-400 hover:text-white transition-colors">스니펫</Link>
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

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 space-y-16">
          {/* HERO: SEARCH */}
          <section className="text-center relative">
            <div className="absolute inset-0 hero-pattern pointer-events-none" />

            <h1 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              무엇이 막히셨나요?
            </h1>

            <div className="max-w-2xl mx-auto relative group z-10">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-700 rounded-2xl text-base shadow-xl placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-all backdrop-blur"
                placeholder="검색어를 입력하세요 (예: '환경변수 설정', '배포 에러', 'use client')"
              />
              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-2 py-1">Cmd + K</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm z-10 relative">
              <span className="text-zinc-500">인기 검색어:</span>
              <Link href="#" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">Module not found</Link>
              <span className="text-zinc-700">•</span>
              <Link href="#" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">Supabase 연결</Link>
              <span className="text-zinc-700">•</span>
              <Link href="#" className="text-zinc-400 hover:text-white hover:underline decoration-zinc-700 underline-offset-4">프롬프트 공식</Link>
            </div>
          </section>

          {/* SURVIVAL KIT */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  🚑 바이브 코더 생존 키트
                  <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">SOS</span>
                </h2>
                <p className="text-zinc-500 text-sm">에러가 났거나 AI가 말을 안 들을 때 가장 먼저 보세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Error Solver */}
              <Link href="#" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/10 h-full flex flex-col">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono ml-2">troubleshoot.log</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-red-400 font-mono text-xs mb-4 p-2 bg-red-500/10 rounded border border-red-500/20">
                    Error: Module not found...
                  </div>
                  <h3 className="font-bold text-zinc-100 text-lg mb-2 group-hover:text-red-400 transition-colors">
                    에러 메시지 해결 가이드
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 flex-1">
                    빨간 글씨가 떴을 때 당황하지 마세요. 자주 발생하는 TOP 5 에러와 1분 해결법.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    해결법 보기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Card 2: Prompting */}
              <Link href="#" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/10 h-full flex flex-col">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                    <Bot className="w-3 h-3" /> Prompt Guide
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-4">
                    <div className="w-1 bg-indigo-500 rounded-full" />
                    <p className="text-xs text-zinc-500 italic">"AI가 내 말을 이해 못해요..."</p>
                  </div>
                  <h3 className="font-bold text-zinc-100 text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                    AI 질문 공식 (프롬프트)
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 flex-1">
                    개떡같이 말해도 찰떡같이 알아듣게 시키는 '3단계 질문 구조'를 알려드립니다.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    공식 복사하기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Card 3: Dictionary */}
              <Link href="#" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10 h-full flex flex-col">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-mono">dictionary.md</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">localhost?</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Deploy?</span>
                  </div>
                  <h3 className="font-bold text-zinc-100 text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                    비개발자용 용어 사전
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 flex-1">
                    "서버가 죽었다", "배포했다"는게 무슨 뜻이죠? 개발자들의 외계어를 통역해 드립니다.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    사전 펼치기 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* BY TECH STACK */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6">🛠️ 기술 스택별 가이드</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stack: Next.js */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-2 px-1">
                  <FaReact className="text-blue-400" /> Next.js (웹 제작)
                </div>

                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">5분 만에 프로젝트 시작하기</div>
                  <div className="text-xs text-zinc-500">설치부터 실행까지 명령어 복붙</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">페이지와 라우팅 이해하기</div>
                  <div className="text-xs text-zinc-500">/about 페이지는 어떻게 만드나요?</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">Hydration Error 해결법</div>
                  <div className="text-xs text-zinc-500">Next.js의 고질병 쉽게 고치기</div>
                </Link>
              </div>

              {/* Stack: Supabase */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-2 px-1">
                  <Database className="text-emerald-400" /> Supabase (DB)
                </div>

                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">테이블 만들기 (GUI)</div>
                  <div className="text-xs text-zinc-500">엑셀처럼 쉽게 데이터베이스 만들기</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">환경변수(.env) 설정</div>
                  <div className="text-xs text-zinc-500">API Key 안전하게 숨기는 법</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">RLS(보안) 정책 설정</div>
                  <div className="text-xs text-zinc-500">내 데이터는 나만 볼 수 있게</div>
                </Link>
              </div>

              {/* Stack: Cursor & Git */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-2 px-1">
                  <Terminal className="text-zinc-400" /> 도구 (Cursor/Git)
                </div>

                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">Cursor 단축키 모음</div>
                  <div className="text-xs text-zinc-500">Ctrl+K, Ctrl+L 완벽 정리</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">Github에 코드 올리기</div>
                  <div className="text-xs text-zinc-500">commit, push가 뭔가요?</div>
                </Link>
              </div>

              {/* Stack: Deploy */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm mb-2 px-1">
                  <Rocket className="text-purple-400" /> 배포 (Vercel)
                </div>

                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">Vercel 배포 체크리스트</div>
                  <div className="text-xs text-zinc-500">배포 전 꼭 확인해야 할 3가지</div>
                </Link>
                <Link href="#" className="block bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:bg-zinc-800 transition-colors group">
                  <div className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 mb-1">도메인 연결하기</div>
                  <div className="text-xs text-zinc-500">내 사이트에 .com 주소 붙이기</div>
                </Link>
              </div>
            </div>
          </section>

          {/* REQUEST DOCS */}
          <section className="py-10">
            <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">찾는 내용이 없으신가요?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                궁금한 점이나 에러가 있다면 요청해주세요. 24시간 안에 문서를 만들어 드립니다.
              </p>
              <button className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-full transition-colors">
                문서 요청하기
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
              <Link href="#" className="hover:text-white transition-colors">서비스 소개</Link>
              <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
