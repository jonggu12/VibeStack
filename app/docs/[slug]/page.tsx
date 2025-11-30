import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug, getContents } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Search, Home, ChevronRight } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'
import { Feedback } from '@/components/mdx/feedback'

// 캐싱 방지
export const dynamic = 'force-dynamic'

interface DocPageProps {
  params: Promise<{ slug: string }>
}

// 문서 카테고리 정의 (실제로는 DB에서 가져올 수 있음)
const docCategories = [
  {
    title: '시작하기 (Start)',
    items: [
      { title: 'Cursor 설치 및 설정', slug: 'cursor-setup' },
      { title: '첫 프롬프트 작성법', slug: 'first-prompt' },
      { title: 'Github 연동하기', slug: 'github-integration' },
    ],
  },
  {
    title: '에러 해결 (Troubleshoot)',
    items: [
      { title: 'Module not found 해결', slug: 'module-not-found' },
      { title: 'Environment Variable 설정', slug: 'env-variables' },
      { title: 'Hydration Failed 에러', slug: 'hydration-error' },
      { title: '배포 후 404 에러', slug: 'deployment-404' },
    ],
  },
  {
    title: '개념 사전 (Dictionary)',
    items: [
      { title: 'localhost가 뭐예요?', slug: 'what-is-localhost' },
      { title: 'API, JSON이 뭔가요?', slug: 'what-is-api-json' },
    ],
  },
]

export default async function DocsDetailPage({ params }: DocPageProps) {
  const { slug } = await params

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'doc')

  if (!content) {
    notFound()
  }

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

  // 카테고리 찾기 (현재 문서가 속한 카테고리)
  const currentCategory = docCategories.find((cat) =>
    cat.items.some((item) => item.slug === slug)
  )
  const categoryName = currentCategory?.title.split(' ')[0] || '문서'

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <ViewTracker contentId={content.id} />

      {/* HEADER (Compact) */}
      <header className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800 h-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-black font-bold text-base group-hover:rotate-3 transition-transform">
                V
              </div>
              <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
              <span className="text-xs font-mono text-zinc-500 mt-1">Docs</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 border-l border-zinc-800 pl-6">
              <Link href="/docs" className="hover:text-zinc-300 transition-colors">
                {categoryName}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium truncate max-w-md">{content.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Compact Search */}
            <button className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:border-zinc-700 transition-colors w-64">
              <Search className="w-3.5 h-3.5" />
              <span>검색 (⌘K)</span>
            </button>
            {/* Profile Placeholder */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          </div>
        </div>
      </header>

      {/* 3-COLUMN LAYOUT */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto flex">
        {/* LEFT SIDEBAR (Category Navigation) */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-8 pr-6 pl-4">
          <div className="space-y-8">
            {docCategories.map((category) => (
              <div key={category.title}>
                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                  {category.title}
                </h5>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={`block px-2 py-1.5 text-sm rounded transition-colors ${
                          item.slug === slug
                            ? 'text-indigo-400 bg-indigo-500/10 border-l-2 border-indigo-500 rounded-r font-medium'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 py-10 px-4 md:px-12">
          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-6">
            {content.difficulty && (
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  content.difficulty === 'beginner'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : content.difficulty === 'intermediate'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {content.difficulty === 'beginner'
                  ? '초급'
                  : content.difficulty === 'intermediate'
                  ? '중급'
                  : '고급'}
              </span>
            )}
            {content.updated_at && (
              <span className="text-zinc-500 text-xs">
                최종 업데이트: {new Date(content.updated_at).toLocaleDateString('ko-KR')}
              </span>
            )}
            <span className="text-zinc-500 text-xs flex items-center gap-1">
              👥 {(content.views ?? 0).toLocaleString()}명 조회
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{content.title}</h1>

          {/* Description */}
          {content.description && (
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">{content.description}</p>
          )}

          <hr className="border-zinc-800 my-8" />

          {/* MDX Content */}
          <div className="prose-docs">{mdxContent}</div>

          {/* Feedback */}
          <Feedback contentId={content.id} />
        </main>

        {/* RIGHT SIDEBAR (TOC) */}
        {toc.length > 0 && (
          <aside className="hidden xl:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 py-10 px-6">
            <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              On This Page
            </h5>
            <ul className="space-y-3 text-sm border-l border-zinc-800 pl-4">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-zinc-400 hover:text-white transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}

// Metadata
export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params
  const content = await getContentBySlug(slug, 'doc')

  if (!content) {
    return { title: '문서를 찾을 수 없습니다 | VibeStack' }
  }

  return {
    title: `${content.title} | VibeStack Docs`,
    description: content.description || content.title,
  }
}
