'use client'

import { useState } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'

type PromptBlockProps = {
  children: React.ReactNode
  title?: string
}

export function PromptBlock({ children, title = 'AI Prompt' }: PromptBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : children?.toString() || ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-purple-950/30 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-300">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              복사됨!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              복사
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 text-sm leading-relaxed text-purple-100">
        {children}
      </div>
    </div>
  )
}
