import React from 'react'

// MDX 커스텀 컴포넌트들
export { Callout } from './callout'
export { CodeBlock } from './code-block'
export { Checkpoint } from './checkpoint'
export { Quiz } from './quiz'
export { Step, Steps } from './step'
export { PreBlock } from './pre-block'
export { CopyButton } from './copy-button'
export { Terminal } from './terminal'
export { PromptBlock } from './prompt-block'
export { Feedback } from './feedback'
export { Tabs, Tab } from './tabs'
export { StackBadge } from './stack-badge'
export { Do, Dont } from './do-dont'

// Tutorial 컴포넌트들
export { PromptCopy } from '../tutorial/prompt-copy'
export { Checklist } from '../tutorial/checklist'

// MDX에서 사용할 컴포넌트 맵
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import { Checkpoint } from './checkpoint'
import { Quiz } from './quiz'
import { Step, Steps } from './step'
import { PreBlock } from './pre-block'
import { Terminal } from './terminal'
import { PromptBlock } from './prompt-block'
import { Feedback } from './feedback'
import { Tabs, Tab } from './tabs'
import { StackBadge } from './stack-badge'
import { Do, Dont } from './do-dont'
import { PromptCopy } from '../tutorial/prompt-copy'
import { Checklist } from '../tutorial/checklist'

// React Icons 제거됨 - MDX 문서에서는 Callout, Info, Tip, Warning, Highlight 등 커스텀 컴포넌트만 사용

// Callout aliases for MDX (프롬프트 템플릿용)
function Info({ children, title }: { children: React.ReactNode; title?: string }) {
    return <Callout type="info" title={title}>{children}</Callout>
}

function Tip({ children, title }: { children: React.ReactNode; title?: string }) {
    return <Callout type="tip" title={title}>{children}</Callout>
}

function Warning({ children, title }: { children: React.ReactNode; title?: string }) {
    return <Callout type="warning" title={title}>{children}</Callout>
}

function Highlight({ children, title }: { children: React.ReactNode; title?: string }) {
    return <Callout type="info" title={title}>{children}</Callout>
}

// children에서 텍스트 추출하여 slug 생성
function getTextFromChildren(children: React.ReactNode): string {
    if (typeof children === 'string') return children
    if (typeof children === 'number') return String(children)
    if (Array.isArray(children)) return children.map(getTextFromChildren).join('')
    if (React.isValidElement(children) && children.props && typeof children.props === 'object' && 'children' in children.props) {
        return getTextFromChildren((children.props as { children: React.ReactNode }).children)
    }
    return ''
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w가-힣-]/g, '')
}

// 기본 HTML 요소 스타일링 (Dark theme)
const htmlComponents = {
    h1: ({ children }: { children?: React.ReactNode }) => {
        const text = getTextFromChildren(children)
        const id = generateSlug(text)
        return (
            <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-white scroll-mt-24">
                {children}
            </h1>
        )
    },
    h2: ({ children }: { children?: React.ReactNode }) => {
        const text = getTextFromChildren(children)
        const id = generateSlug(text)
        return (
            <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 text-white border-b border-zinc-800 pb-2 scroll-mt-24">
                {children}
            </h2>
        )
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
        const text = getTextFromChildren(children)
        const id = generateSlug(text)
        return (
            <h3 id={id} className="text-xl font-medium mt-4 mb-2 text-zinc-200 scroll-mt-24">
                {children}
            </h3>
        )
    },
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-zinc-400 leading-relaxed mb-4">
            {children}
        </p>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside mb-4 text-zinc-400 space-y-2 ml-4">
            {children}
        </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside mb-4 text-zinc-400 space-y-2 ml-4">
            {children}
        </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="ml-2">{children}</li>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a
            href={href}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-zinc-400 my-4 bg-zinc-900/50 py-2 rounded-r">
            {children}
        </blockquote>
    ),
    code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
        // 인라인 코드 vs 코드 블록 구분
        const isInline = !className
        if (isInline) {
            return (
                <code className="bg-zinc-900 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-800">
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
        <div className="overflow-x-auto mb-4 rounded-lg border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="px-4 py-2 bg-zinc-900 text-left text-sm font-semibold text-zinc-300">
            {children}
        </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="px-4 py-2 text-sm text-zinc-400 border-t border-zinc-800">
            {children}
        </td>
    ),
    hr: () => <hr className="my-8 border-zinc-800" />,
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic text-zinc-300">{children}</em>
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
    Terminal,
    PromptBlock,
    Feedback,
    Tabs,
    Tab,
    StackBadge,
    Do,
    Dont,
    // Tutorial 컴포넌트들
    PromptCopy,
    Checklist,
    // Callout aliases (프롬프트 템플릿용)
    Info,
    Tip,
    Warning,
    Highlight,
}
