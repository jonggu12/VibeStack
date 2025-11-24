import { notFound } from 'next/navigation'
import { getContentBySlug, getRelatedContents, incrementViewCount } from '@/app/actions/content'
import { compileMDXContent } from '@/lib/mdx'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

interface SnippetPageProps {
    params: Promise<{ slug: string }>
}

export default async function SnippetDetailPage({ params }: SnippetPageProps) {
    const { slug } = await params

    // DB에서 콘텐츠 조회
    const content = await getContentBySlug(slug, 'snippet')

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

    // 관련 스니펫 조회
    const relatedContents = await getRelatedContents(content.id, 4)

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 헤더 */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-orange-100 text-orange-800">스니펫</Badge>
                    {content.is_premium && (
                        <Badge className="bg-purple-100 text-purple-800">Pro</Badge>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {content.title}
                </h1>

                {content.description && (
                    <p className="text-lg text-gray-600 mb-4">
                        {content.description}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {content.view_count.toLocaleString()}회 조회
                    </span>
                    {content.published_at && (
                        <span>
                            {new Date(content.published_at).toLocaleDateString('ko-KR')}
                        </span>
                    )}
                </div>

                {/* 기술 스택 */}
                {content.stack && Object.keys(content.stack).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(content.stack).map(([key, value]) => (
                            <span
                                key={key}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* MDX 콘텐츠 (코드 스니펫) */}
            <div className="prose prose-lg max-w-none">
                {mdxContent}
            </div>

            {/* 사용 팁 */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">💡 사용 방법</h3>
                <p className="text-blue-700 text-sm">
                    코드 블록 위에 마우스를 올리면 복사 버튼이 나타납니다.
                    클릭하여 클립보드에 복사한 후 프로젝트에 붙여넣기 하세요.
                </p>
            </div>

            {/* 관련 스니펫 */}
            {relatedContents.length > 0 && (
                <section className="mt-12 pt-8 border-t">
                    <h2 className="text-xl font-bold mb-4">관련 스니펫</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedContents.map((related) => (
                            <a
                                key={related.id}
                                href={`/snippets/${related.slug}`}
                                className="block p-4 border rounded-lg hover:border-orange-500 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {related.title}
                                </h3>
                                {related.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {related.description}
                                    </p>
                                )}
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: SnippetPageProps) {
    const { slug } = await params
    const content = await getContentBySlug(slug, 'snippet')

    if (!content) {
        return { title: '스니펫을 찾을 수 없습니다' }
    }

    return {
        title: `${content.title} | VibeStack Snippets`,
        description: content.description || content.title,
    }
}
