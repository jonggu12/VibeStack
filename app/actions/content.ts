'use server'

import { supabase, supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import type { ContentType, DifficultyLevel, ContentStatus } from '@/types/content'

// DB에서 가져온 콘텐츠 타입
export interface DBContent {
    id: string
    type: ContentType
    slug: string
    title: string
    description: string | null
    content: string | null // MDX 콘텐츠
    difficulty: DifficultyLevel | null
    estimated_time_mins: number | null
    is_premium: boolean
    status: ContentStatus
    stack: Record<string, string> | null
    author_id: string | null
    view_count: number
    completion_count: number
    avg_rating: number | null
    published_at: string | null
    created_at: string
    updated_at: string
}

// 콘텐츠 목록 조회 옵션
interface GetContentsOptions {
    type?: ContentType
    status?: ContentStatus
    limit?: number
    offset?: number
    difficulty?: DifficultyLevel
    bypassRLS?: boolean // Admin 전용: RLS 우회
}

/**
 * ID로 콘텐츠 조회
 */
export async function getContent(id: string, bypassRLS = false): Promise<DBContent | null> {
    // Admin이 모든 상태의 콘텐츠를 조회할 때는 supabaseAdmin 사용
    const client = bypassRLS ? supabaseAdmin : supabase

    const { data, error } = await client
        .from('contents')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching content:', error)
        return null
    }

    return data as DBContent
}

/**
 * Slug로 콘텐츠 조회
 */
export async function getContentBySlug(
    slug: string,
    type?: ContentType
): Promise<DBContent | null> {
    let query = supabase
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')

    if (type) {
        query = query.eq('type', type)
    }

    const { data, error } = await query.single()

    if (error) {
        console.error('Error fetching content by slug:', error)
        return null
    }

    return data as DBContent
}

/**
 * 콘텐츠 목록 조회
 */
export async function getContents(options: GetContentsOptions = {}): Promise<DBContent[]> {
    const {
        type,
        status = 'published',
        limit = 20,
        offset = 0,
        difficulty,
        bypassRLS = false, // Admin 전용: RLS 우회 여부
    } = options

    // Admin이 모든 상태의 콘텐츠를 조회할 때는 supabaseAdmin 사용
    const client = bypassRLS ? supabaseAdmin : supabase

    let query = client
        .from('contents')
        .select('*')
        .eq('status', status)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (type) {
        query = query.eq('type', type)
    }

    if (difficulty) {
        query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching contents:', error)
        return []
    }

    return (data || []) as DBContent[]
}

/**
 * 타입별 콘텐츠 목록 조회
 */
export async function getContentsByType(
    type: ContentType,
    limit = 20
): Promise<DBContent[]> {
    return getContents({ type, limit })
}

/**
 * 관련 콘텐츠 조회 (스택 기반 매칭)
 */
export async function getRelatedContents(
    contentId: string,
    limit = 4
): Promise<DBContent[]> {
    // 현재 콘텐츠 조회
    const content = await getContent(contentId)
    if (!content) return []

    // 모든 발행된 콘텐츠 조회 (현재 콘텐츠 제외)
    const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('status', 'published')
        .neq('id', contentId)

    if (error) {
        console.error('Error fetching related contents:', error)
        return []
    }

    const allContents = (data || []) as DBContent[]

    // 스택 기반 점수 계산
    const scoredContents = allContents.map(candidate => {
        let score = 0

        // 1. 스택 매칭 (가장 높은 가중치 - 각 매칭당 30점)
        if (content.stack && candidate.stack) {
            const currentStack = content.stack as Record<string, string>
            const candidateStack = candidate.stack as Record<string, string>

            Object.entries(currentStack).forEach(([key, value]) => {
                if (candidateStack[key] === value) {
                    score += 30
                }
            })
        }

        // 2. 같은 타입 (+20점)
        if (candidate.type === content.type) {
            score += 20
        }

        // 3. 같은 난이도 (+10점)
        if (candidate.difficulty === content.difficulty) {
            score += 10
        }

        // 4. 조회수 기반 인기도 (최대 +5점)
        const popularityScore = Math.min(5, (candidate.view_count || 0) / 100)
        score += popularityScore

        return { content: candidate, score }
    })

    // 점수순 정렬 및 상위 N개 반환
    return scoredContents
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.content)
}

/**
 * 조회수 증가 (RLS 우회 필요)
 */
export async function incrementViewCount(contentId: string): Promise<void> {
    try {
        console.log('[incrementViewCount] Starting for contentId:', contentId)

        // 현재 조회수 가져오기
        const { data: content, error: selectError } = await supabaseAdmin
            .from('contents')
            .select('view_count')
            .eq('id', contentId)
            .single()

        if (selectError) {
            console.error('[incrementViewCount] Select error:', selectError)
            throw selectError
        }

        if (!content) {
            console.error('[incrementViewCount] Content not found:', contentId)
            throw new Error('Content not found')
        }

        console.log('[incrementViewCount] Current view_count:', content.view_count)

        // 조회수 +1
        const newCount = (content.view_count || 0) + 1
        const { error: updateError } = await supabaseAdmin
            .from('contents')
            .update({ view_count: newCount })
            .eq('id', contentId)

        if (updateError) {
            console.error('[incrementViewCount] Update error:', updateError)
            throw updateError
        }

        console.log('[incrementViewCount] Success! New count:', newCount)
    } catch (error) {
        console.error('[incrementViewCount] Fatal error:', error)
        throw error
    }
}

/**
 * 완료 수 증가
 */
export async function incrementCompletionCount(contentId: string): Promise<void> {
    await supabase.rpc('increment_completion_count', { content_id: contentId })
}

// 콘텐츠 생성/수정 입력 타입
export interface ContentInput {
    title: string
    slug: string
    description?: string
    type: ContentType
    difficulty?: DifficultyLevel
    status: ContentStatus
    is_premium: boolean
    content?: string
    estimated_time_mins?: number
    stack?: Record<string, string>
}

/**
 * 콘텐츠 생성 (관리자 전용 - RLS 우회)
 */
export async function createContent(input: ContentInput): Promise<{ success: boolean; id?: string; error?: string }> {
    const { data, error } = await supabaseAdmin
        .from('contents')
        .insert({
            ...input,
            published_at: input.status === 'published' ? new Date().toISOString() : null,
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error creating content:', error)
        return { success: false, error: error.message }
    }

    // 캐시 무효화
    revalidatePath('/admin/content')

    return { success: true, id: data.id }
}

/**
 * 콘텐츠 수정 (관리자 전용 - RLS 우회)
 */
export async function updateContent(
    id: string,
    input: Partial<ContentInput>
): Promise<{ success: boolean; error?: string }> {
    // 먼저 기존 콘텐츠 조회 (캐시 무효화용, RLS 우회)
    const existingContent = await getContent(id, true)

    const updateData: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() }

    // 상태가 published로 변경되면 published_at 설정
    if (input.status === 'published') {
        if (existingContent && !existingContent.published_at) {
            updateData.published_at = new Date().toISOString()
        }
    }

    const { error } = await supabaseAdmin
        .from('contents')
        .update(updateData)
        .eq('id', id)

    if (error) {
        console.error('Error updating content:', error)
        return { success: false, error: error.message }
    }

    // 캐시 무효화 - 콘텐츠 페이지 새로고침
    if (existingContent) {
        revalidatePath(`/docs/${existingContent.slug}`)
        revalidatePath(`/tutorials/${existingContent.slug}`)
        revalidatePath(`/snippets/${existingContent.slug}`)
        revalidatePath('/admin/content')
    }

    return { success: true }
}

/**
 * 콘텐츠 삭제 (관리자 전용 - RLS 우회)
 */
export async function deleteContent(id: string): Promise<{ success: boolean; error?: string }> {
    // 삭제 전 콘텐츠 정보 조회 (캐시 무효화용, RLS 우회)
    const content = await getContent(id, true)

    const { error } = await supabaseAdmin
        .from('contents')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting content:', error)
        return { success: false, error: error.message }
    }

    // 캐시 무효화
    if (content) {
        revalidatePath(`/docs/${content.slug}`)
        revalidatePath(`/tutorials/${content.slug}`)
        revalidatePath(`/snippets/${content.slug}`)
    }
    revalidatePath('/admin/content')

    return { success: true }
}
