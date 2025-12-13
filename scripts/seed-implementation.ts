#!/usr/bin/env node

import { generateAndSaveContent } from './generate-content'

/**
 * 기능 구현 문서만 생성하는 임시 스크립트
 *
 * 사용법:
 * npx tsx scripts/seed-implementation.ts
 */

const implementationDocs = [
  // ========== 🛠️ 기능 구현 (implementation) - 5개 ==========
  {
    type: 'doc' as const,
    topic: 'Clerk 인증 완벽 구현 가이드',
    stack: ['nextjs', 'clerk', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 15,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Supabase 데이터베이스 연결하기',
    stack: ['nextjs', 'supabase', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 12,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Stripe 결제 연동 A to Z',
    stack: ['nextjs', 'stripe', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 20,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Resend로 이메일 발송 구현',
    stack: ['nextjs', 'resend', 'typescript'],
    difficulty: 'beginner' as const,
    estimatedTime: 10,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: '파일 업로드 기능 만들기 (Supabase Storage)',
    stack: ['nextjs', 'supabase', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 15,
    isPremium: false,
    category: 'implementation' as const,
  },
]

async function main() {
  console.log('\n🚀 Starting Implementation Docs Generation...\n')
  console.log(`📊 Total: ${implementationDocs.length} documents`)
  console.log(`🛠️ Implementation: 5 documents\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < implementationDocs.length; i++) {
    const item = implementationDocs[i]

    console.log(`\n[${i + 1}/${implementationDocs.length}] 🛠️ Generating: ${item.topic}`)

    try {
      await generateAndSaveContent(item)
      successCount++
      console.log(`✅ Success (${successCount}/${implementationDocs.length})`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed: ${error}`)
      console.log(`Failed count: ${failCount}`)

      // 실패해도 계속 진행
      continue
    }

    // API rate limit을 고려하여 각 요청 사이에 2초 대기
    if (i < implementationDocs.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Batch generation complete!')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${implementationDocs.length}`)
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

export { implementationDocs }
