import React from 'react'

// MDX 커스텀 컴포넌트들
export { Callout } from './callout'
export { CodeBlock } from './code-block'
export { Checkpoint } from './checkpoint'
export { Quiz } from './quiz'
export { Step, Steps } from './step'
export { PreBlock } from './pre-block'
export { CopyButton } from './copy-button'

// MDX에서 사용할 컴포넌트 맵
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import { Checkpoint } from './checkpoint'
import { Quiz } from './quiz'
import { Step, Steps } from './step'
import { PreBlock } from './pre-block'

// 기본 HTML 요소 스타일링
const htmlComponents = {
    h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
            {children}
        </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200 border-b pb-2">
            {children}
        </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700 dark:text-gray-300">
            {children}
        </h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {children}
        </p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-gray-400 space-y-2 ml-4">
            {children}
        </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside mb-4 text-gray-600 dark:text-gray-400 space-y-2 ml-4">
            {children}
        </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="ml-2">{children}</li>
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
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-gray-50 dark:bg-gray-800 py-2">
            {children}
        </blockquote>
    ),
    code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
        // 인라인 코드 vs 코드 블록 구분
        const isInline = !className
        if (isInline) {
            return (
                <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                </code>
            )
        }
        return (
            <code className={className}>
                {children}
            </code>
        )
    },
    pre: PreBlock,
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
            {children}
        </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
            {children}
        </td>
    ),
    hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic">{children}</em>
    ),
}

export const mdxComponents = {
    // 기본 HTML 요소들
    ...htmlComponents,
    // 커스텀 컴포넌트들
    Callout,
    CodeBlock,
    Checkpoint,
    Quiz,
    Step,
    Steps,
}
