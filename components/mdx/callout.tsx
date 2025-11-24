'use client'

import { AlertCircle, Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip'

interface CalloutProps {
    type?: CalloutType
    title?: string
    children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { bg: string; border: string; icon: typeof Info; iconColor: string }> = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Info,
        iconColor: 'text-blue-500',
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: AlertCircle,
        iconColor: 'text-red-500',
    },
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: CheckCircle,
        iconColor: 'text-green-500',
    },
    tip: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: Lightbulb,
        iconColor: 'text-purple-500',
    },
}

const defaultTitles: Record<CalloutType, string> = {
    info: '정보',
    warning: '주의',
    error: '오류',
    success: '완료',
    tip: '팁',
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const style = calloutStyles[type]
    const Icon = style.icon
    const displayTitle = title || defaultTitles[type]

    return (
        <div className={`${style.bg} ${style.border} border rounded-lg p-4 my-4`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1">
                    {displayTitle && (
                        <p className="font-semibold text-gray-900 mb-1">{displayTitle}</p>
                    )}
                    <div className="text-gray-700 text-sm">{children}</div>
                </div>
            </div>
        </div>
    )
}
