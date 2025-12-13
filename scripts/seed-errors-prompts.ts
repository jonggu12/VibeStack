#!/usr/bin/env node

import { generateAndSaveContent } from './generate-content'

/**
 * 에러 해결 + 프롬프트 작성법 문서만 생성하는 임시 스크립트
 *
 * 사용법:
 * npx tsx scripts/seed-errors-prompts.ts
 */

const errorAndPromptDocs = [
  // ========== 🚨 에러 해결 (errors) - 5개 ==========
  {
    type: 'doc' as const,
    topic: 'Module not found 에러 해결',
    stack: ['nextjs', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 3,
    isPremium: false,
    category: 'errors' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Hydration Error 완벽 해결법',
    stack: ['nextjs', 'react', 'troubleshooting'],
    difficulty: 'intermediate' as const,
    estimatedTime: 5,
    isPremium: false,
    category: 'errors' as const,
  },
  {
    type: 'doc' as const,
    topic: 'use client 에러 3분 해결',
    stack: ['nextjs', 'react', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 3,
    isPremium: false,
    category: 'errors' as const,
  },
  {
    type: 'doc' as const,
    topic: '환경변수가 안 먹을 때 체크리스트',
    stack: ['nextjs', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 4,
    isPremium: false,
    category: 'errors' as const,
  },
  {
    type: 'doc' as const,
    topic: 'npm install 실패 해결 가이드',
    stack: ['nodejs', 'npm', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
    category: 'errors' as const,
  },

  // ========== 💬 프롬프트 작성법 (prompts) - 5개 ==========
  {
    type: 'doc' as const,
    topic: 'AI 프롬프트 작성 공식',
    stack: ['ai', 'cursor'],
    difficulty: 'beginner' as const,
    estimatedTime: 7,
    isPremium: false,
    category: 'prompts' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Cursor 프롬프트 완벽 가이드',
    stack: ['cursor', 'ai'],
    difficulty: 'beginner' as const,
    estimatedTime: 8,
    isPremium: false,
    category: 'prompts' as const,
  },
  {
    type: 'doc' as const,
    topic: 'AI가 자주 틀리는 부분 TOP 10',
    stack: ['ai', 'cursor', 'troubleshooting'],
    difficulty: 'intermediate' as const,
    estimatedTime: 6,
    isPremium: false,
    category: 'prompts' as const,
  },
  {
    type: 'doc' as const,
    topic: 'AI에게 에러 설명하는 법',
    stack: ['ai', 'cursor', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
    category: 'prompts' as const,
  },
  {
    type: 'doc' as const,
    topic: '코드 리팩토링 프롬프트 템플릿',
    stack: ['ai', 'cursor', 'best-practices'],
    difficulty: 'intermediate' as const,
    estimatedTime: 7,
    isPremium: false,
    category: 'prompts' as const,
  },
]

async function main() {
  console.log('\n🚀 Starting Error & Prompt Docs Generation...\n')
  console.log(`📊 Total: ${errorAndPromptDocs.length} documents`)
  console.log(`🚨 Errors: 5 documents`)
  console.log(`💬 Prompts: 5 documents\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < errorAndPromptDocs.length; i++) {
    const item = errorAndPromptDocs[i]
    const emoji = item.category === 'errors' ? '🚨' : '💬'

    console.log(`\n[${i + 1}/${errorAndPromptDocs.length}] ${emoji} Generating: ${item.topic}`)

    try {
      await generateAndSaveContent(item)
      successCount++
      console.log(`✅ Success (${successCount}/${errorAndPromptDocs.length})`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed: ${error}`)
      console.log(`Failed count: ${failCount}`)

      // 실패해도 계속 진행
      continue
    }

    // API rate limit을 고려하여 각 요청 사이에 2초 대기
    if (i < errorAndPromptDocs.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Batch generation complete!')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${errorAndPromptDocs.length}`)
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

export { errorAndPromptDocs }
