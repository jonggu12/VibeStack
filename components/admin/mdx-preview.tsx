'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface MDXPreviewProps {
    content: string
}

export function MDXPreview({ content }: MDXPreviewProps) {
    const [html, setHtml] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPreview = async () => {
            if (!content.trim()) {
                setHtml('')
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/admin/preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || `미리보기 생성 실패 (${response.status})`)
                }

                setHtml(data.html)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류')
            } finally {
                setLoading(false)
            }
        }

        // 디바운스: 타이핑 중에 너무 많은 요청 방지
        const timer = setTimeout(fetchPreview, 500)
        return () => clearTimeout(timer)
    }, [content])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">미리보기 생성 중...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[400px] bg-red-50 rounded-lg p-4">
                <p className="text-red-600">오류: {error}</p>
                <pre className="mt-4 text-sm text-gray-600 whitespace-pre-wrap">{content}</pre>
            </div>
        )
    }

    if (!html) {
        return (
            <div className="min-h-[400px] bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-500">콘텐츠를 입력하면 미리보기가 표시됩니다.</p>
            </div>
        )
    }

    return (
        <div
            className="p-6 bg-white rounded-lg border min-h-[400px] max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
