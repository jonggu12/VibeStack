import { NextRequest, NextResponse } from 'next/server'
import { incrementViewCount } from '@/app/actions/content'

export async function POST(request: NextRequest) {
    try {
        const { contentId } = await request.json()

        if (!contentId) {
            return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
        }

        // 조회수 증가
        await incrementViewCount(contentId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error tracking view:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
