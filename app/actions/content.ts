'use server'

import { supabase } from '@/lib/supabase'
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
}

/**
 * ID로 콘텐츠 조회
 */
export async function getContent(id: string): Promise<DBContent | null> {
    const { data, error } = await supabase
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
    } = options

    let query = supabase
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
 * 관련 콘텐츠 조회 (같은 태그 또는 스택 기반)
 */
export async function getRelatedContents(
    contentId: string,
    limit = 4
): Promise<DBContent[]> {
    // 현재 콘텐츠 조회
    const content = await getContent(contentId)
    if (!content) return []

    // 같은 타입의 다른 콘텐츠 조회
    const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('type', content.type)
        .eq('status', 'published')
        .neq('id', contentId)
        .limit(limit)

    if (error) {
        console.error('Error fetching related contents:', error)
        return []
    }

    return (data || []) as DBContent[]
}

/**
 * 조회수 증가
 */
export async function incrementViewCount(contentId: string): Promise<void> {
    await supabase.rpc('increment_view_count', { content_id: contentId })
}

/**
 * 완료 수 증가
 */
export async function incrementCompletionCount(contentId: string): Promise<void> {
    await supabase.rpc('increment_completion_count', { content_id: contentId })
}
