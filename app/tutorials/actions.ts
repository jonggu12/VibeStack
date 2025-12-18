// Tutorial 데이터 페칭 및 진행 상황 관리 함수

import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

// 타입 정의
export interface TutorialStep {
  id: string
  tutorial_id: string
  step_number: number
  title: string
  description: string | null
  estimated_duration_mins: number
  content: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface TutorialTechStack {
  id: string
  tutorial_id: string
  category: string
  name: string
  icon_url: string | null
  url: string | null
  order_index: number
  created_at: string
}

export interface Tutorial {
  id: string
  slug: string
  title: string
  description: string | null
  difficulty: string | null
  estimated_time_mins: number
  is_premium: boolean
  thumbnail_url: string | null
  views: number
  created_at: string
}

export interface UserTutorialProgress {
  id: string
  user_id: string
  tutorial_id: string
  current_step_number: number
  completed_step_numbers: number[]
  progress_pct: number
  last_accessed_at: string
  created_at: string
  updated_at: string
}

/**
 * 모든 튜토리얼 가져오기
 */
export async function getTutorials(): Promise<Tutorial[]> {
  const { data: tutorials, error } = await supabaseAdmin
    .from('contents')
    .select(`
      id,
      slug,
      title,
      description,
      difficulty,
      estimated_time_mins,
      is_premium,
      thumbnail_url,
      views,
      created_at
    `)
    .eq('type', 'tutorial')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tutorials:', error)
    return []
  }

  return (tutorials || []) as Tutorial[]
}

/**
 * 개별 튜토리얼 가져오기 (slug로)
 */
export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  const decodedSlug = decodeURIComponent(slug)

  const { data: tutorial, error } = await supabaseAdmin
    .from('contents')
    .select(`
      id,
      slug,
      title,
      description,
      difficulty,
      estimated_time_mins,
      is_premium,
      thumbnail_url,
      views,
      created_at
    `)
    .eq('type', 'tutorial')
    .eq('status', 'published')
    .eq('slug', decodedSlug)
    .single()

  if (error) {
    console.error('Error fetching tutorial:', error)
    return null
  }

  return tutorial as Tutorial
}

/**
 * 튜토리얼의 모든 단계 가져오기
 */
export async function getTutorialSteps(tutorialId: string): Promise<TutorialStep[]> {
  const { data: steps, error } = await supabaseAdmin
    .from('tutorial_steps')
    .select('*')
    .eq('tutorial_id', tutorialId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching tutorial steps:', error)
    return []
  }

  return (steps || []) as TutorialStep[]
}

/**
 * 튜토리얼의 기술 스택 가져오기
 */
export async function getTutorialTechStack(tutorialId: string): Promise<TutorialTechStack[]> {
  const { data: techStack, error } = await supabaseAdmin
    .from('tutorial_tech_stack')
    .select('*')
    .eq('tutorial_id', tutorialId)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching tutorial tech stack:', error)
    return []
  }

  return (techStack || []) as TutorialTechStack[]
}

/**
 * 사용자의 튜토리얼 진행 상황 가져오기
 */
export async function getUserTutorialProgress(
  userId: string,
  tutorialId: string
): Promise<UserTutorialProgress | null> {
  const { data: progress, error } = await supabaseAdmin
    .from('user_tutorial_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('tutorial_id', tutorialId)
    .single()

  if (error) {
    // 진행 기록이 없는 경우는 에러가 아님
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching user tutorial progress:', error)
    return null
  }

  return progress as UserTutorialProgress
}

/**
 * 사용자의 튜토리얼 진행 상황 업데이트
 */
export async function updateTutorialProgress(
  tutorialId: string,
  stepNumber: number,
  completed: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // 현재 로그인한 사용자 확인
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    // 먼저 기존 진행 상황 가져오기
    const existingProgress = await getUserTutorialProgress(userId, tutorialId)

    // 전체 단계 수 가져오기
    const steps = await getTutorialSteps(tutorialId)
    const totalSteps = steps.length

    if (existingProgress) {
      // 기존 진행 상황 업데이트
      let completedSteps = existingProgress.completed_step_numbers || []

      if (completed && !completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber)
      }

      const progressPct = Math.round((completedSteps.length / totalSteps) * 100)

      const { error } = await supabaseAdmin
        .from('user_tutorial_progress')
        .update({
          current_step_number: stepNumber,
          completed_step_numbers: completedSteps,
          progress_pct: progressPct,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('tutorial_id', tutorialId)

      if (error) {
        console.error('Error updating tutorial progress:', error)
        return { success: false, error: error.message }
      }
    } else {
      // 새로운 진행 상황 생성
      const completedSteps = completed ? [stepNumber] : []
      const progressPct = Math.round((completedSteps.length / totalSteps) * 100)

      const { error } = await supabaseAdmin
        .from('user_tutorial_progress')
        .insert({
          user_id: userId,
          tutorial_id: tutorialId,
          current_step_number: stepNumber,
          completed_step_numbers: completedSteps,
          progress_pct: progressPct,
          last_accessed_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error creating tutorial progress:', error)
        return { success: false, error: error.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateTutorialProgress:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 단계 완료 토글
 */
export async function toggleStepCompletion(
  tutorialId: string,
  stepNumber: number
): Promise<{ success: boolean; completed: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, completed: false, error: 'User not authenticated' }
    }

    const existingProgress = await getUserTutorialProgress(userId, tutorialId)
    const steps = await getTutorialSteps(tutorialId)
    const totalSteps = steps.length

    let completedSteps: number[] = existingProgress?.completed_step_numbers || []
    let isCompleted = false

    if (completedSteps.includes(stepNumber)) {
      // 완료 해제
      completedSteps = completedSteps.filter(n => n !== stepNumber)
      isCompleted = false
    } else {
      // 완료 표시
      completedSteps.push(stepNumber)
      isCompleted = true
    }

    const progressPct = Math.round((completedSteps.length / totalSteps) * 100)

    if (existingProgress) {
      const { error } = await supabaseAdmin
        .from('user_tutorial_progress')
        .update({
          completed_step_numbers: completedSteps,
          progress_pct: progressPct,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('tutorial_id', tutorialId)

      if (error) {
        return { success: false, completed: false, error: error.message }
      }
    } else {
      const { error } = await supabaseAdmin
        .from('user_tutorial_progress')
        .insert({
          user_id: userId,
          tutorial_id: tutorialId,
          current_step_number: stepNumber,
          completed_step_numbers: completedSteps,
          progress_pct: progressPct,
        })

      if (error) {
        return { success: false, completed: false, error: error.message }
      }
    }

    return { success: true, completed: isCompleted }
  } catch (error) {
    return {
      success: false,
      completed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
