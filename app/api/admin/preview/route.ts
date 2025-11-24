import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { marked } from 'marked'

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
                        info: 'border-blue-500 bg-blue-50',
                        tip: 'border-green-500 bg-green-50',
                        warning: 'border-yellow-500 bg-yellow-50',
                        error: 'border-red-500 bg-red-50',
                        success: 'border-green-500 bg-green-50',
                    }
                    const color = colors[type] || colors.info
                    const titleHtml = title ? `<strong>${title}</strong><br/>` : ''
                    return `<div class="border-l-4 ${color} p-4 my-4 rounded">${titleHtml}${inner}</div>`
                }
            )
            // Checkpoint 컴포넌트 처리
            .replace(/<Checkpoint[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/Checkpoint>/g,
                (_, title, inner) => `<div class="border border-green-300 bg-green-50 p-4 my-4 rounded"><strong>✓ ${title}</strong><p>${inner}</p></div>`
            )
            // 기타 컴포넌트 태그 제거
            .replace(/<(Quiz|Steps|Step|CodeBlock)[^>]*>([\s\S]*?)<\/\1>/g, '$2')
            .replace(/<(Quiz|Steps|Step|CodeBlock)[^>]*\/>/g, '')

        // Markdown을 HTML로 변환
        const html = await marked.parse(processedContent)

        return NextResponse.json({ html })
    } catch (error) {
        console.error('Preview error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'MDX 컴파일 실패' },
            { status: 500 }
        )
    }
}
