import { redirect } from 'next/navigation'
import { getContentBySlug } from '@/app/actions/content'
import { getTutorialSteps, getUserTutorialProgress } from '@/app/tutorials/actions'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

interface TutorialPageProps {
  params: Promise<{ slug: string }>
}

export default async function TutorialOverviewPage({ params }: TutorialPageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)

  // DB에서 콘텐츠 조회
  const content = await getContentBySlug(slug, 'tutorial')

  if (!content) {
    redirect('/tutorials')
  }

  // 튜토리얼 단계 가져오기
  const tutorialSteps = await getTutorialSteps(content.id)

  if (tutorialSteps.length === 0) {
    redirect('/tutorials')
  }

  // 사용자 진행 상황 확인
  const { userId } = await auth()
  const userProgress = userId ? await getUserTutorialProgress(userId, content.id) : null

  // 마지막으로 진행 중이던 단계 또는 첫 번째 단계로 redirect
  const targetStepNumber = userProgress?.current_step_number || 1

  redirect(`/tutorials/${slug}/${targetStepNumber}`)
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
