import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug, getContents } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Search, ChevronRight, Users, ArrowLeft, Lightbulb } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'

// 캐싱 방지
export const dynamic = 'force-dynamic'

interface GlossaryPageProps {
  params: Promise<{ slug: string }>
}

export default async function GlossaryDetailPage({ params }: GlossaryPageProps) {
  const { slug: rawSlug } = await params

  // URL 디코딩 (한글 slug 처리)
  const slug = decodeURIComponent(rawSlug)

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'glossary')

  if (!content) {
    notFound()
  }

  // 관련 용어 (같은 카테고리 또는 랜덤 5개)
  const relatedTerms = await getContents({ type: 'glossary', status: 'published', limit: 5 })
  const filteredRelatedTerms = relatedTerms.filter(term => term.slug !== slug).slice(0, 4)

  // MDX 콘텐츠가 없으면 기본 메시지
  if (!content.content) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
          <p className="text-zinc-500">콘텐츠가 아직 준비되지 않았습니다.</p>
        </div>
      </div>
    )
  }

  // MDX 컴파일
  const { content: mdxContent } = await compileMDXContent(content.content)

  // 목차 추출
  const toc = extractTOC(content.content)

  // 읽기 시간
  const readingTime = content.estimated_time_mins || calculateReadingTime(content.content)

  // analogy 필드 가져오기
  const analogy = (content as any).analogy || null

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 selection:bg-indigo-500/30">
      <ViewTracker contentId={content.id} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800 h-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-black font-bold text-base group-hover:rotate-3 transition-transform">
                V
              </div>
              <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
              <span className="text-xs font-mono text-zinc-500 mt-1">용어사전</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 border-l border-zinc-800 pl-6">
              <Link href="/docs/glossary" className="hover:text-zinc-300 transition-colors">
                용어사전
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium truncate max-w-md">{content.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Link
              href="/docs/glossary"
              className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>목록으로</span>
            </Link>
            {/* Profile Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
              용어 설명
            </span>
            {content.updated_at && (
              <span className="text-zinc-500 text-xs">
                최종 업데이트: {new Date(content.updated_at).toLocaleDateString('ko-KR')}
              </span>
            )}
            <span className="text-zinc-500 text-xs flex items-center gap-1">
              <Users className="w-3 h-3" /> {(content.views ?? 0).toLocaleString()}명이 읽음
            </span>
            <span className="text-zinc-500 text-xs">{readingTime}분 소요</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {content.title}
          </h1>

          {/* Analogy (비유) */}
          {analogy && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-zinc-400 mb-1">쉽게 말하면?</p>
                <p className="text-zinc-300 leading-relaxed">{analogy}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {content.description && (
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">{content.description}</p>
          )}

          <hr className="border-zinc-800 my-8" />

          {/* MDX Content */}
          <div className="prose prose-invert max-w-none prose-zinc prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            {mdxContent}
          </div>

          {/* TOC (목차) */}
          {toc.length > 0 && (
            <div className="mt-12 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                목차
              </h3>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Terms */}
          {filteredRelatedTerms.length > 0 && (
            <div className="mt-16 pt-8 border-t border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-6">관련 용어</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRelatedTerms.map((term: any) => (
                  <Link
                    key={term.id}
                    href={`/docs/glossary/${term.slug}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                  >
                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
                      {term.title}
                    </h4>
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {term.description || term.analogy}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Metadata
export async function generateMetadata({ params }: GlossaryPageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const content = await getContentBySlug(slug, 'glossary')

  if (!content) {
    return { title: '용어를 찾을 수 없습니다 | VibeStack' }
  }

  return {
    title: `${content.title} | VibeStack 용어사전`,
    description: content.description || (content as any).analogy || content.title,
  }
}
