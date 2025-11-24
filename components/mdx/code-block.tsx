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
        <div className="relative group my-4">
            {/* 파일명 헤더 */}
            {filename && (
                <div className="bg-gray-800 text-gray-400 text-sm px-4 py-2 rounded-t-lg border-b border-gray-700 font-mono">
                    {filename}
                </div>
            )}

            {/* 복사 버튼 */}
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="복사"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {/* 코드 블록 */}
            <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono ${filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
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
                                    <span className="inline-block w-8 text-gray-500 select-none text-right mr-4">
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

            {/* 언어 표시 */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
                {language}
            </div>
        </div>
    )
}
