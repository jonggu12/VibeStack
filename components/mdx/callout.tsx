'use client'

import { AlertCircle, Info, AlertTriangle, CheckCircle, Lightbulb, HelpCircle } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'question'

interface CalloutProps {
    type?: CalloutType
    title?: string
    children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: typeof Info; iconColor: string }> = {
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        icon: Info,
        iconColor: 'text-blue-300',
    },
    warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        icon: AlertTriangle,
        iconColor: 'text-yellow-300',
    },
    error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        icon: AlertCircle,
        iconColor: 'text-red-300',
    },
    success: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        icon: CheckCircle,
        iconColor: 'text-emerald-300',
    },
    tip: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        icon: Lightbulb,
        iconColor: 'text-purple-300',
    },
    question: {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        icon: HelpCircle,
        iconColor: 'text-indigo-300',
    },
}

const defaultTitles: Record<CalloutType, string> = {
    info: '정보',
    warning: '주의',
    error: '오류',
    success: '완료',
    tip: '팁',
    question: '질문',
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const style = calloutStyles[type]
    const Icon = style.icon
    const displayTitle = title || defaultTitles[type]

    return (
        <div className={`${style.bg} ${style.border} border rounded-xl p-4 my-6`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1 space-y-2">
                    {displayTitle && (
                        <p className="font-bold text-sm text-white">{displayTitle}</p>
                    )}
                    <div className="text-zinc-300 text-sm leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    )
}
