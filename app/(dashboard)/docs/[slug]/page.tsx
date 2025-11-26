import { notFound } from 'next/navigation'
import { getContentBySlug, getRelatedContents, incrementViewCount } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, BookOpen } from 'lucide-react'

// 캐싱 방지 - 항상 최신 데이터 표시
export const dynamic = 'force-dynamic'

interface DocPageProps {
    params: Promise<{ slug: string }>
}

// 난이도 배지 색상
const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
}

const difficultyLabels = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
}

export default async function DocDetailPage({ params }: DocPageProps) {
    const { slug } = await params

    // DB에서 콘텐츠 조회
    const content = await getContentBySlug(slug, 'doc')

    if (!content) {
        notFound()
    }

    // 조회수 증가
    incrementViewCount(content.id)

    // MDX 콘텐츠가 없으면 기본 메시지 표시
    if (!content.content) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
                <p className="text-gray-500">콘텐츠가 아직 준비되지 않았습니다.</p>
            </div>
        )
    }

    // MDX 컴파일
    const { content: mdxContent } = await compileMDXContent(content.content)

    // 목차 추출
    const toc = extractTOC(content.content)

    // 읽기 시간 계산 (DB에 없으면 자동 계산)
    const readingTime = content.estimated_time_mins || calculateReadingTime(content.content)

    // 관련 콘텐츠 조회
    const relatedContents = await getRelatedContents(content.id, 3)

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* 메인 콘텐츠 */}
                <article className="flex-1 max-w-4xl">
                    {/* 헤더 */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline">문서</Badge>
                            {content.difficulty && (
                                <Badge className={difficultyColors[content.difficulty]}>
                                    {difficultyLabels[content.difficulty]}
                                </Badge>
                            )}
                            {content.is_premium && (
                                <Badge className="bg-purple-100 text-purple-800">Pro</Badge>
                            )}
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {content.title}
                        </h1>

                        {content.description && (
                            <p className="text-xl text-gray-600 mb-4">
                                {content.description}
                            </p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {readingTime}분
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {(content.view_count ?? 0).toLocaleString()}회
                            </span>
                            {content.published_at && (
                                <span>
                                    {new Date(content.published_at).toLocaleDateString('ko-KR')}
                                </span>
                            )}
                        </div>
                    </header>

                    {/* MDX 콘텐츠 */}
                    <div className="prose prose-lg max-w-none">
                        {mdxContent}
                    </div>

                    {/* 관련 콘텐츠 */}
                    {relatedContents.length > 0 && (
                        <section className="mt-16 pt-8 border-t">
                            <h2 className="text-2xl font-bold mb-4">관련 콘텐츠</h2>
                            <div className="grid gap-4">
                                {relatedContents.map((related) => {
                                    // 타입별 경로 생성
                                    const contentPath = related.type === 'doc'
                                        ? `/docs/${related.slug}`
                                        : related.type === 'tutorial'
                                        ? `/tutorials/${related.slug}`
                                        : `/snippets/${related.slug}`

                                    return (
                                        <a
                                            key={related.id}
                                            href={contentPath}
                                            className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {related.title}
                                                </h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {related.type === 'doc' ? '문서' : related.type === 'tutorial' ? '튜토리얼' : '스니펫'}
                                                </Badge>
                                            </div>
                                            {related.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {related.description}
                                                </p>
                                            )}
                                        </a>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </article>

                {/* 사이드바 - 목차 */}
                {toc.length > 0 && (
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-8">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                목차
                            </h3>
                            <nav className="space-y-2">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                                            item.level === 1 ? '' : item.level === 2 ? 'pl-4' : 'pl-8'
                                        }`}
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: DocPageProps) {
    const { slug } = await params
    const content = await getContentBySlug(slug, 'doc')

    if (!content) {
        return { title: '문서를 찾을 수 없습니다' }
    }

    return {
        title: `${content.title} | VibeStack Docs`,
        description: content.description || content.title,
    }
}
