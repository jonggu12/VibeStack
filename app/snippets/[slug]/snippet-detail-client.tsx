'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, Share, Copy, Check, Wand2, Code, Lightbulb, ChevronRight } from 'lucide-react'
import { FaGoogle, FaReact } from 'react-icons/fa'
import { ViewTracker } from '@/components/content/view-tracker'
import type { Snippet } from '../actions'

interface SnippetDetailClientProps {
  snippet: Snippet
}

export function SnippetDetailClient({ snippet }: SnippetDetailClientProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const handleCopy = (content: string, section: string) => {
    if (!content) return

    navigator.clipboard.writeText(content)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  // 카테고리 아이콘
  const getCategoryIcon = () => {
    const title = snippet.title.toLowerCase()

    if (title.includes('google') || title.includes('로그인')) return <FaGoogle />
    if (title.includes('react')) return <FaReact />

    return <Code className="w-6 h-6" />
  }

  // Framework 배지 가져오기
  const frameworkBadge = snippet.stack?.framework
  const languageBadge = snippet.snippet_language

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <ViewTracker contentId={snippet.id} />

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
              <span className="text-white font-medium">{snippet.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[1440px] mx-auto flex">
        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 py-10 px-4 md:px-12">
          {/* Snippet Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl text-zinc-400 border border-zinc-700">
                  {getCategoryIcon()}
                </div>
                <h1 className="text-3xl font-bold text-white">{snippet.title}</h1>
              </div>
              <p className="text-zinc-400 max-w-2xl text-lg">
                {snippet.description || '이 스니펫에 대한 설명이 없습니다.'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 self-start">
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium inline-flex items-center whitespace-nowrap">
                <Bookmark className="w-4 h-4 mr-2 shrink-0" /> 저장
              </button>
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium inline-flex items-center whitespace-nowrap">
                <Share className="w-4 h-4 mr-2 shrink-0" /> 공유
              </button>
            </div>
          </div>

          {/* AI Prompt Section */}
          {snippet.prompt_text && (
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
                      {snippet.prompt_text}
                    </code>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleCopy(snippet.prompt_text || '', 'prompt')}
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
          )}

          {/* Code Implementation */}
          {snippet.code_snippet && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-zinc-500" /> 코드
                </h2>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                  <span className="text-xs text-zinc-500 font-mono">
                    {snippet.slug}.{snippet.snippet_language || 'ts'}
                  </span>
                  <button
                    onClick={() => handleCopy(snippet.code_snippet || '', 'code')}
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
                <div className="p-6 overflow-x-auto bg-[#0d1117]">
                  <pre className="font-mono text-sm leading-relaxed text-zinc-300">
                    <code>{snippet.code_snippet}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Troubleshooting Tip */}
          <section className="mb-8">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 flex gap-4">
              <Lightbulb className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-400 text-sm mb-1">팁</h4>
                <p className="text-zinc-400 text-sm">
                  이 코드를 복사해서 프로젝트에 바로 사용할 수 있습니다. 필요한 패키지가 있다면 먼저 설치해주세요.
                </p>
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
              {frameworkBadge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                  {frameworkBadge}
                </span>
              )}
              {languageBadge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
                  {languageBadge}
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
