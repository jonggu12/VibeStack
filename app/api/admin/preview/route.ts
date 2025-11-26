import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'

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

        // MDX 콘텐츠를 그대로 반환 (클라이언트에서 컴파일)
        return NextResponse.json({ mdx: content })
    } catch (error) {
        console.error('Preview error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'MDX 컴파일 실패' },
            { status: 500 }
        )
    }
}
