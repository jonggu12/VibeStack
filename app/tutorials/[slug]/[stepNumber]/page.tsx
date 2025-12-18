import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getContentBySlug } from '@/app/actions/content'
import { compileMDXContent } from '@/lib/mdx'
import { Github, Monitor, ChevronRight, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { ViewTracker } from '@/components/content/view-tracker'
import { StepTimeline, type TutorialStep } from '@/components/tutorial/step-timeline'
import { ProgressCard } from '@/components/tutorial/progress-card'
import {
  getTutorialBySlug,
  getTutorialSteps,
  getTutorialTechStack,
  getUserTutorialProgress,
  updateTutorialProgress,
} from '@/app/tutorials/actions'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

interface TutorialStepPageProps {
  params: Promise<{ slug: string; stepNumber: string }>
}

export default async function TutorialStepPage({ params }: TutorialStepPageProps) {
  const { slug: rawSlug, stepNumber: rawStepNumber } = await params

  // URL 디코딩
  const slug = decodeURIComponent(rawSlug)
  const stepNumber = parseInt(rawStepNumber)

  if (isNaN(stepNumber) || stepNumber < 1) {
    notFound()
  }

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'tutorial')

  if (!content) {
    notFound()
  }

  // 튜토리얼 단계 가져오기
  const tutorialSteps = await getTutorialSteps(content.id)
  const techStack = await getTutorialTechStack(content.id)

  // 현재 단계가 존재하는지 확인
  const currentStep = tutorialSteps.find((s) => s.step_number === stepNumber)

  if (!currentStep) {
    notFound()
  }

  // 사용자 진행 상황 가져오기
  const { userId } = await auth()
  const userProgress = userId ? await getUserTutorialProgress(userId, content.id) : null

  // 진행 상황 자동 업데이트 (현재 단계 방문 시)
  if (userId) {
    await updateTutorialProgress(content.id, stepNumber, false)
  }

  // 진행률 계산
  const progress = userProgress?.progress_pct || 0
  const completedSteps = userProgress?.completed_step_numbers || []
  const currentStepNumber = stepNumber

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
    icon: tech.icon_url || null,
    url: tech.url || '#',
  }))

  // 현재 단계의 MDX content 컴파일
  const { content: mdxContent } = currentStep.content
    ? await compileMDXContent(currentStep.content)
    : { content: null }

  // 이전/다음 단계
  const prevStep = tutorialSteps.find((s) => s.step_number === stepNumber - 1)
  const nextStep = tutorialSteps.find((s) => s.step_number === stepNumber + 1)

  // 현재 단계 완료 여부
  const isCurrentStepCompleted = completedSteps.includes(stepNumber)

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
              <Link href={`/tutorials/${slug}`} className="hover:text-zinc-300 transition-colors truncate max-w-xs">
                {content.title}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium">Step {stepNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-save indicator */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Progress saved</span>
            </div>
            {/* Profile */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT (3-Column) */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex items-start">
        {/* LEFT SIDEBAR: STEP TIMELINE */}
        <StepTimeline steps={steps} tutorialSlug={slug} />

        {/* CENTER CONTENT */}
        <main className="flex-1 min-w-0 py-10 px-4 md:px-12 border-r border-zinc-800">
          {/* Current Step Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
                {stepNumber}
              </div>
              <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
            </div>
            {isCurrentStepCompleted && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">완료됨</span>
              </div>
            )}
          </div>

          {currentStep.description && (
            <p className="text-zinc-400 mb-8">{currentStep.description}</p>
          )}

          {/* MDX Content */}
          <div className="prose prose-invert max-w-none prose-zinc prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
            {mdxContent || (
              <div className="text-zinc-500 text-center py-12">
                이 단계의 콘텐츠가 아직 준비되지 않았습니다.
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="py-8 border-t border-zinc-800 flex justify-between items-center mt-12">
            {prevStep ? (
              <Link
                href={`/tutorials/${slug}/${prevStep.step_number}`}
                className="text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 단계
              </Link>
            ) : (
              <div />
            )}

            {nextStep ? (
              <Link
                href={`/tutorials/${slug}/${nextStep.step_number}`}
                className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
              >
                다음 단계
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                튜토리얼 완료!
              </div>
            )}
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
          tutorialId={content.id}
          currentStepNumber={stepNumber}
          isCurrentStepCompleted={isCurrentStepCompleted}
        />
      </div>
    </div>
  )
}

// Metadata
export async function generateMetadata({ params }: TutorialStepPageProps) {
  const { slug, stepNumber } = await params
  const content = await getContentBySlug(slug, 'tutorial')

  if (!content) {
    return { title: '튜토리얼을 찾을 수 없습니다 | VibeStack' }
  }

  const step = parseInt(stepNumber)
  const tutorialSteps = await getTutorialSteps(content.id)
  const currentStep = tutorialSteps.find((s) => s.step_number === step)

  return {
    title: `${currentStep?.title || `Step ${step}`} - ${content.title} | VibeStack Tutorials`,
    description: currentStep?.description || content.description || content.title,
  }
}
