import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { marked } from 'marked'

// marked 옵션 설정
marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // 줄바꿈을 <br>로 변환
})

export async function POST(request: NextRequest) {
    // 관리자 인증 체크
    const user = await currentUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.publicMetadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const { content } = await request.json()

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: '콘텐츠가 필요합니다' }, { status: 400 })
        }

        // MDX 컴포넌트 태그를 HTML로 변환
        let processedContent = content
            // Callout 컴포넌트 처리
            .replace(/<Callout\s+type="(\w+)"(?:\s+title="([^"]*)")?>([\s\S]*?)<\/Callout>/g,
                (_, type, title, inner) => {
                    const colors: Record<string, string> = {
                        info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
                        tip: 'bg-green-50 border-l-4 border-green-500 text-green-900',
                        warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900',
                        error: 'bg-red-50 border-l-4 border-red-500 text-red-900',
                        success: 'bg-green-50 border-l-4 border-green-500 text-green-900',
                    }
                    const color = colors[type] || colors.info
                    const titleHtml = title ? `<strong>${title}</strong><br/>` : ''
                    return `<div class="${color} p-4 my-4 rounded">${titleHtml}${inner}</div>`
                }
            )
            // Checkpoint 컴포넌트 처리
            .replace(/<Checkpoint[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/Checkpoint>/g,
                (_, title, inner) => `<div class="bg-green-50 border border-green-300 p-4 my-4 rounded"><strong>✓ ${title}</strong><p>${inner}</p></div>`
            )
            // 기타 컴포넌트 태그 제거
            .replace(/<(Quiz|Steps|Step|CodeBlock)[^>]*>([\s\S]*?)<\/\1>/g, '$2')
            .replace(/<(Quiz|Steps|Step|CodeBlock)[^>]*\/>/g, '')

        // Markdown을 HTML로 변환
        let html = await marked.parse(processedContent)

        // 실제 MDX 컴포넌트와 동일한 스타일 적용
        html = html
            // 헤딩 스타일
            .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">')
            .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-gray-800 border-b pb-2">')
            .replace(/<h3>/g, '<h3 class="text-xl font-medium mt-4 mb-2 text-gray-700">')
            .replace(/<h4>/g, '<h4 class="text-lg font-medium mt-3 mb-2 text-gray-700">')

            // 문단 스타일
            .replace(/<p>/g, '<p class="text-gray-600 leading-relaxed mb-4">')

            // 리스트 스타일
            .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 text-gray-600 space-y-2 ml-4">')
            .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 text-gray-600 space-y-2 ml-4">')
            .replace(/<li>/g, '<li class="ml-2">')

            // 링크 스타일
            .replace(/<a /g, '<a class="text-blue-600 hover:text-blue-800 underline" ')

            // 코드 블록 스타일
            .replace(/<pre>/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">')
            .replace(/<code>/g, '<code class="font-mono text-sm">')

            // 인용구 스타일
            .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-gray-50 py-2">')

            // Strong, Em 스타일
            .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
            .replace(/<em>/g, '<em class="italic text-gray-700">')

        return NextResponse.json({ html })
    } catch (error) {
        console.error('Preview error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'MDX 컴파일 실패' },
            { status: 500 }
        )
    }
}
