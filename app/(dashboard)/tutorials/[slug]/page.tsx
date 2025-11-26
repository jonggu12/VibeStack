import { notFound } from 'next/navigation'
import { getContentBySlug, getRelatedContents, incrementViewCount } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, CheckCircle, BookOpen } from 'lucide-react'

// 캐싱 방지 - 항상 최신 데이터 표시
export const dynamic = 'force-dynamic'

interface TutorialPageProps {
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

export default async function TutorialDetailPage({ params }: TutorialPageProps) {
    const { slug } = await params

    // DB에서 콘텐츠 조회
    const content = await getContentBySlug(slug, 'tutorial')

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

    // 예상 소요 시간
    const estimatedTime = content.estimated_time_mins || calculateReadingTime(content.content) * 2

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
                            <Badge className="bg-blue-100 text-blue-800">튜토리얼</Badge>
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
                                약 {estimatedTime}분
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {(content.view_count ?? 0).toLocaleString()}회
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {(content.completion_count ?? 0).toLocaleString()}명 완료
                            </span>
                        </div>

                        {/* 기술 스택 */}
                        {content.stack && Object.keys(content.stack).length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {Object.entries(content.stack).map(([key, value]) => (
                                    <span
                                        key={key}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                                    >
                                        {key}: {value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* MDX 콘텐츠 */}
                    <div className="prose prose-lg max-w-none">
                        {mdxContent}
                    </div>

                    {/* 완료 버튼 */}
                    <div className="mt-12 p-6 bg-green-50 rounded-lg text-center">
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                            튜토리얼을 완료하셨나요?
                        </h3>
                        <p className="text-green-600 mb-4">
                            완료 버튼을 눌러 진행률을 기록하세요.
                        </p>
                        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            완료로 표시
                        </button>
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
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {related.type === 'doc' ? '문서' : related.type === 'tutorial' ? '튜토리얼' : '스니펫'}
                                                </Badge>
                                                {related.difficulty && (
                                                    <Badge className={difficultyColors[related.difficulty]}>
                                                        {difficultyLabels[related.difficulty]}
                                                    </Badge>
                                                )}
                                                {related.estimated_time_mins && (
                                                    <span className="text-sm text-gray-500">
                                                        약 {related.estimated_time_mins}분
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-gray-900">
                                                {related.title}
                                            </h3>
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
                                단계
                            </h3>
                            <nav className="space-y-2">
                                {toc.map((item, index) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                                            item.level === 1 ? '' : item.level === 2 ? 'pl-4' : 'pl-8'
                                        }`}
                                    >
                                        <span className="w-5 h-5 rounded-full bg-gray-200 text-xs flex items-center justify-center">
                                            {index + 1}
                                        </span>
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
export async function generateMetadata({ params }: TutorialPageProps) {
    const { slug } = await params
    const content = await getContentBySlug(slug, 'tutorial')

    if (!content) {
        return { title: '튜토리얼을 찾을 수 없습니다' }
    }

    return {
        title: `${content.title} | VibeStack Tutorials`,
        description: content.description || content.title,
    }
}
