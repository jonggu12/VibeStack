'use client'

import { useEffect, useState, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { mdxComponents } from '@/components/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

interface MDXPreviewProps {
    content: string
}

export function MDXPreview({ content }: MDXPreviewProps) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const compileMDX = async () => {
            if (!content.trim()) {
                setMdxSource(null)
                return
            }

            setLoading(true)
            setError(null)

            try {
                // 클라이언트에서 직접 MDX 컴파일
                const mdx = await serialize(content, {
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeSlug, rehypeHighlight],
                    },
                })
                setMdxSource(mdx)
            } catch (err) {
                console.error('MDX compile error:', err)
                setError(err instanceof Error ? err.message : 'MDX 컴파일 실패')
            } finally {
                setLoading(false)
            }
        }

        // 디바운스: 타이핑 중에 너무 많은 요청 방지
        const timer = setTimeout(compileMDX, 500)
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
                <p className="text-red-600 font-semibold">컴파일 오류</p>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
        )
    }

    if (!mdxSource) {
        return (
            <div className="min-h-[400px] bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-500">콘텐츠를 입력하면 미리보기가 표시됩니다.</p>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white rounded-lg border min-h-[400px] max-w-none prose prose-lg">
            <Suspense fallback={<div>Loading...</div>}>
                <MDXRemote {...mdxSource} components={mdxComponents} />
            </Suspense>
        </div>
    )
}
