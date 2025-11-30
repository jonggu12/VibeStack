'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Rocket, Code, BookOpen, Globe, Smartphone, ArrowRight,
  Search, Plus, XIcon, Check, Copy,
  ShoppingBag, PenTool, Clock, CircleCheck,
  Sparkles, Database, Book, Bot
} from 'lucide-react'
import { FaGithub, FaGoogle, FaStripe, FaDiscord } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useUser, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [showUserHero, setShowUserHero] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSignIn = () => {
    router.push('/sign-in')
  }

  const handleSignUp = () => {
    router.push('/sign-up')
  }

  const dismissOnboarding = () => {
    setShowUserHero(false)
  }

  const handleCopyClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }

    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const handleCardClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #09090b;
          color: #fafafa;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }

        .glass-effect {
          background: rgba(9, 9, 11, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .hero-gradient {
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 9, 11, 0) 60%);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30">

        {/* DUAL LAYER HEADER */}
        <header className="sticky top-0 z-50 glass-effect border-b border-zinc-800 transition-all duration-300">

          {/* Top Row: Logo, Search, Actions */}
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">V</div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">VibeStack</span>
            </Link>

            {/* Search Bar (Central) */}
            <div className="hidden md:flex flex-1 max-w-xl relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2 bg-zinc-900/50 border border-zinc-700 rounded-full text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-zinc-900 transition-all text-white"
                placeholder="무엇을 도와드릴까요? (예: '로그인 구현', '에러 해결')"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <button className="text-zinc-400 hover:text-white transition-colors">
                    <FaDiscord className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-zinc-800" />
                  <button className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>새 프로젝트</span>
                  </button>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-full border border-zinc-700 shadow-inner",
                        userButtonPopoverCard: "bg-zinc-900 border border-zinc-800 shadow-2xl",
                        userButtonPopoverActionButton: "text-zinc-300 hover:text-white hover:bg-zinc-800",
                        userButtonPopoverActionButtonText: "text-zinc-300",
                        userButtonPopoverActionButtonIcon: "text-zinc-400",
                        userButtonPopoverFooter: "hidden",
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                </>
              ) : (
                <>
                  <button onClick={handleSignIn} className="text-zinc-400 hover:text-white text-sm font-medium px-2">로그인</button>
                  <button onClick={handleSignUp} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                    시작하기
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Row: Mega Menu Navigation */}
          <div className="border-t border-zinc-800/50 bg-zinc-950/50">
            <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-8 overflow-x-auto no-scrollbar">

              {/* Nav Item: Projects */}
              <div className="group relative h-full flex items-center">
                <Link href="/tutorials" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <Rocket className="w-3 h-3" /> 프로젝트
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Categories</div>
                  <Link href="/tutorials" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors group/item">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors"><Globe className="w-4 h-4" /></div>
                    <div>
                      <div className="font-semibold">Web SaaS</div>
                      <div className="text-xs text-zinc-500">Next.js, React</div>
                    </div>
                  </Link>
                  <Link href="/tutorials" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors group/item">
                    <div className="w-8 h-8 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover/item:bg-pink-500 group-hover/item:text-white transition-colors"><Smartphone className="w-4 h-4" /></div>
                    <div>
                      <div className="font-semibold">Mobile App</div>
                      <div className="text-xs text-zinc-500">Flutter, RN</div>
                    </div>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/tutorials" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    전체 프로젝트 보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Nav Item: Snippets */}
              <div className="group relative h-full flex items-center">
                <Link href="/snippets" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <Code className="w-3 h-3" /> 스니펫
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Most Copied</div>
                  <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    <span className="flex items-center gap-2"><FaGoogle className="w-4 h-4 text-zinc-500" /> Google Auth</span>
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">Top 1</span>
                  </Link>
                  <Link href="/" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    <span className="flex items-center gap-2"><FaStripe className="w-4 h-4 text-zinc-500" /> Stripe Pay</span>
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">Top 2</span>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/snippets" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    50개 스니펫 전체보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Nav Item: Docs */}
              <div className="group relative h-full flex items-center">
                <Link href="/docs" className="text-sm font-medium text-zinc-400 group-hover:text-white flex items-center gap-1.5 h-full border-b-2 border-transparent group-hover:border-indigo-500 transition-all">
                  <BookOpen className="w-3 h-3" /> 문서
                </Link>
                {/* Mega Menu */}
                <div className="absolute top-full left-0 mt-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50 transform origin-top-left">
                  <div className="text-[10px] font-bold text-zinc-500 px-3 py-2 uppercase tracking-wider">Survival Kit</div>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    🚨 <b>에러 해결</b> <span className="text-red-400 text-[10px] ml-1">SOS</span>
                  </Link>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    💬 <b>프롬프트 공식</b>
                  </Link>
                  <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-colors">
                    🧠 <b>개념 사전</b>
                  </Link>
                  <div className="h-px bg-zinc-800 my-2" />
                  <Link href="/docs" className="block px-3 py-2 text-xs text-indigo-400 hover:text-indigo-300 text-center font-bold hover:underline">
                    문서 전체보기 <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-16">

          {/* VISITOR HERO (Marketing) */}
          {!showUserHero && (
            <section className="text-center py-20 relative hero-gradient transition-all duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 animate-pulse-slow cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                Vibe Coding: AI 시대의 새로운 표준
              </div>
              <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                <span className="text-white">복붙만 하세요.</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                  나머지는 AI가 합니다.
                </span>
              </h1>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                코딩을 몰라도 괜찮습니다. VibeStack의 가이드를<br className="hidden sm:block" />
                Cursor에 붙여넣기만 하면 실제 작동하는 서비스가 완성됩니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={handleSignUp} className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                  <FaGithub className="w-5 h-5" />
                  <span>무료로 시작하기</span>
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full font-medium hover:bg-zinc-800 transition-colors">
                  작동 원리 보기
                </button>
              </div>
            </section>
          )}

          {/* USER HERO (Soft Onboarding) */}
          {showUserHero && (
            <section className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-zinc-900/40 p-6 sm:p-10 transition-all duration-500">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <button onClick={dismissOnboarding} className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 z-20">
                <XIcon className="w-5 h-5" />
              </button>

              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded border border-indigo-500/20">맞춤 추천</span>
                  <h2 className="text-2xl font-bold text-white">민준님, 오늘 어떤 프로젝트를 만드실 건가요?</h2>
                </div>
                <p className="text-zinc-400 mb-8 text-sm sm:text-base">3분만 투자해서 설정을 완료하면, 실패 없는 튜토리얼과 프롬프트를 추천해 드려요.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">나만의 SaaS 만들기</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">Todo, 대시보드, 회원관리</span>
                  </button>
                  {/* Option 2 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-pink-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/10">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">커머스 / 쇼핑몰</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">상품 판매, 결제 연동</span>
                  </button>
                  {/* Option 3 */}
                  <button className="group flex flex-col items-start p-5 rounded-xl bg-zinc-800/40 border border-zinc-700 hover:border-emerald-500 hover:bg-zinc-800 transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-base text-zinc-100 mb-1">블로그 / 포트폴리오</span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400">콘텐츠 발행, SEO 최적화</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* PROJECTS SECTION */}
          <section>
            <div className="flex items-end justify-between mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">🔥 코딩 몰라도 1시간 컷!</h3>
                <p className="text-zinc-500 text-sm">Cursor에 복붙만 하면 완성되는 검증된 레시피</p>
              </div>
              <Link href="/tutorials" className="hidden sm:flex items-center text-sm font-medium text-zinc-400 hover:text-indigo-400 transition-colors group">
                전체 프로젝트 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div onClick={handleCardClick} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-black/40 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">Next.js 14</span>
                    <span className="bg-black/40 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">SaaS</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-zinc-100 group-hover:text-indigo-400 transition-colors mb-3">45분 만에 만드는 Todo 앱</h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><CircleCheck className="w-3 h-3" /> 94% 성공</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 43분</span>
                  </div>
                  <button className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:border-zinc-700">
                    <span>시작하기</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              {/* Card 2 */}
              <div onClick={handleCardClick} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-emerald-500/5">
                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-black/40 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">Supabase</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-zinc-100 group-hover:text-emerald-400 transition-colors mb-3">대기자 명단 (이메일 수집)</h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><CircleCheck className="w-3 h-3" /> 98% 성공</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 30분</span>
                  </div>
                  <button className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:border-zinc-700">
                    <span>시작하기</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              {/* Card 3 */}
              <div onClick={handleCardClick} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all cursor-pointer hover:shadow-xl hover:shadow-orange-500/5">
                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-red-900/40 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-black/40 backdrop-blur text-[10px] font-bold px-2 py-1 rounded text-white border border-white/10 uppercase tracking-wide">MDX</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-zinc-100 group-hover:text-orange-400 transition-colors mb-3">나만의 개발 블로그</h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-5">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><CircleCheck className="w-3 h-3" /> 91% 성공</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 1.5시간</span>
                  </div>
                  <button className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:border-zinc-700">
                    <span>시작하기</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:hidden text-center">
              <Link href="/tutorials" className="text-sm font-medium text-zinc-400 hover:text-white">전체 프로젝트 보기 →</Link>
            </div>
          </section>

          {/* SURVIVAL KIT (DOCS) */}
          <section>
            <div className="flex items-end justify-between mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  🚑 바이브 코더 생존 키트
                  <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">SOS</span>
                </h3>
                <p className="text-zinc-500 text-sm">에러가 났거나 AI가 말을 안 들을 때 꺼내보세요.</p>
              </div>
              <Link href="/docs" className="hidden sm:flex items-center text-sm font-medium text-zinc-400 hover:text-indigo-400 transition-colors group">
                문서 보관소 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: Terminal Style */}
              <Link href="/" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/10">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono ml-2">error_log.txt</span>
                </div>
                <div className="p-5">
                  <div className="text-red-400 font-mono text-xs mb-3 p-2 bg-red-500/10 rounded border border-red-500/20 truncate">
                    Error: Module not found...
                  </div>
                  <h4 className="font-bold text-zinc-100 text-lg mb-1 group-hover:text-red-400 transition-colors">
                    "모듈을 찾을 수 없대요"
                  </h4>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    npm install을 안 했거나 경로가 틀렸을 때. 1분 만에 해결하는 프롬프트.
                  </p>
                </div>
              </Link>

              {/* Card 2: Chat Style */}
              <Link href="/" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/10">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI Chat
                  </span>
                  <span className="text-[10px] text-zinc-600">Now</span>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <div className="w-1 bg-indigo-500 rounded-full" />
                    <p className="text-xs text-zinc-500 italic">"코드는 짰는데 작동을 안 해요..."</p>
                  </div>
                  <h4 className="font-bold text-zinc-100 text-lg mb-1 group-hover:text-indigo-400 transition-colors">
                    AI 질문 공식 (프롬프트)
                  </h4>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    개떡같이 말해도 찰떡같이 알아듣게 시키는 '3단계 질문' 구조.
                  </p>
                </div>
              </Link>

              {/* Card 3: Dictionary Style */}
              <Link href="/" className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/10">
                <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <Book className="w-3 h-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-mono">dictionary.md</span>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">localhost?</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">API?</span>
                  </div>
                  <h4 className="font-bold text-zinc-100 text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                    비개발자용 용어 사전
                  </h4>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    "서버가 죽었다"는게 무슨 뜻이죠? 개발자들의 외계어, 쉽게 통역해 드립니다.
                  </p>
                </div>
              </Link>

            </div>

            <div className="mt-4 sm:hidden text-center">
              <Link href="/docs" className="text-sm font-medium text-zinc-400 hover:text-white">전체 문서 보기 →</Link>
            </div>
          </section>

          {/* SNIPPETS SECTION */}
          <section>
            <div className="flex items-end justify-between mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">🔧 5초 만에 적용하는 필수 기능</h3>
                <p className="text-zinc-500 text-sm">이해할 필요 없습니다. 복사해서 프롬프트에 붙여넣으세요.</p>
              </div>
              <Link href="/snippets" className="hidden sm:flex items-center text-sm font-medium text-zinc-400 hover:text-indigo-400 transition-colors group">
                모든 스니펫 보기 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Snippet 1 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FaGoogle className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-zinc-200 text-sm">구글 로그인</span>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">Auth</span>
                </div>
                <div className="bg-black/40 rounded p-2.5 mb-3 font-mono text-[10px] text-zinc-500 border border-zinc-800 truncate select-none">
                  createClerkClient()...
                </div>
                <button onClick={handleCopyClick} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 group active:scale-95">
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>프롬프트 복사</span>
                </button>
              </div>

              {/* Snippet 2 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FaStripe className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-zinc-200 text-sm">결제 모달</span>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">Pay</span>
                </div>
                <div className="bg-black/40 rounded p-2.5 mb-3 font-mono text-[10px] text-zinc-500 border border-zinc-800 truncate select-none">
                  stripe.checkout.sessions...
                </div>
                <button onClick={handleCopyClick} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 group active:scale-95">
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>프롬프트 복사</span>
                </button>
              </div>

              {/* Snippet 3 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-zinc-200 text-sm">DB 연결</span>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">Data</span>
                </div>
                <div className="bg-black/40 rounded p-2.5 mb-3 font-mono text-[10px] text-zinc-500 border border-zinc-800 truncate select-none">
                  createClient(URL, KEY)...
                </div>
                <button onClick={handleCopyClick} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 group active:scale-95">
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>프롬프트 복사</span>
                </button>
              </div>

              {/* Snippet 4 */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                    <span className="font-bold text-zinc-200 text-sm">SEO 자동화</span>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">SEO</span>
                </div>
                <div className="bg-black/40 rounded p-2.5 mb-3 font-mono text-[10px] text-zinc-500 border border-zinc-800 truncate select-none">
                  export const metadata = ...
                </div>
                <button onClick={handleCopyClick} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 group active:scale-95">
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span>프롬프트 복사</span>
                </button>
              </div>
            </div>

            <div className="mt-4 sm:hidden text-center">
              <Link href="/snippets" className="text-sm font-medium text-zinc-400 hover:text-white">전체 스니펫 보기 →</Link>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-20 py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500 font-medium">
              <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><FaDiscord className="w-4 h-4" /> 커뮤니티</Link>
            </div>
          </div>
        </footer>


        {/* TOAST: Copy Success */}
        <div className={`fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[70] transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <h4 className="font-bold text-sm">프롬프트 복사 완료!</h4>
            <p className="text-xs text-zinc-400">Cursor (Ctrl+I)에 붙여넣기 하세요.</p>
          </div>
        </div>

      </div>
    </>
  )
}
