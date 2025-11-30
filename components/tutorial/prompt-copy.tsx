'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type PromptCopyProps = {
  children: string
  label?: string
}

export function PromptCopy({ children, label = 'COPY THIS PROMPT' }: PromptCopyProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="relative group mb-6">
        {/* Label Badge */}
        <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">
          {label}
        </div>

        {/* Prompt Box */}
        <div className="bg-zinc-950 border border-indigo-500/40 rounded-xl p-6 hover:border-indigo-500 transition-colors shadow-2xl">
          <code className="block text-zinc-200 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
            {children}
          </code>

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className={`text-sm font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                copied
                  ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
              } text-white`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  프롬프트 복사
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-8 right-8 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
          <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <h4 className="font-bold text-sm">프롬프트 복사 완료!</h4>
            <p className="text-xs text-zinc-400">Cursor (Ctrl+I)에 붙여넣으세요.</p>
          </div>
        </div>
      )}
    </>
  )
}
