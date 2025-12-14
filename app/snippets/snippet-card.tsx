'use client'

import { useState } from 'react'
import { Code, Sparkles, Bookmark } from 'lucide-react'
import { FaGoogle, FaStripe, FaDatabase } from 'react-icons/fa'
import type { Snippet } from './actions'

interface SnippetCardProps {
  snippet: Snippet
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const [toast, setToast] = useState({ show: false, title: '', desc: '' })

  const handleCopy = (type: 'prompt' | 'code') => {
    const textToCopy = type === 'prompt' ? snippet.prompt_text : snippet.code_snippet

    if (!textToCopy) {
      setToast({
        show: true,
        title: '복사 실패',
        desc: '데이터가 없습니다.'
      })
      setTimeout(() => setToast({ show: false, title: '', desc: '' }), 2000)
      return
    }

    navigator.clipboard.writeText(textToCopy)

    setToast({
      show: true,
      title: type === 'prompt' ? '프롬프트 복사 완료!' : '코드 복사 완료!',
      desc: type === 'prompt' ? 'AI 채팅창(Cursor)에 붙여넣으세요.' : '파일에 직접 붙여넣으세요.'
    })

    setTimeout(() => {
      setToast({ show: false, title: '', desc: '' })
    }, 2000)
  }

  // 카테고리 아이콘 가져오기
  const getCategoryIcon = () => {
    const title = snippet.title.toLowerCase()

    if (title.includes('google') || title.includes('로그인')) return <FaGoogle />
    if (title.includes('stripe') || title.includes('결제')) return <FaStripe />
    if (title.includes('supabase') || title.includes('database')) return <FaDatabase />

    return <Code className="w-5 h-5" />
  }

  // 프레임워크별 고유 색상 (실제 브랜드 컬러)
  const getFrameworkColor = (name: string) => {
    const lower = name.toLowerCase()

    // Framework colors
    if (lower.includes('next')) return { bg: 'bg-slate-100/10', text: 'text-slate-100', border: 'border-slate-400/20' }
    if (lower.includes('react')) return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' }
    if (lower.includes('vue')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' }
    if (lower.includes('angular')) return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }

    // Services
    if (lower.includes('clerk')) return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' }
    if (lower.includes('stripe')) return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' }
    if (lower.includes('supabase')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' }
    if (lower.includes('firebase')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' }
    if (lower.includes('aws') || lower.includes('s3')) return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' }

    // UI Libraries
    if (lower.includes('tailwind')) return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' }
    if (lower.includes('shadcn')) return { bg: 'bg-zinc-100/10', text: 'text-zinc-100', border: 'border-zinc-400/20' }
    if (lower.includes('radix')) return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' }

    // Others
    if (lower.includes('node')) return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
    if (lower.includes('zod')) return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' }
    if (lower.includes('sonner') || lower.includes('toast')) return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' }

    return { bg: 'bg-zinc-700/50', text: 'text-zinc-400', border: 'border-zinc-600/30' }
  }

  // 언어별 색상
  const getLanguageColor = (lang: string) => {
    const lower = lang.toLowerCase()

    if (lower.includes('typescript') || lower === 'ts') return { bg: 'bg-blue-600/10', text: 'text-blue-400', border: 'border-blue-600/20' }
    if (lower.includes('javascript') || lower === 'js') return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' }
    if (lower.includes('python')) return { bg: 'bg-blue-400/10', text: 'text-blue-300', border: 'border-blue-400/20' }
    if (lower.includes('sql')) return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' }

    return { bg: 'bg-zinc-700/50', text: 'text-zinc-400', border: 'border-zinc-600/30' }
  }

  // 정교한 신택스 하이라이팅 (토큰 기반)
  const highlightCode = (code: string) => {
    if (!code) return '<span style="color: #71717a">// 코드 미리보기...</span>'

    // 토큰 타입 정의
    const tokens: { type: string; value: string }[] = []
    let remaining = code

    // 토큰화 (순서 중요!)
    const patterns = [
      { type: 'comment', regex: /(\/\/.*?$|\/\*[\s\S]*?\*\/)/m },
      { type: 'string', regex: /(["'`])((?:\\.|(?!\1).)*?)\1/ },
      { type: 'keyword1', regex: /\b(import|export|from|as|default)\b/ },
      { type: 'keyword2', regex: /\b(const|let|var|function|async|await|return|if|else|for|while|break|continue|class|interface|type|enum|new)\b/ },
      { type: 'number', regex: /\b(\d+\.?\d*)\b/ },
      { type: 'function', regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/ },
      { type: 'type', regex: /\b([A-Z][a-zA-Z0-9]*)\b/ },
      { type: 'text', regex: /[a-zA-Z_$][a-zA-Z0-9_$]*|[^\s]/ },
      { type: 'whitespace', regex: /\s+/ },
    ]

    while (remaining.length > 0) {
      let matched = false

      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex)
        if (match && match.index === 0) {
          tokens.push({ type: pattern.type, value: match[0] })
          remaining = remaining.slice(match[0].length)
          matched = true
          break
        }
      }

      if (!matched) {
        tokens.push({ type: 'text', value: remaining.charAt(0) })
        remaining = remaining.slice(1)
      }
    }

    // 토큰을 HTML로 변환
    const html = tokens
      .map((token) => {
        const escaped = token.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')

        switch (token.type) {
          case 'comment':
            return `<span style="color: #71717a; font-style: italic">${escaped}</span>`
          case 'string':
            return `<span style="color: #4ade80">${escaped}</span>`
          case 'keyword1':
            return `<span style="color: #c084fc">${escaped}</span>`
          case 'keyword2':
            return `<span style="color: #f472b6">${escaped}</span>`
          case 'number':
            return `<span style="color: #fb923c">${escaped}</span>`
          case 'function':
            return `<span style="color: #7dd3fc">${escaped}</span>`
          case 'type':
            return `<span style="color: #2dd4bf">${escaped}</span>`
          case 'whitespace':
            return escaped
          default:
            return `<span style="color: #d4d4d8">${escaped}</span>`
        }
      })
      .join('')

    return html
  }

  const frameworkBadge = snippet.stack?.framework
  const languageBadge = snippet.snippet_language

  return (
    <>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 border border-zinc-700">
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">{snippet.title}</h3>
              <div className="flex gap-2 mt-1">
                {frameworkBadge && (() => {
                  const colors = getFrameworkColor(frameworkBadge)
                  return (
                    <span className={`text-[10px] ${colors.bg} ${colors.text} ${colors.border} px-1.5 py-0.5 rounded border font-medium`}>
                      {frameworkBadge}
                    </span>
                  )
                })()}
                {languageBadge && (() => {
                  const colors = getLanguageColor(languageBadge)
                  return (
                    <span className={`text-[10px] ${colors.bg} ${colors.text} ${colors.border} px-1.5 py-0.5 rounded border font-medium`}>
                      {languageBadge}
                    </span>
                  )
                })()}
              </div>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Code Preview with Syntax Highlighting */}
        <div className="bg-[#0d1117] p-4 font-mono text-xs overflow-hidden relative h-32">
          <div className="absolute top-2 right-2 z-10">
            <span className="text-[10px] text-zinc-600">
              {snippet.slug}.{snippet.snippet_language || 'ts'}
            </span>
          </div>
          <div className="opacity-95">
            <pre
              className="whitespace-pre-wrap break-words text-zinc-300 leading-[1.6]"
              dangerouslySetInnerHTML={{
                __html: highlightCode(snippet.code_snippet?.slice(0, 300) || '')
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Actions */}
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

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom">
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-sm">{toast.title}</h4>
            <p className="text-xs text-zinc-400">{toast.desc}</p>
          </div>
        </div>
      )}
    </>
  )
}
