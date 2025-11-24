'use client'

interface StepProps {
    number: number
    title: string
    children: React.ReactNode
}

export function Step({ number, title, children }: StepProps) {
    return (
        <div className="my-6">
            <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {number}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="ml-11 text-gray-700">{children}</div>
        </div>
    )
}

interface StepsProps {
    children: React.ReactNode
}

export function Steps({ children }: StepsProps) {
    return (
        <div className="my-8 relative">
            {/* 연결선 */}
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200" />
            <div className="relative">{children}</div>
        </div>
    )
}
