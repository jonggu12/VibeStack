import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { compileMDXContent } from '@/lib/mdx'
import { renderToStaticMarkup } from 'react-dom/server'

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

        // MDX 컴파일
        const { content: mdxElement } = await compileMDXContent(content)

        // React Element를 HTML 문자열로 변환
        const html = renderToStaticMarkup(mdxElement)

        return NextResponse.json({ html })
    } catch (error) {
        console.error('Preview error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'MDX 컴파일 실패' },
            { status: 500 }
        )
    }
}
