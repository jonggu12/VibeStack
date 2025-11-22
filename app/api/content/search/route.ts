import { NextRequest, NextResponse } from 'next/server'
import { searchContents, SearchOptions } from '@/lib/algolia'

export async function GET(req: NextRequest) {
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
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        )
    }
}
