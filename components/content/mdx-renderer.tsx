'use client'

import { useEffect, useState } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

// MDX에서 사용할 커스텀 컴포넌트들
const components = {
    // 기본 요소 스타일링
    h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 border-b pb-2">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">{children}</h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside mb-4 text-gray-600 space-y-2 ml-4">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside mb-4 text-gray-600 space-y-2 ml-4">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a
            href={href}
            className="text-blue-600 hover:text-blue-800 underline"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2 rounded-r">
            {children}
        </blockquote>
    ),
    code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
        const isInline = !className
        if (isInline) {
            return (
                <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                </code>
            )
        }
        return <code className={className}>{children}</code>
    },
    pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono">
            {children}
        </pre>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-700">
            {children}
        </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="px-4 py-3 text-sm text-gray-600 border-t">{children}</td>
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
    img: ({ src, alt }: { src?: string; alt?: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ''} className="rounded-lg my-4 max-w-full h-auto" />
    ),
}

interface MDXRendererProps {
    source: MDXRemoteSerializeResult
}

export function MDXRenderer({ source }: MDXRendererProps) {
    return (
        <div className="prose prose-lg max-w-none">
            <MDXRemote {...source} components={components} />
        </div>
    )
}

// 로딩 상태를 위한 스켈레톤
export function MDXSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
    )
}
