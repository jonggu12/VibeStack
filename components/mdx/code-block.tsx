'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
    children: string
    language?: string
    filename?: string
    showLineNumbers?: boolean
    highlightLines?: number[]
}

export function CodeBlock({
    children,
    language = 'typescript',
    filename,
    showLineNumbers = false,
    highlightLines = [],
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const lines = children.split('\n')

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-800 bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    {filename && <span className="text-xs font-medium text-zinc-400">{filename}</span>}
                    <span className="text-[10px] uppercase font-bold text-zinc-600">{language}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            복사됨
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            복사
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="relative">
                <pre className={`p-4 overflow-x-auto text-sm font-mono text-zinc-300 ${showLineNumbers ? 'pl-12' : ''}`}>
                    <code className={`language-${language}`}>
                        {showLineNumbers ? (
                            lines.map((line, index) => {
                                const lineNum = index + 1
                                const isHighlighted = highlightLines.includes(lineNum)
                                return (
                                    <div
                                        key={index}
                                        className={`${isHighlighted ? 'bg-yellow-500/20 -mx-4 px-4' : ''}`}
                                    >
                                        <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">
                                            {lineNum}
                                        </span>
                                        {line}
                                    </div>
                                )
                            })
                        ) : (
                            children
                        )}
                    </code>
                </pre>
            </div>
        </div>
    )
}
