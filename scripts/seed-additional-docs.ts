#!/usr/bin/env node

import { generateAndSaveContent } from './generate-content'

/**
 * 각 카테고리별로 2개씩 추가 문서 생성
 *
 * 사용법:
 * npx tsx scripts/seed-additional-docs.ts
 */

const additionalDocs = [
  // ========== 🚨 에러 해결 (errors) - 2개 ==========
  {
    type: 'doc' as const,
    topic: 'CORS 에러 완벽 해결 가이드',
    stack: ['nextjs', 'api', 'troubleshooting'],
    difficulty: 'intermediate' as const,
    estimatedTime: 8,
    isPremium: false,
    category: 'errors' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Image Optimization Failed 에러 해결',
    stack: ['nextjs', 'image', 'troubleshooting'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
    category: 'errors' as const,
  },

  // ========== 💬 프롬프트 작성법 (prompts) - 2개 ==========
  {
    type: 'doc' as const,
    topic: '디버깅할 때 AI에게 질문하는 법',
    stack: ['ai', 'cursor', 'debugging'],
    difficulty: 'beginner' as const,
    estimatedTime: 6,
    isPremium: false,
    category: 'prompts' as const,
  },
  {
    type: 'doc' as const,
    topic: '성능 최적화 프롬프트 작성법',
    stack: ['ai', 'cursor', 'performance'],
    difficulty: 'intermediate' as const,
    estimatedTime: 7,
    isPremium: false,
    category: 'prompts' as const,
  },

  // ========== 🚀 시작 가이드 (getting-started) - 2개 ==========
  {
    type: 'doc' as const,
    topic: 'Git & GitHub 완벽 시작 가이드',
    stack: ['git', 'github', 'tools'],
    difficulty: 'beginner' as const,
    estimatedTime: 15,
    isPremium: false,
    category: 'getting-started' as const,
  },
  {
    type: 'doc' as const,
    topic: 'TypeScript 기초 세팅 & 시작하기',
    stack: ['typescript', 'tools'],
    difficulty: 'beginner' as const,
    estimatedTime: 12,
    isPremium: false,
    category: 'getting-started' as const,
  },

  // ========== 🛠️ 기능 구현 (implementation) - 2개 ==========
  {
    type: 'doc' as const,
    topic: 'WebSocket 실시간 통신 구현하기',
    stack: ['nextjs', 'websocket', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 25,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Next.js Image 최적화 완벽 가이드',
    stack: ['nextjs', 'image', 'performance'],
    difficulty: 'beginner' as const,
    estimatedTime: 10,
    isPremium: false,
    category: 'implementation' as const,
  },

  // ========== 📖 개념 & 용어 (concepts) - 2개 ==========
  {
    type: 'doc' as const,
    topic: 'REST API vs GraphQL',
    stack: ['api', 'web'],
    difficulty: 'intermediate' as const,
    estimatedTime: 8,
    isPremium: false,
    category: 'concepts' as const,
  },
  {
    type: 'doc' as const,
    topic: 'SSR (Server-Side Rendering)',
    stack: ['nextjs', 'react', 'web'],
    difficulty: 'intermediate' as const,
    estimatedTime: 6,
    isPremium: false,
    category: 'concepts' as const,
  },
]

async function main() {
  console.log('\n🚀 Starting Additional Docs Generation...\n')
  console.log(`📊 Total: ${additionalDocs.length} documents (2 per category)`)
  console.log(`🚨 Errors: 2`)
  console.log(`💬 Prompts: 2`)
  console.log(`🚀 Getting Started: 2`)
  console.log(`🛠️ Implementation: 2`)
  console.log(`📖 Concepts: 2\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < additionalDocs.length; i++) {
    const item = additionalDocs[i]
    const categoryEmoji = {
      errors: '🚨',
      prompts: '💬',
      'getting-started': '🚀',
      implementation: '🛠️',
      concepts: '📖',
    }[item.category!] || '📄'

    console.log(`\n[${i + 1}/${additionalDocs.length}] ${categoryEmoji} Generating: ${item.topic}`)

    try {
      await generateAndSaveContent(item)
      successCount++
      console.log(`✅ Success (${successCount}/${additionalDocs.length})`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed: ${error}`)
      console.log(`Failed count: ${failCount}`)

      // 실패해도 계속 진행
      continue
    }

    // API rate limit을 고려하여 각 요청 사이에 2초 대기
    if (i < additionalDocs.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Batch generation complete!')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${additionalDocs.length}`)
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

export { additionalDocs }
