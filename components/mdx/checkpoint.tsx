'use client'

import { useState } from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface CheckpointProps {
    id: string
    title: string
    children?: React.ReactNode
}

export function Checkpoint({ id, title, children }: CheckpointProps) {
    const [completed, setCompleted] = useState(false)

    const handleToggle = () => {
        setCompleted(!completed)
        // TODO: 서버에 진행 상태 저장
        // saveProgress(id, !completed)
    }

    return (
        <div
            className={`my-6 p-4 rounded-lg border-2 transition-colors ${
                completed
                    ? 'bg-green-950/20 border-green-500/50'
                    : 'bg-zinc-900/50 border-zinc-700 hover:border-indigo-500/50'
            }`}
        >
            <button
                onClick={handleToggle}
                className="flex items-center gap-3 w-full text-left"
            >
                {completed ? (
                    <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                ) : (
                    <Circle className="w-6 h-6 text-zinc-500 shrink-0" />
                )}
                <span
                    className={`font-semibold ${
                        completed ? 'text-green-400 line-through' : 'text-white'
                    }`}
                >
                    {title}
                </span>
            </button>

            {children && (
                <div className={`mt-3 ml-9 text-sm ${completed ? 'text-green-300' : 'text-zinc-400'}`}>
                    {children}
                </div>
            )}
        </div>
    )
}
