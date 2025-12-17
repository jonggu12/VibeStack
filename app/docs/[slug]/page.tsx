import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug, getContents } from '@/app/actions/content'
import { compileMDXContent, extractTOC, calculateReadingTime } from '@/lib/mdx'
import { Search, ChevronRight, Users, ThumbsUp, ThumbsDown } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'
import { TerminalPreview } from '@/components/docs/terminal-preview'
import { PromptBlock } from '@/components/docs/prompt-block'
import { Callout } from '@/components/docs/callout'

// 캐싱 방지
export const dynamic = 'force-dynamic'

interface DocPageProps {
  params: Promise<{ slug: string }>
}

// 카테고리 이름 매핑
const categoryNames: Record<string, string> = {
  'getting-started': '시작 가이드',
  'implementation': '개발 가이드',
  'prompts': 'AI 프롬프트',
  'errors': '에러 해결',
  'concepts': '개념 사전',
}

export default async function DocsDetailPage({ params }: DocPageProps) {
  const { slug: rawSlug } = await params

  // URL 디코딩 (한글 slug 처리)
  const slug = decodeURIComponent(rawSlug)

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'doc')

  if (!content) {
    notFound()
  }

  // DB에서 모든 doc 타입의 published 콘텐츠 가져오기
  const allDocs = await getContents({ type: 'doc', status: 'published', limit: 100 })

  // 카테고리별로 그룹핑
  const docsByCategory: Record<string, Array<{ title: string; slug: string }>> = {}

  allDocs.forEach((doc: any) => {
    const category = doc.category || 'implementation' // 기본값: implementation

    if (!docsByCategory[category]) {
      docsByCategory[category] = []
    }

    docsByCategory[category].push({
      title: doc.title,
      slug: doc.slug,
    })
  })

  // 카테고리 배열로 변환
  const docCategories = Object.entries(docsByCategory).map(([categoryId, items]) => ({
    title: categoryNames[categoryId] || categoryId,
    categoryId,
    items,
  }))

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

  // 현재 문서의 카테고리 찾기
  const currentCategoryId = (content as any).category || 'implementation'
  const categoryName = categoryNames[currentCategoryId] || '문서'

  // 현재 카테고리의 문서들만 필터링
  const currentCategoryDocs = docCategories
    .filter(cat => cat.categoryId === currentCategoryId)
    .map(cat => ({
      ...cat,
      items: [
        // 현재 문서를 맨 위로
        ...cat.items.filter(item => item.slug === slug),
        // 나머지 문서들
        ...cat.items.filter(item => item.slug !== slug)
      ]
    }))

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 selection:bg-indigo-500/30">
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
            {currentCategoryDocs.map((category) => (
              <div key={category.title}>
                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                  {category.title}
                </h5>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/docs/${item.slug}`}
                        className={`block px-2 py-1.5 text-sm rounded transition-colors ${item.slug === slug
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
            <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Error Fix
            </span>
            {content.updated_at && (
              <span className="text-zinc-500 text-xs">
                최종 업데이트: {new Date(content.updated_at).toLocaleDateString('ko-KR')}
              </span>
            )}
            <span className="text-zinc-500 text-xs flex items-center gap-1">
              <Users className="w-3 h-3" /> {(content.views ?? 0).toLocaleString()}명이 해결
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{content.title}</h1>

          {/* Description */}
          {content.description && (
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">{content.description}</p>
          )}

          <hr className="border-zinc-800 my-8" />

          {/* Example Components (Hardcoded for Demo matching reference) */}
          <Callout type="info" title="잠깐! 터미널이 켜져 있나요?">
            Cursor 하단에 있는 <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">Terminal</code> 탭을 클릭해서 열어주세요.
          </Callout>

          {/* MDX Content */}
          <div className="prose prose-invert max-w-none prose-zinc prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            {mdxContent}

            {/* Example Terminal Preview (Demo) */}
            <div className="not-prose">
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" id="section-1">1. 증상 확인하기</h2>
              <p className="text-zinc-400 mb-4">터미널에 아래와 비슷한 에러 메시지가 뜬다면 이 문서가 정답입니다.</p>
              <TerminalPreview>
                <span className="text-red-400">error</span> - ./src/app/page.tsx:3:0<br />
                Module not found: Can&apos;t resolve <span className="text-yellow-300">&apos;lucide-react&apos;</span>
              </TerminalPreview>
            </div>

            {/* Example Prompt Block (Demo) */}
            <div className="not-prose">
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" id="section-2">2. AI에게 해결 요청하기 (추천)</h2>
              <p className="text-zinc-400 mb-4">직접 명령어를 칠 필요 없이, Cursor의 AI에게 <strong>설치해달라고 명령</strong>하는 것이 가장 빠릅니다.</p>
              <PromptBlock prompt={`에러 메시지: "Module not found: Can't resolve '라이브러리이름'"

이 에러가 났어. 필요한 패키지를 설치하는 npm 명령어를 알려주고, 자동으로 설치해줘.`} />
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-300 mb-4">이 문서가 도움이 되었나요?</h4>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" /> 네, 해결했어요
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors">
                <ThumbsDown className="w-4 h-4" /> 아니요
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR (TOC) */}
        <aside className="hidden xl:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 py-10 px-6">
          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
            On This Page
          </h5>
          <ul className="space-y-3 text-sm border-l border-zinc-800 pl-4">
            {toc.length > 0 ? (
              toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-zinc-400 hover:text-white transition-colors"
                  >
                    {item.text}
                  </a>
                </li>
              ))
            ) : (
              // Fallback TOC for demo if MDX doesn't have headers
              <>
                <li><a href="#section-1" className="block text-zinc-400 hover:text-white transition-colors">1. 증상 확인하기</a></li>
                <li><a href="#section-2" className="block text-indigo-400 font-medium border-l border-indigo-500 -ml-[17px] pl-4 transition-colors">2. AI에게 해결 요청 (추천)</a></li>
                <li><a href="#" className="block text-zinc-400 hover:text-white transition-colors">3. 수동으로 해결하기</a></li>
                <li><a href="#" className="block text-zinc-400 hover:text-white transition-colors">왜 이런 에러가 나나요?</a></li>
              </>
            )}
          </ul>

          {/* Floating Promo */}
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-white mb-2">아직도 해결이 안 되나요?</div>
            <p className="text-xs text-zinc-500 mb-3">VibeStack 커뮤니티에 에러 로그를 올려보세요.</p>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white py-2 rounded transition-colors">
              질문하러 가기
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

// Metadata
export async function generateMetadata({ params }: DocPageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const content = await getContentBySlug(slug, 'doc')

  if (!content) {
    return { title: '문서를 찾을 수 없습니다 | VibeStack' }
  }

  return {
    title: `${content.title} | VibeStack Docs`,
    description: content.description || content.title,
  }
}
