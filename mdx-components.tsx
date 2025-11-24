import type { MDXComponents } from 'mdx/types'

// MDX에서 사용할 커스텀 컴포넌트들을 정의
// 이 파일은 Next.js App Router에서 MDX를 사용하기 위해 필수

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // 기본 HTML 요소들을 커스텀 스타일로 오버라이드
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-medium mt-4 mb-2 text-gray-700">
                {children}
            </h3>
        ),
        p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-4">
                {children}
            </p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 text-gray-600 space-y-1">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="ml-4">{children}</li>
        ),
        a: ({ href, children }) => {
            const hrefString = typeof href === 'string' ? href : undefined
            return (
                <a
                    href={hrefString}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target={hrefString?.startsWith('http') ? '_blank' : undefined}
                    rel={hrefString?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                    {children}
                </a>
            )
        },
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
                {children}
            </blockquote>
        ),
        code: ({ children, className }) => {
            // 인라인 코드 vs 코드 블록 구분
            const classNameString = typeof className === 'string' ? className : undefined
            const isInline = !classNameString
            if (isInline) {
                return (
                    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                    </code>
                )
            }
            return (
                <code className={classNameString}>
                    {children}
                </code>
            )
        },
        pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                {children}
            </pre>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-600 border-t">
                {children}
            </td>
        ),
        hr: () => <hr className="my-8 border-gray-200" />,
        // 추가 커스텀 컴포넌트들은 여기에 등록
        ...components,
    }
}
