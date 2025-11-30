'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps {
    text: string
    label?: string
}

export function CopyButton({ text, label = '프롬프트 복사' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success('프롬프트 복사 완료!', {
                description: 'Cursor (Ctrl+I)에 붙여넣으세요.',
            })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('복사에 실패했습니다.')
        }
    }

    return (
        <button
            onClick={handleCopy}
            className={`
        text-sm font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg active:scale-95
        ${copied
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                }
      `}
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '복사됨!' : label}
        </button>
    )
}
