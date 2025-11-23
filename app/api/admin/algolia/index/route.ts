import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { indexContent, indexContents, AlgoliaContentRecord } from '@/lib/algolia'

// Supabase Admin Client (Service Role) - Lazy initialization
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient | null {
    if (supabaseAdmin) return supabaseAdmin

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        console.warn('Supabase credentials not configured')
        return null
    }

    supabaseAdmin = createClient(url, key)
    return supabaseAdmin
}

// Convert DB content to Algolia record
function toAlgoliaRecord(content: {
    id: string
    type: string
    title: string
    description: string | null
    slug: string
    stack: Record<string, string> | null
    difficulty: string | null
    estimated_time_mins: number | null
    is_premium: boolean
    author_id: string | null
    published_at: string | null
    updated_at: string
    view_count: number
    completion_count: number
    avg_rating: number | null
    tags?: { name: string }[]
}): AlgoliaContentRecord {
    return {
        objectID: content.id,
        type: content.type as 'doc' | 'tutorial' | 'snippet',
        title: content.title,
        description: content.description || '',
        slug: content.slug,
        stack: content.stack || {},
        tags: content.tags?.map(t => t.name) || [],
        difficulty: (content.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        estimatedTimeMins: content.estimated_time_mins || 0,
        isPremium: content.is_premium,
        author: content.author_id || undefined,
        publishedAt: content.published_at ? new Date(content.published_at).getTime() : Date.now(),
        updatedAt: new Date(content.updated_at).getTime(),
        views: content.view_count,
        completions: content.completion_count,
        avgRating: content.avg_rating || 0,
    }
}

// POST: Index single content or all contents
export async function POST(req: NextRequest) {
    try {
        // Admin only
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Admin check via Clerk metadata
        if (user.publicMetadata?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const supabase = getSupabaseAdmin()
        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
        }

        const body = await req.json()
        const { contentId, indexAll } = body

        if (indexAll) {
            // Index all published contents
            const { data: contents, error } = await supabase
                .from('contents')
                .select(`
                    id,
                    type,
                    title,
                    description,
                    slug,
                    stack,
                    difficulty,
                    estimated_time_mins,
                    is_premium,
                    author_id,
                    published_at,
                    updated_at,
                    view_count,
                    completion_count,
                    avg_rating,
                    content_tags (
                        tags (name)
                    )
                `)
                .eq('status', 'published')

            if (error) {
                console.error('Supabase error:', error)
                return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 })
            }

            if (!contents || contents.length === 0) {
                return NextResponse.json({ message: 'No contents to index', indexed: 0 })
            }

            // Transform data for Algolia
            const records = contents.map(c => {
                // Flatten nested tags - handle Supabase's nested join structure
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const contentTags = c.content_tags as any[] | null
                const tags = contentTags?.map(ct => ct.tags?.name).filter(Boolean) || []
                return toAlgoliaRecord({ ...c, tags: tags.map((name: string) => ({ name })) })
            })

            const success = await indexContents(records)

            if (success) {
                return NextResponse.json({ message: 'All contents indexed', indexed: records.length })
            } else {
                return NextResponse.json({ error: 'Failed to index contents' }, { status: 500 })
            }
        }

        if (contentId) {
            // Index single content
            const { data: content, error } = await supabase
                .from('contents')
                .select(`
                    id,
                    type,
                    title,
                    description,
                    slug,
                    stack,
                    difficulty,
                    estimated_time_mins,
                    is_premium,
                    author_id,
                    published_at,
                    updated_at,
                    view_count,
                    completion_count,
                    avg_rating,
                    content_tags (
                        tags (name)
                    )
                `)
                .eq('id', contentId)
                .eq('status', 'published')
                .single()

            if (error || !content) {
                return NextResponse.json({ error: 'Content not found' }, { status: 404 })
            }

            // Flatten nested tags - handle Supabase's nested join structure
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const contentTags = content.content_tags as any[] | null
            const tags = contentTags?.map(ct => ct.tags?.name).filter(Boolean) || []
            const record = toAlgoliaRecord({ ...content, tags: tags.map((name: string) => ({ name })) })

            const success = await indexContent(record)

            if (success) {
                return NextResponse.json({ message: 'Content indexed', contentId })
            } else {
                return NextResponse.json({ error: 'Failed to index content' }, { status: 500 })
            }
        }

        return NextResponse.json({ error: 'Missing contentId or indexAll parameter' }, { status: 400 })
    } catch (error) {
        console.error('Index API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
