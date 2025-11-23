import { NextRequest, NextResponse } from 'next/server'
import { searchContents, SearchOptions, searchClient } from '@/lib/algolia'

export async function GET(req: NextRequest) {
    // Algolia 클라이언트가 초기화되지 않은 경우 빈 결과 반환
    if (!searchClient) {
        console.warn('Search API: Algolia client not initialized. Check NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY')
        return NextResponse.json({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            query: req.nextUrl.searchParams.get('q') || '',
        })
    }

    const searchParams = req.nextUrl.searchParams

    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') as 'doc' | 'tutorial' | 'snippet' | undefined
    const difficulty = searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' | undefined
    const isPremiumParam = searchParams.get('isPremium')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const page = parseInt(searchParams.get('page') || '0', 10)
    const hitsPerPage = parseInt(searchParams.get('hitsPerPage') || '20', 10)

    const options: SearchOptions = {
        query,
        filters: {
            type,
            difficulty,
            isPremium: isPremiumParam ? isPremiumParam === 'true' : undefined,
            tags,
        },
        page,
        hitsPerPage,
    }

    try {
        const results = await searchContents(options)
        return NextResponse.json(results)
    } catch (error) {
        console.error('Search API error:', error)
        // 에러 시에도 빈 결과 반환 (500 에러 대신)
        return NextResponse.json({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            query,
            error: error instanceof Error ? error.message : 'Search failed',
        })
    }
}
