'use client'

import { CopyButton } from '@/components/tutorial/copy-button'

interface PromptBlockProps {
    prompt: string
}

export function PromptBlock({ prompt }: PromptBlockProps) {
    return (
        <div className="my-6 relative group">
            <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">
                RECOMMENDED PROMPT
            </div>
            <div className="bg-zinc-900 border border-indigo-500/30 rounded-xl p-5 hover:border-indigo-500 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <code className="text-sm md:text-base text-zinc-100 bg-transparent p-0 font-normal leading-relaxed block w-full whitespace-pre-wrap font-mono">
                        {prompt}
                    </code>
                    <div className="shrink-0">
                        <CopyButton text={prompt} label="" />
                    </div>
                </div>
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-center">
                👆 위 내용을 복사해서 <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">Cmd + L</code> (Chat) 창에 붙여넣으세요.
            </p>
        </div>
    )
}
