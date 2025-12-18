import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug } from '@/app/actions/content'
import { compileMDXContent, calculateReadingTime } from '@/lib/mdx'
import { Github, Monitor, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'
import { StepTimeline, type TutorialStep } from '@/components/tutorial/step-timeline'
import { ProgressCard } from '@/components/tutorial/progress-card'
import { CopyButton } from '@/components/tutorial/copy-button'
import {
  getTutorialBySlug,
  getTutorialSteps,
  getTutorialTechStack,
  getUserTutorialProgress,
} from '@/app/tutorials/actions'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

interface TutorialPageProps {
  params: Promise<{ slug: string }>
}

export default async function TutorialDetailPage({ params }: TutorialPageProps) {
  const { slug: rawSlug } = await params

  // URL 디코딩 (한글 slug 처리)
  const slug = decodeURIComponent(rawSlug)

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'tutorial')

  if (!content) {
    notFound()
  }

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

  // 튜토리얼 단계 가져오기
  const tutorialSteps = await getTutorialSteps(content.id)
  const techStack = await getTutorialTechStack(content.id)

  // 사용자 진행 상황 가져오기
  const { userId } = await auth()
  const userProgress = userId ? await getUserTutorialProgress(userId, content.id) : null

  // 진행률 계산
  const progress = userProgress?.progress_pct || 0
  const completedSteps = userProgress?.completed_step_numbers || []
  const currentStepNumber = userProgress?.current_step_number || 1

  // TutorialStep 타입으로 변환
  const steps: TutorialStep[] = tutorialSteps.map((step) => {
    const isCompleted = completedSteps.includes(step.step_number)
    const isActive = step.step_number === currentStepNumber

    return {
      id: step.id,
      number: step.step_number,
      title: step.title,
      duration: `${step.estimated_duration_mins}분 소요`,
      status: isCompleted ? 'completed' : isActive ? 'active' : 'pending',
    }
  })

  // Tech stack 포맷 변환
  const formattedTechStack = techStack.map((tech) => ({
    name: tech.name,
    description: tech.category,
    icon: tech.icon_url || '',
    url: tech.url || '#',
  }))

  // MDX 컴파일
  const { content: mdxContent } = await compileMDXContent(content.content)

  // 읽기 시간
  const readingTime = content.estimated_time_mins || calculateReadingTime(content.content)

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 selection:bg-indigo-500/30">
      <ViewTracker contentId={content.id} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800 h-16">
        <div className="w-full max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-black font-bold text-base group-hover:rotate-3 transition-transform">
                V
              </div>
              <span className="font-bold text-lg tracking-tight text-white">VibeStack</span>
              <span className="text-xs font-mono text-zinc-500 mt-1">Tutorials</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 border-l border-zinc-800 pl-6">
              <Link href="/tutorials" className="hover:text-zinc-300 transition-colors">
                Tutorials
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium truncate max-w-md">{content.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-save indicator */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Saving...</span>
            </div>
            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-2 py-0.5 rounded uppercase">
                  {content.type}
                </span>
                {content.difficulty && (
                  <span
                    className={`border text-xs font-bold px-2 py-0.5 rounded ${content.difficulty === 'beginner'
                        ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        : content.difficulty === 'intermediate'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                  >
                    {content.difficulty === 'beginner'
                      ? 'Beginner'
                      : content.difficulty === 'intermediate'
                        ? 'Intermediate'
                        : 'Advanced'}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{content.title}</h1>
              {content.description && (
                <p className="text-zinc-400 max-w-2xl text-lg">{content.description}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href="#"
                className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                완성 코드
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                데모 보기
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT (3-Column) */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex items-start">
        {/* LEFT SIDEBAR: STEP TIMELINE */}
        <StepTimeline steps={steps} />

        {/* CENTER CONTENT */}
        <main className="flex-1 min-w-0 py-10 px-4 md:px-12 border-r border-zinc-800">

          {/* Active Step Header (Example for Step 2) */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              2
            </div>
            <h2 className="text-2xl font-bold text-white">Phase 2: 데이터베이스 연결</h2>
          </div>

          {/* MDX Content */}
          <div className="prose prose-invert max-w-none prose-zinc prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            {mdxContent}

            {/* Example of Action 2: The Golden Prompt (Hardcoded for demo matching reference) */}
            <div className="not-prose mb-10 mt-10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-indigo-400">2-2.</span> 연결 코드 작성 (AI)
              </h3>
              <p className="text-sm text-zinc-500 mb-3">
                이제 Cursor에게 연결 코드를 짜라고 시킬 차례입니다. <code>.env.local</code> 파일이 자동으로 생성될 것입니다.
              </p>

              {/* Prompt Box */}
              <div className="relative group">
                <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">
                  COPY THIS PROMPT
                </div>
                <div className="bg-zinc-950 border border-indigo-500/40 rounded-xl p-6 hover:border-indigo-500 transition-colors shadow-2xl">
                  <code className="block text-zinc-200 font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">현재 프로젝트에 Supabase를 연결하고 싶어.

                    1. @supabase/ssr 패키지를 설치하는 명령어를 알려줘.
                    2. 루트 경로에 .env.local 파일을 만들고, Supabase URL과 Anon Key를 넣을 수 있는 템플릿을 만들어줘.
                    3. utils/supabase/server.ts 와 client.ts 파일을 생성해서 클라이언트 유틸리티 코드를 작성해줘.</code>

                  <div className="flex justify-end">
                    <CopyButton text={`현재 프로젝트에 Supabase를 연결하고 싶어.

1. @supabase/ssr 패키지를 설치하는 명령어를 알려줘.
2. 루트 경로에 .env.local 파일을 만들고, Supabase URL과 Anon Key를 넣을 수 있는 템플릿을 만들어줘.
3. utils/supabase/server.ts 와 client.ts 파일을 생성해서 클라이언트 유틸리티 코드를 작성해줘.`} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigation Buttons */}
          <div className="py-8 border-t border-zinc-800 flex justify-between items-center mt-12">
            <button className="text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              이전 단계
            </button>
            <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
              다음 단계 완료
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR: PROGRESS */}
        <ProgressCard
          progress={progress}
          message={
            progress === 0
              ? '튜토리얼을 시작해보세요!'
              : progress < 50
              ? '잘하고 있어요! 계속 진행하세요.'
              : progress < 100
              ? '거의 다 왔어요! 조금만 더!'
              : '완료했습니다! 🎉'
          }
          techStack={formattedTechStack}
        />
      </div>
    </div>
  )
}

// Metadata
export async function generateMetadata({ params }: TutorialPageProps) {
  const { slug } = await params
  const content = await getContentBySlug(slug, 'tutorial')

  if (!content) {
    return { title: '튜토리얼을 찾을 수 없습니다 | VibeStack' }
  }

  return {
    title: `${content.title} | VibeStack Tutorials`,
    description: content.description || content.title,
  }
}
