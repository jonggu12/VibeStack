import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug, getRelatedContents, getContents } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, BookOpen, ChevronRight, Home } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'
import { Feedback } from '@/components/mdx/feedback'

// 캐싱 방지 - 항상 최신 데이터 표시
export const dynamic = 'force-dynamic'

interface DocPageProps {
    params: Promise<{ slug: string }>
}

// 난이도 배지 색상 (Dark theme)
const difficultyColors = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
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

    // MDX 콘텐츠가 없으면 기본 메시지 표시
    if (!content.content) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4 text-white">{content.title}</h1>
                <p className="text-zinc-500">콘텐츠가 아직 준비되지 않았습니다.</p>
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

    // 모든 문서 조회 (왼쪽 사이드바용)
    const allDocs = await getContents({ type: 'doc', limit: 50 })

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* 조회수 추적 (5초 후 + 24시간 쿠키) */}
            <ViewTracker contentId={content.id} />

            {/* Glass Header with Breadcrumbs */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/70 border-b border-zinc-800/50">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-3">
                        <Link href="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            홈
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        <Link href="/docs" className="text-zinc-500 hover:text-white transition-colors">
                            문서
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-white font-medium">{content.title}</span>
                    </nav>

                    {/* Title & Meta */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
                            <div className="flex items-center gap-4 text-xs text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {readingTime}분
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {(content.views ?? 0).toLocaleString()}회
                                </span>
                                {content.published_at && (
                                    <span>
                                        {new Date(content.published_at).toLocaleDateString('ko-KR')}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {content.difficulty && (
                                <Badge className={`${difficultyColors[content.difficulty]} border text-xs`}>
                                    {difficultyLabels[content.difficulty]}
                                </Badge>
                            )}
                            {content.is_premium && (
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 border text-xs">
                                    Pro
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 3-Column Layout */}
            <div className="max-w-[1600px] mx-auto flex">
                {/* Left Sidebar - Doc Categories */}
                <aside className="hidden xl:block w-64 shrink-0 border-r border-zinc-800/50">
                    <div className="sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto px-6 py-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                            문서 카테고리
                        </h3>
                        <nav className="space-y-1">
                            {allDocs.map((doc) => (
                                <Link
                                    key={doc.id}
                                    href={`/docs/${doc.slug}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        doc.slug === slug
                                            ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                    }`}
                                >
                                    {doc.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <article className="flex-1 min-w-0 px-6 lg:px-12 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Description */}
                        {content.description && (
                            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                                {content.description}
                            </p>
                        )}

                        {/* MDX Content */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            {mdxContent}
                        </div>

                        {/* Feedback Widget */}
                        <Feedback contentId={content.id} />

                        {/* Related Content */}
                        {relatedContents.length > 0 && (
                            <section className="mt-16 pt-8 border-t border-zinc-800">
                                <h2 className="text-2xl font-bold text-white mb-6">관련 콘텐츠</h2>
                                <div className="grid gap-4">
                                    {relatedContents.map((related) => {
                                        const contentPath =
                                            related.type === 'doc'
                                                ? `/docs/${related.slug}`
                                                : related.type === 'tutorial'
                                                ? `/tutorials/${related.slug}`
                                                : `/snippets/${related.slug}`

                                        return (
                                            <Link
                                                key={related.id}
                                                href={contentPath}
                                                className="block p-4 border border-zinc-800 rounded-xl hover:border-indigo-500/50 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-white">
                                                        {related.title}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs border-zinc-700 text-zinc-400"
                                                    >
                                                        {related.type === 'doc'
                                                            ? '문서'
                                                            : related.type === 'tutorial'
                                                            ? '튜토리얼'
                                                            : '스니펫'}
                                                    </Badge>
                                                </div>
                                                {related.description && (
                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        {related.description}
                                                    </p>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                </article>

                {/* Right Sidebar - Table of Contents */}
                {toc.length > 0 && (
                    <aside className="hidden lg:block w-64 shrink-0 border-l border-zinc-800/50">
                        <div className="sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto px-6 py-8">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5" />
                                목차
                            </h3>
                            <nav className="space-y-2">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`block text-sm text-zinc-400 hover:text-indigo-400 transition-colors ${
                                            item.level === 1
                                                ? ''
                                                : item.level === 2
                                                ? 'pl-3'
                                                : 'pl-6'
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
