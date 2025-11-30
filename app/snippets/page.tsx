'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Check, Plus, Sparkles, Code, Bookmark, Layers, Zap } from 'lucide-react'
import { FaGoogle, FaStripe, FaDatabase } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { UserMenu } from '@/components/layout/user-menu'

export default function SnippetsPage() {
  const { isSignedIn } = useUser()
  const [toast, setToast] = useState({ show: false, title: '', desc: '' })

  const handleCopy = (type: 'prompt' | 'code') => {
    if (type === 'prompt') {
      setToast({
        show: true,
        title: '프롬프트 복사 완료!',
        desc: 'AI 채팅창(Cursor)에 붙여넣으세요.'
      })
    } else {
      setToast({
        show: true,
        title: '코드 복사 완료!',
        desc: '파일에 직접 붙여넣으세요.'
      })
    }

    setTimeout(() => {
      setToast({ show: false, title: '', desc: '' })
    }, 2000)
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

        .token-keyword { color: #c084fc; }
        .token-function { color: #60a5fa; }
        .token-string { color: #4ade80; }
        .token-comment { color: #71717a; font-style: italic; }
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
              <Link href="/docs" className="text-zinc-400 hover:text-white transition-colors">문서</Link>
              <Link href="/snippets" className="text-white border-b-2 border-indigo-500 h-16 flex items-center">스니펫</Link>
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

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* HERO: SEARCH & TAGS */}
          <section className="flex flex-col md:flex-row gap-6 items-end justify-between border-b border-zinc-800 pb-8">
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold mb-4">필요한 기능을 골라보세요</h1>
              <p className="text-zinc-400 mb-6 max-w-xl">
                로그인, 결제, DB 연결 등 복잡한 기능들을 <strong>"복사-붙여넣기"</strong> 한 번으로 끝내세요.
                AI에게 시킬 프롬프트도 함께 제공됩니다.
              </p>

              <div className="relative group max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white transition-all"
                  placeholder="기능 검색 (예: 구글 로그인, Stripe 결제, 버튼 컴포넌트)"
                />
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="w-full md:w-1/3 flex flex-wrap gap-2 justify-start md:justify-end">
              <button className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-colors">
                #Auth (인증)
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white hover:bg-zinc-700 transition-colors">
                #Database
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white hover:bg-zinc-700 transition-colors">
                #UI/UX
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white hover:bg-zinc-700 transition-colors">
                #Payment
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white hover:bg-zinc-700 transition-colors">
                #Hooks
              </button>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Google Login */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
                    <FaGoogle />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">구글 소셜 로그인</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">Auth</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Clerk</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 font-mono text-xs overflow-hidden relative h-32">
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] text-zinc-500">layout.tsx</span>
                </div>
                <div className="opacity-80">
                  <span className="token-keyword">import</span> {'{'} ClerkProvider {'}'} <span className="token-keyword">from</span> <span className="token-string">'@clerk/nextjs'</span><br/><br/>
                  <span className="token-keyword">export default function</span> <span className="token-function">RootLayout</span>({'{'} children {'}'}) {'{'}<br/>
                  &nbsp;&nbsp;<span className="token-keyword">return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="token-function">ClerkProvider</span>&gt;<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{'}children{'}'}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="token-function">ClerkProvider</span>&gt;<br/>
                  &nbsp;&nbsp;)<br/>
                  {'}'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              </div>

              <div className="p-4 bg-zinc-900 flex gap-2">
                <button
                  onClick={() => handleCopy('prompt')}
                  className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>프롬프트 복사</span>
                </button>
                <button
                  onClick={() => handleCopy('code')}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
                  title="코드만 복사"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Stripe Payment */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/5 transition-all group">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
                    <FaStripe />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">결제 체크아웃 생성</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded">Pay</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Stripe</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 font-mono text-xs overflow-hidden relative h-32">
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] text-zinc-500">route.ts</span>
                </div>
                <div className="opacity-80">
                  <span className="token-keyword">const</span> session = <span className="token-keyword">await</span> stripe.checkout.sessions.<span className="token-function">create</span>({'{'}< br/>
                  &nbsp;&nbsp;line_items: [<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;{'{'} price: <span className="token-string">'price_id'</span>, quantity: 1 {'}'}<br/>
                  &nbsp;&nbsp;],<br/>
                  &nbsp;&nbsp;mode: <span className="token-string">'payment'</span>,<br/>
                  {'}'});
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              </div>

              <div className="p-4 bg-zinc-900 flex gap-2">
                <button
                  onClick={() => handleCopy('prompt')}
                  className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>프롬프트 복사</span>
                </button>
                <button
                  onClick={() => handleCopy('code')}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 3: Supabase Client */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
                    <FaDatabase />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Supabase 클라이언트</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">DB</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Supabase</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 font-mono text-xs overflow-hidden relative h-32">
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] text-zinc-500">utils/supabase.ts</span>
                </div>
                <div className="opacity-80">
                  <span className="token-keyword">import</span> {'{'} createClient {'}'} <span className="token-keyword">from</span> <span className="token-string">'@supabase/supabase-js'</span><br/><br/>
                  <span className="token-keyword">export const</span> supabase = <span className="token-function">createClient</span>(<br/>
                  &nbsp;&nbsp;process.env.SUPABASE_URL,<br/>
                  &nbsp;&nbsp;process.env.SUPABASE_ANON_KEY<br/>
                  )
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              </div>

              <div className="p-4 bg-zinc-900 flex gap-2">
                <button
                  onClick={() => handleCopy('prompt')}
                  className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>프롬프트 복사</span>
                </button>
                <button
                  onClick={() => handleCopy('code')}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 4: Shadcn Button */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all group">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">기본 버튼 컴포넌트</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">UI</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">Shadcn</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 font-mono text-xs overflow-hidden relative h-32">
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] text-zinc-500">ui/button.tsx</span>
                </div>
                <div className="opacity-80">
                  <span className="token-keyword">import</span> {'{'} Slot {'}'} <span className="token-keyword">from</span> <span className="token-string">"@radix-ui/react-slot"</span><br/>
                  <span className="token-comment">// Shadcn UI Button Implementation</span><br/>
                  <span className="token-keyword">const</span> Button = React.<span className="token-function">forwardRef</span>(...)
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              </div>

              <div className="p-4 bg-zinc-900 flex gap-2">
                <button
                  onClick={() => handleCopy('prompt')}
                  className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>프롬프트 복사</span>
                </button>
                <button
                  onClick={() => handleCopy('code')}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 5: useDebounce */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all group">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">useDebounce 훅</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded">Hook</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">React</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 font-mono text-xs overflow-hidden relative h-32">
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[10px] text-zinc-500">hooks/use-debounce.ts</span>
                </div>
                <div className="opacity-80">
                  <span className="token-keyword">export function</span> <span className="token-function">useDebounce</span>(value, delay) {'{'}<br/>
                  &nbsp;&nbsp;<span className="token-keyword">const</span> [debounced, set] = <span className="token-function">useState</span>(value)<br/>
                  &nbsp;&nbsp;<span className="token-comment">// ... implementation</span><br/>
                  {'}'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              </div>

              <div className="p-4 bg-zinc-900 flex gap-2">
                <button
                  onClick={() => handleCopy('prompt')}
                  className="flex-1 bg-white text-black text-xs font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>프롬프트 복사</span>
                </button>
                <button
                  onClick={() => handleCopy('code')}
                  className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors border border-zinc-700"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 6: Request New */}
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

        {/* Toast Notification */}
        <div className={`fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{toast.title}</h4>
            <p className="text-xs text-zinc-400">{toast.desc}</p>
          </div>
        </div>
      </div>
    </>
  )
}
