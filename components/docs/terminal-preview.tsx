'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface TerminalPreviewProps {
    children: React.ReactNode
}

export function TerminalPreview({ children }: TerminalPreviewProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!children) return
        try {
            // Extract text content from children (simplified)
            const text = document.getElementById('terminal-content')?.innerText || ''
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    return (
        <div className="bg-zinc-950 rounded-lg border border-zinc-800 my-4 font-mono text-sm overflow-hidden group relative">
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <button
                    onClick={handleCopy}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white"
                    title="Copy"
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <div id="terminal-content" className="p-4 text-zinc-300 overflow-x-auto">
                {children}
            </div>
        </div>
    )
}
