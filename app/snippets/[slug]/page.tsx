'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, Share, Copy, Check, Wand2, Code, Lightbulb, ChevronRight } from 'lucide-react'
import { FaGoogle, FaReact } from 'react-icons/fa'

export default function SnippetDetailPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('layout')

  const handleCopy = (content: string, section: string) => {
    navigator.clipboard.writeText(content)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const promptContent = `Clerk를 사용해서 구글 소셜 로그인 기능을 구현해줘.

1. @clerk/nextjs 패키지를 사용해.
2. RootLayout에 <ClerkProvider>를 감싸줘.
3. '/sign-in' 페이지를 만들고 <SignIn /> 컴포넌트를 중앙에 배치해줘.
4. 헤더에는 로그인 여부에 따라 <UserButton /> 또는 '로그인' 버튼이 보이게 해줘.
5. .env.local 환경변수 설정 템플릿도 알려줘.`

  const codeContent = `import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}`

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header border-b border-zinc-800 h-16 bg-zinc-950/85 backdrop-blur-xl">
        <div className="w-full max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-black font-bold text-base group-hover:rotate-3 transition-transform">
                V
              </div>
              <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
              <span className="text-xs font-mono text-zinc-500 mt-1">Snippets</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 border-l border-zinc-800 pl-6">
              <Link href="/snippets" className="hover:text-zinc-300">
                Snippets
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="hover:text-zinc-300 cursor-pointer">Auth</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">Google Login</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:border-zinc-700 cursor-pointer w-64 transition-colors">
              <span className="text-xs">🔍</span>
              <span>검색 (⌘K)</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1440px] mx-auto flex">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-8 pr-6 pl-4">
          <div className="space-y-8">
            {/* Auth Category */}
            <div>
              <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                Auth (인증)
              </h5>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-2 py-1.5 text-sm text-indigo-400 bg-indigo-500/10 border-l-2 border-indigo-500 rounded-r font-medium transition-colors"
                  >
                    구글 소셜 로그인
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded transition-colors"
                  >
                    이메일/비번 로그인 Form
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded transition-colors"
                  >
                    로그아웃 버튼
                  </a>
                </li>
              </ul>
            </div>

            {/* Database Category */}
            <div>
              <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                Database
              </h5>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded transition-colors"
                  >
                    Supabase 클라이언트 설정
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded transition-colors"
                  >
                    데이터 읽기 (Select)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 py-10 px-4 md:px-12">
          {/* Snippet Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl text-zinc-400 border border-zinc-700">
                  <FaGoogle />
                </div>
                <h1 className="text-3xl font-bold text-white">구글 소셜 로그인</h1>
              </div>
              <p className="text-zinc-400 max-w-2xl text-lg">
                Clerk를 사용하여 Next.js 앱에 구글 로그인 기능을 5분 만에 붙일 수 있는 코드입니다.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> 저장
              </button>
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium flex items-center gap-2">
                <Share className="w-4 h-4" /> 공유
              </button>
            </div>
          </div>

          {/* AI Prompt Section */}
          <section id="prompt-section" className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-500" /> AI 프롬프트
              </h2>
              <span className="text-xs text-zinc-500">AI(Cursor)에게 이대로 시키세요</span>
            </div>

            <div className="relative group">
              <div className="absolute -top-3 left-6 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">
                VIBE CODER PICK
              </div>
              <div className="bg-zinc-900 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-500 transition-colors shadow-lg shadow-indigo-500/5">
                <div className="flex justify-between items-start gap-4">
                  <code className="text-base text-zinc-200 bg-transparent p-0 font-normal leading-relaxed block w-full whitespace-pre-wrap font-mono">
                    {promptContent}
                  </code>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleCopy(promptContent, 'prompt')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    {copiedSection === 'prompt' ? (
                      <>
                        <Check className="w-4 h-4" /> 복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> 프롬프트 복사하기
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Prerequisites */}
          <section className="mb-10">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
              0. 준비물 (설치)
            </h3>
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center justify-between group">
              <code className="text-sm text-pink-400 font-mono">npm install @clerk/nextjs</code>
              <button
                onClick={() => handleCopy('npm install @clerk/nextjs', 'install')}
                className="text-zinc-500 hover:text-white transition-colors p-2 rounded hover:bg-zinc-800"
              >
                {copiedSection === 'install' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </section>

          {/* Code Implementation */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-zinc-500" /> 직접 구현 코드
              </h2>
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`px-3 py-1 text-xs font-bold rounded shadow-sm transition-colors ${
                    activeTab === 'layout'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  layout.tsx
                </button>
                <button
                  onClick={() => setActiveTab('page')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeTab === 'page'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  page.tsx
                </button>
                <button
                  onClick={() => setActiveTab('middleware')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    activeTab === 'middleware'
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  middleware.ts
                </button>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                <span className="text-xs text-zinc-500 font-mono">app/layout.tsx</span>
                <button
                  onClick={() => handleCopy(codeContent, 'code')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 hover:bg-zinc-800 px-2 py-1 rounded transition-colors"
                >
                  {copiedSection === 'code' ? (
                    <>
                      <Check className="w-3 h-3" /> 복사 완료
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> 코드 복사
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-zinc-300">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Troubleshooting Tip */}
          <section className="mb-8">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 flex gap-4">
              <Lightbulb className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-400 text-sm mb-1">팁: 환경변수를 잊지 마세요</h4>
                <p className="text-zinc-400 text-sm mb-2">
                  Clerk 대시보드에서 API Key를 복사해서 <code>.env.local</code> 파일에 넣어야
                  작동합니다.
                </p>
                <code className="block bg-zinc-950/50 p-2 rounded text-xs text-zinc-300 font-mono border border-blue-500/10">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
                  <br />
                  CLERK_SECRET_KEY=sk_test_...
                </code>
              </div>
            </div>
          </section>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 py-10 px-6 border-l border-zinc-800">
          {/* Tech Stack */}
          <div className="mb-8">
            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              Tech Stack
            </h5>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                <FaReact className="text-blue-400" /> Next.js 14
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                🔒 Clerk Auth
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                📝 TypeScript
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Stats</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">1.2k</div>
                <div className="text-xs text-zinc-500">복사됨</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-emerald-400">성공률</div>
              </div>
            </div>
          </div>

          {/* Related Snippets */}
          <div>
            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              다음 단계 추천
            </h5>
            <div className="space-y-3">
              <a
                href="#"
                className="group block p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white">
                    로그아웃 버튼
                  </span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500">로그인 후 필수 기능</p>
              </a>
              <a
                href="#"
                className="group block p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-white">
                    사용자 프로필 카드
                  </span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500">로그인 정보 보여주기</p>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
