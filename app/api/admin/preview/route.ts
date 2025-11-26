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

        // 코드 블록에 스타일 추가
        html = html
            .replace(/<pre>/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">')
            .replace(/<code>/g, '<code class="font-mono text-sm">')

        return NextResponse.json({ html })
    } catch (error) {
        console.error('Preview error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'MDX 컴파일 실패' },
            { status: 500 }
        )
    }
}
