#!/usr/bin/env node

import { generateAndSaveContent } from './generate-content'

/**
 * 튜토리얼 문서 생성 스크립트
 * React Icons를 사용하지 않고 MDX 컴포넌트만 사용
 *
 * 사용법:
 * npx tsx scripts/seed-tutorials.ts
 */

const tutorialDocs = [
  // 기본 튜토리얼
  {
    type: 'tutorial' as const,
    topic: '대기자 명단 (이메일 수집) 랜딩 페이지',
    stack: ['nextjs', 'resend', 'supabase'],
    difficulty: 'beginner' as const,
    estimatedTime: 30,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: 'AI 챗봇 만들기 (OpenAI API)',
    stack: ['nextjs', 'openai', 'vercel-ai'],
    difficulty: 'intermediate' as const,
    estimatedTime: 120,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '45분 만에 만드는 Todo SaaS',
    stack: ['nextjs', 'supabase', 'clerk'],
    difficulty: 'beginner' as const,
    estimatedTime: 45,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '개발자 블로그 & 포트폴리오',
    stack: ['nextjs', 'mdx', 'typescript'],
    difficulty: 'beginner' as const,
    estimatedTime: 90,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: 'MDX 개발 블로그',
    stack: ['nextjs', 'mdx', 'typescript', 'tailwindcss'],
    difficulty: 'beginner' as const,
    estimatedTime: 60,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: 'Stripe 결제 시스템 연동',
    stack: ['nextjs', 'stripe', 'supabase'],
    difficulty: 'intermediate' as const,
    estimatedTime: 180,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '관리자 대시보드 구축',
    stack: ['nextjs', 'supabase', 'clerk'],
    difficulty: 'intermediate' as const,
    estimatedTime: 150,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '실시간 채팅 앱',
    stack: ['nextjs', 'supabase', 'websocket'],
    difficulty: 'intermediate' as const,
    estimatedTime: 150,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: 'React Native 앱 기초',
    stack: ['react-native', 'expo', 'typescript'],
    difficulty: 'beginner' as const,
    estimatedTime: 120,
    isPremium: false,
  },
  // 추천 주제
  {
    type: 'tutorial' as const,
    topic: '팀 스케줄러와 이메일 알림',
    stack: ['nextjs', 'resend', 'supabase'],
    difficulty: 'intermediate' as const,
    estimatedTime: 120,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '이미지 업로드·리사이즈 관리',
    stack: ['nextjs', 'uploadthing', 'sharp', 'supabase'],
    difficulty: 'intermediate' as const,
    estimatedTime: 90,
    isPremium: false,
  },
  {
    type: 'tutorial' as const,
    topic: '다국어 페이지 자동 번역',
    stack: ['nextjs', 'openai', 'i18n'],
    difficulty: 'intermediate' as const,
    estimatedTime: 120,
    isPremium: true,
  },
  {
    type: 'tutorial' as const,
    topic: '멀티 사용자 화이트보드',
    stack: ['nextjs', 'websocket', 'supabase'],
    difficulty: 'advanced' as const,
    estimatedTime: 150,
    isPremium: true,
  },
  {
    type: 'tutorial' as const,
    topic: 'SaaS 어드민 패널 구축',
    stack: ['nextjs', 'tanstack-table', 'supabase'],
    difficulty: 'intermediate' as const,
    estimatedTime: 110,
    isPremium: false,
  },
]

async function main() {
  console.log('\n🚀 Starting Tutorial Generation...\n')
  console.log(`📊 Total: ${tutorialDocs.length} tutorials`)
  console.log('⚠️  React Icons를 사용하지 않고 MDX 컴포넌트만 사용합니다.\n')

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < tutorialDocs.length; i++) {
    const item = tutorialDocs[i]

    console.log(`\n[${i + 1}/${tutorialDocs.length}] 📚 Generating: ${item.topic}`)

    try {
      await generateAndSaveContent(item)
      successCount++
      console.log(`✅ Success (${successCount}/${tutorialDocs.length})`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed: ${error}`)
      console.log(`Failed count: ${failCount}`)

      // 실패해도 계속 진행
      continue
    }

    // API rate limit을 고려하여 각 요청 사이에 3초 대기 (튜토리얼은 더 김)
    if (i < tutorialDocs.length - 1) {
      console.log('⏳ Waiting 3 seconds before next request...')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Tutorial generation complete!')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${tutorialDocs.length}`)
  console.log('='.repeat(60) + '\n')
}

// 스크립트 실행
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Fatal error:', error)
      process.exit(1)
    })
}

export { tutorialDocs }
