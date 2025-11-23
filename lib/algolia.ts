import { algoliasearch } from 'algoliasearch'

// Algolia Client Configuration
const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
const adminKey = process.env.ALGOLIA_ADMIN_KEY || ''

// 빌드 시 더미 클라이언트 방지
const isBuildTime = !appId || !searchKey

// Search Client (클라이언트 사이드용 - 검색만 가능)
export const searchClient = isBuildTime
    ? null
    : algoliasearch(appId, searchKey)

// Admin Client (서버 사이드용 - 인덱싱 가능)
export const adminClient = (!appId || !adminKey)
    ? null
    : algoliasearch(appId, adminKey)

// Index Names
export const ALGOLIA_INDICES = {
    contents: 'vibestack_contents',
} as const

// Content Record Type (Algolia에 저장될 형태)
export interface AlgoliaContentRecord {
    objectID: string
    type: 'doc' | 'tutorial' | 'snippet'
    title: string
    description: string
    slug: string
    stack: Record<string, string>
    tags: string[]
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTimeMins: number
    isPremium: boolean
    author?: string
    publishedAt: number
    updatedAt: number
    views: number
    completions: number
    avgRating: number
}

// Search Options Type
export interface SearchOptions {
    query: string
    filters?: {
        type?: 'doc' | 'tutorial' | 'snippet'
        difficulty?: 'beginner' | 'intermediate' | 'advanced'
        isPremium?: boolean
        tags?: string[]
    }
    page?: number
    hitsPerPage?: number
}

// Search Result Type
export interface SearchResult {
    hits: AlgoliaContentRecord[]
    nbHits: number
    nbPages: number
    page: number
    processingTimeMS: number
    query: string
}

// 검색 함수 (Algolia v5 API)
export async function searchContents(options: SearchOptions): Promise<SearchResult> {
    if (!searchClient) {
        console.warn('Algolia search client not initialized')
        return {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            query: options.query,
        }
    }

    // 필터 문자열 생성
    const filterParts: string[] = []

    if (options.filters?.type) {
        filterParts.push(`type:${options.filters.type}`)
    }

    if (options.filters?.difficulty) {
        filterParts.push(`difficulty:${options.filters.difficulty}`)
    }

    if (options.filters?.isPremium !== undefined) {
        filterParts.push(`isPremium:${options.filters.isPremium}`)
    }

    if (options.filters?.tags?.length) {
        const tagFilters = options.filters.tags.map(tag => `tags:${tag}`).join(' OR ')
        filterParts.push(`(${tagFilters})`)
    }

    const filters = filterParts.join(' AND ')

    try {
        const result = await searchClient.searchSingleIndex<AlgoliaContentRecord>({
            indexName: ALGOLIA_INDICES.contents,
            searchParams: {
                query: options.query,
                filters: filters || undefined,
                page: options.page || 0,
                hitsPerPage: options.hitsPerPage || 20,
                attributesToRetrieve: [
                    'objectID',
                    'type',
                    'title',
                    'description',
                    'slug',
                    'stack',
                    'tags',
                    'difficulty',
                    'estimatedTimeMins',
                    'isPremium',
                    'author',
                    'publishedAt',
                    'views',
                    'avgRating',
                ],
                attributesToHighlight: ['title', 'description'],
            },
        })

        return {
            hits: result.hits,
            nbHits: result.nbHits || 0,
            nbPages: result.nbPages || 0,
            page: result.page || 0,
            processingTimeMS: result.processingTimeMS || 0,
            query: options.query,
        }
    } catch (error) {
        // 인덱스가 없는 경우 빈 결과 반환 (에러 로그 한번만)
        if (error instanceof Error && error.message.includes('does not exist')) {
            // 인덱스가 없으면 조용히 빈 결과 반환
            return {
                hits: [],
                nbHits: 0,
                nbPages: 0,
                page: 0,
                processingTimeMS: 0,
                query: options.query,
            }
        }
        console.error('Algolia search error:', error)
        return {
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            query: options.query,
        }
    }
}

// 콘텐츠 인덱싱 함수 (서버 사이드)
export async function indexContent(content: AlgoliaContentRecord): Promise<boolean> {
    if (!adminClient) {
        console.warn('Algolia admin client not initialized')
        return false
    }

    try {
        await adminClient.saveObject({
            indexName: ALGOLIA_INDICES.contents,
            body: content,
        })
        console.log(`[ALGOLIA] Indexed content: ${content.objectID}`)
        return true
    } catch (error) {
        console.error('[ALGOLIA] Index error:', error)
        return false
    }
}

// 다중 콘텐츠 인덱싱 (배치)
export async function indexContents(contents: AlgoliaContentRecord[]): Promise<boolean> {
    if (!adminClient) {
        console.warn('Algolia admin client not initialized')
        return false
    }

    try {
        await adminClient.saveObjects({
            indexName: ALGOLIA_INDICES.contents,
            objects: contents as unknown as Record<string, unknown>[],
        })
        console.log(`[ALGOLIA] Indexed ${contents.length} contents`)
        return true
    } catch (error) {
        console.error('[ALGOLIA] Batch index error:', error)
        return false
    }
}

// 콘텐츠 삭제 (인덱스에서)
export async function deleteContent(objectID: string): Promise<boolean> {
    if (!adminClient) {
        console.warn('Algolia admin client not initialized')
        return false
    }

    try {
        await adminClient.deleteObject({
            indexName: ALGOLIA_INDICES.contents,
            objectID,
        })
        console.log(`[ALGOLIA] Deleted content: ${objectID}`)
        return true
    } catch (error) {
        console.error('[ALGOLIA] Delete error:', error)
        return false
    }
}

// 인덱스 설정 (최초 1회 실행)
export async function configureIndex(): Promise<boolean> {
    if (!adminClient) {
        console.warn('Algolia admin client not initialized')
        return false
    }

    try {
        await adminClient.setSettings({
            indexName: ALGOLIA_INDICES.contents,
            indexSettings: {
                searchableAttributes: [
                    'title',
                    'description',
                    'tags',
                    'author',
                ],
                attributesForFaceting: [
                    'filterOnly(type)',
                    'filterOnly(difficulty)',
                    'filterOnly(isPremium)',
                    'searchable(tags)',
                ],
                customRanking: [
                    'desc(views)',
                    'desc(avgRating)',
                    'desc(completions)',
                    'desc(publishedAt)',
                ],
                highlightPreTag: '<mark>',
                highlightPostTag: '</mark>',
                // 한국어 검색 최적화
                queryLanguages: ['ko', 'en'],           // 한국어 + 영어 쿼리 지원
                indexLanguages: ['ko', 'en'],           // 한국어 + 영어 인덱싱
                ignorePlurals: ['en'],                   // 영어만 복수형 무시
                removeStopWords: ['en'],                 // 영어만 불용어 제거
                typoTolerance: true,
                minWordSizefor1Typo: 2,                  // 한글은 2글자부터 오타 허용
                minWordSizefor2Typos: 5,
            },
        })

        console.log('[ALGOLIA] Index configured successfully')
        return true
    } catch (error) {
        console.error('[ALGOLIA] Configure error:', error)
        return false
    }
}
