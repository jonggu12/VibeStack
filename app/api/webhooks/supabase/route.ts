import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { indexContent, deleteContent, AlgoliaContentRecord } from '@/lib/algolia'

// Supabase Webhook Secret (환경변수로 설정)
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET || ''

// Webhook 서명 검증
function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
        console.warn('SUPABASE_WEBHOOK_SECRET not set, skipping verification')
        return true // 개발 환경에서는 검증 스킵
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
    const digest = hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

// Supabase Webhook Payload Type
interface SupabaseWebhookPayload {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    table: string
    schema: string
    record: Record<string, unknown> | null
    old_record: Record<string, unknown> | null
}

// DB 레코드를 Algolia 레코드로 변환
function toAlgoliaRecord(record: Record<string, unknown>): AlgoliaContentRecord {
    return {
        objectID: record.id as string,
        type: record.type as 'doc' | 'tutorial' | 'snippet',
        title: record.title as string,
        description: (record.description as string) || '',
        slug: record.slug as string,
        stack: (record.stack as Record<string, string>) || {},
        tags: [], // 태그는 별도 조인 필요 (아래에서 처리)
        difficulty: (record.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        estimatedTimeMins: (record.estimated_time_mins as number) || 0,
        isPremium: (record.is_premium as boolean) || false,
        author: record.author_id as string | undefined,
        publishedAt: record.published_at
            ? new Date(record.published_at as string).getTime()
            : Date.now(),
        updatedAt: record.updated_at
            ? new Date(record.updated_at as string).getTime()
            : Date.now(),
        views: (record.view_count as number) || 0,
        completions: (record.completion_count as number) || 0,
        avgRating: (record.avg_rating as number) || 0,
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text()
        const signature = req.headers.get('x-supabase-signature') || ''

        // 서명 검증
        if (WEBHOOK_SECRET && !verifyWebhookSignature(payload, signature)) {
            console.error('Invalid webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        const data: SupabaseWebhookPayload = JSON.parse(payload)

        // contents 테이블만 처리
        if (data.table !== 'contents') {
            return NextResponse.json({ message: 'Ignored: not contents table' })
        }

        console.log(`[SUPABASE WEBHOOK] ${data.type} on ${data.table}`)

        switch (data.type) {
            case 'INSERT':
            case 'UPDATE': {
                if (!data.record) {
                    return NextResponse.json({ error: 'No record data' }, { status: 400 })
                }

                // published 상태인 경우만 인덱싱
                if (data.record.status !== 'published') {
                    // 비공개로 변경된 경우 인덱스에서 삭제
                    if (data.type === 'UPDATE' && data.old_record?.status === 'published') {
                        await deleteContent(data.record.id as string)
                        console.log(`[ALGOLIA] Removed unpublished content: ${data.record.id}`)
                    }
                    return NextResponse.json({ message: 'Content not published, skipped' })
                }

                const algoliaRecord = toAlgoliaRecord(data.record)
                const success = await indexContent(algoliaRecord)

                if (success) {
                    return NextResponse.json({
                        message: `Content ${data.type === 'INSERT' ? 'indexed' : 'updated'}`,
                        objectID: algoliaRecord.objectID
                    })
                } else {
                    return NextResponse.json({ error: 'Failed to index content' }, { status: 500 })
                }
            }

            case 'DELETE': {
                if (!data.old_record) {
                    return NextResponse.json({ error: 'No old_record data' }, { status: 400 })
                }

                const objectID = data.old_record.id as string
                const success = await deleteContent(objectID)

                if (success) {
                    return NextResponse.json({ message: 'Content deleted from index', objectID })
                } else {
                    return NextResponse.json({ error: 'Failed to delete from index' }, { status: 500 })
                }
            }

            default:
                return NextResponse.json({ message: 'Unknown operation type' })
        }
    } catch (error) {
        console.error('Supabase webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}

// Health check
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        webhook: 'supabase-algolia-sync',
        hasSecret: !!WEBHOOK_SECRET
    })
}
