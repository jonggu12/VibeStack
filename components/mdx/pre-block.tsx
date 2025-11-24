'use client'

import { useState, useRef } from 'react'
import { Copy, Check } from 'lucide-react'

interface PreBlockProps {
    children?: React.ReactNode
}

export function PreBlock({ children }: PreBlockProps) {
    const [copied, setCopied] = useState(false)
    const preRef = useRef<HTMLPreElement>(null)

    const handleCopy = async () => {
        if (!preRef.current) return

        // pre 태그 내의 텍스트 추출
        const text = preRef.current.textContent || ''

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('복사 실패:', err)
        }
    }

    return (
        <div className="relative group my-4">
            {/* 복사 버튼 */}
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="코드 복사"
            >
                {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                )}
            </button>

            {/* 코드 블록 */}
            <pre
                ref={preRef}
                className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"
            >
                {children}
            </pre>
        </div>
    )
}
