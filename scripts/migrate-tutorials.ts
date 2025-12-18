#!/usr/bin/env node

/**
 * 튜토리얼 마이그레이션 스크립트
 *
 * 기존 튜토리얼의 content(MDX) 필드를 파싱해서
 * tutorial_steps, tutorial_tech_stack 테이블로 데이터를 이동합니다.
 *
 * 사용법:
 * npx tsx scripts/migrate-tutorials.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials not found in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Tutorial {
  id: string
  title: string
  slug: string
  content: string
  stack: Record<string, any> | null
  estimated_time_mins: number
}

interface Step {
  stepNumber: number
  title: string
  description: string
  estimatedDuration: number
  content: string
}

/**
 * MDX content에서 단계 정보를 추출합니다.
 *
 * 예상 패턴:
 * ### 1단계: 프로젝트 설정
 * ### 2단계: 인증 구현
 *
 * 또는:
 * ## 단계 1: 프로젝트 설정
 * ## 단계 2: 인증 구현
 */
function extractStepsFromMDX(mdxContent: string, totalMinutes: number): Step[] {
  const steps: Step[] = []

  // 패턴 1: "### N단계: 제목" 형식
  const pattern1 = /###\s*(\d+)단계[:：]\s*(.+?)(?=\n|$)/g
  // 패턴 2: "## 단계 N: 제목" 형식
  const pattern2 = /##\s*단계\s*(\d+)[:：]\s*(.+?)(?=\n|$)/g
  // 패턴 3: "## N. 제목" 형식
  const pattern3 = /##\s*(\d+)\.\s*(.+?)(?=\n|$)/g

  // 모든 패턴을 시도
  const patterns = [pattern1, pattern2, pattern3]
  let matches: RegExpMatchArray[] = []

  for (const pattern of patterns) {
    const found = [...mdxContent.matchAll(pattern)]
    if (found.length > 0) {
      matches = found
      break
    }
  }

  if (matches.length === 0) {
    console.warn('⚠️  No step patterns found in content. Creating single step.')
    return [{
      stepNumber: 1,
      title: '전체 튜토리얼',
      description: '튜토리얼 전체 내용을 진행합니다.',
      estimatedDuration: totalMinutes,
      content: mdxContent,
    }]
  }

  // 단계별 content 분리
  matches.forEach((match, index) => {
    const stepNumber = parseInt(match[1])
    const stepTitle = match[2].trim()
    const startIndex = match.index!

    // 다음 단계의 시작 위치 찾기
    const nextMatch = matches[index + 1]
    const endIndex = nextMatch
      ? nextMatch.index!
      : mdxContent.length

    const stepContent = mdxContent.substring(startIndex, endIndex).trim()

    // 평균 시간 할당 (전체 시간을 단계 수로 나눔)
    const avgDuration = Math.ceil(totalMinutes / matches.length)

    steps.push({
      stepNumber,
      title: stepTitle,
      description: `${stepTitle} 단계를 진행합니다.`,
      estimatedDuration: avgDuration,
      content: stepContent,
    })
  })

  return steps
}

/**
 * stack JSON에서 tech stack 정보를 추출합니다.
 *
 * 예상 형식:
 * {
 *   "framework": "Next.js 14",
 *   "auth": "Clerk",
 *   "database": "Supabase"
 * }
 */
function extractTechStack(stackJson: Record<string, any> | null): Array<{
  category: string
  name: string
}> {
  if (!stackJson) return []

  return Object.entries(stackJson).map(([category, name]) => ({
    category,
    name: String(name),
  }))
}

/**
 * 단일 튜토리얼을 마이그레이션합니다.
 */
async function migrateTutorial(tutorial: Tutorial): Promise<boolean> {
  console.log(`\n📚 Migrating: ${tutorial.title}`)
  console.log(`   Slug: ${tutorial.slug}`)

  try {
    // 1. Steps 추출
    const steps = extractStepsFromMDX(tutorial.content, tutorial.estimated_time_mins || 60)
    console.log(`   Found ${steps.length} steps`)

    // 2. Tech stack 추출
    const techStack = extractTechStack(tutorial.stack)
    console.log(`   Found ${techStack.length} tech stack items`)

    // 3. tutorial_steps 테이블에 삽입
    for (const step of steps) {
      const { error: stepError } = await supabase
        .from('tutorial_steps')
        .insert({
          tutorial_id: tutorial.id,
          step_number: step.stepNumber,
          title: step.title,
          description: step.description,
          estimated_duration_mins: step.estimatedDuration,
          content: step.content,
          order_index: step.stepNumber,
        })

      if (stepError) {
        // 중복 에러는 무시 (이미 마이그레이션된 경우)
        if (stepError.code === '23505') {
          console.log(`   ⚠️  Step ${step.stepNumber} already exists, skipping...`)
        } else {
          throw stepError
        }
      }
    }

    // 4. tutorial_tech_stack 테이블에 삽입
    for (let i = 0; i < techStack.length; i++) {
      const tech = techStack[i]
      const { error: techError } = await supabase
        .from('tutorial_tech_stack')
        .insert({
          tutorial_id: tutorial.id,
          category: tech.category,
          name: tech.name,
          order_index: i,
        })

      if (techError) {
        console.warn(`   ⚠️  Failed to insert tech stack: ${techError.message}`)
      }
    }

    console.log(`   ✅ Migration successful`)
    return true

  } catch (error) {
    console.error(`   ❌ Migration failed:`, error)
    return false
  }
}

/**
 * 모든 튜토리얼을 마이그레이션합니다.
 */
async function migrateAllTutorials() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 Tutorial Migration Started')
  console.log('='.repeat(60))

  // 모든 published 튜토리얼 가져오기
  const { data: tutorials, error } = await supabase
    .from('contents')
    .select('id, title, slug, content, stack, estimated_time_mins')
    .eq('type', 'tutorial')
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch tutorials:', error)
    process.exit(1)
  }

  if (!tutorials || tutorials.length === 0) {
    console.log('⚠️  No tutorials found to migrate')
    return
  }

  console.log(`\n📊 Found ${tutorials.length} tutorials to migrate\n`)

  let successCount = 0
  let failCount = 0

  for (const tutorial of tutorials) {
    const success = await migrateTutorial(tutorial as Tutorial)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Migration Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📚 Total: ${tutorials.length}`)
  console.log('='.repeat(60) + '\n')
}

// 실행
migrateAllTutorials()
  .then(() => {
    console.log('✨ Migration completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration error:', error)
    process.exit(1)
  })
