#!/usr/bin/env node

import { generateAndSaveContent } from './generate-content'

/**
 * 배치로 여러 콘텐츠를 한 번에 생성하는 스크립트
 *
 * 사용법:
 * npm run seed:batch
 */

// 생성할 콘텐츠 목록 정의
const contentBatch = [
  // ========== GLOSSARY (용어사전) ==========
  {
    type: 'glossary' as const,
    topic: 'API',
    stack: ['basic', 'web'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '웹훅 (Webhook)',
    stack: ['basic', 'api'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '데이터베이스',
    stack: ['basic', 'database'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '컴포넌트',
    stack: ['react', 'nextjs'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '환경변수',
    stack: ['nextjs', 'tools'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: 'SSR vs CSR',
    stack: ['nextjs', 'react'],
    difficulty: 'intermediate' as const,
    estimatedTime: 3,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '빌드 (Build)',
    stack: ['tools', 'nextjs'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: '배포 (Deploy)',
    stack: ['tools', 'vercel'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: 'CORS',
    stack: ['web', 'security'],
    difficulty: 'intermediate' as const,
    estimatedTime: 3,
    isPremium: false,
  },
  {
    type: 'glossary' as const,
    topic: 'npm',
    stack: ['tools', 'nodejs'],
    difficulty: 'beginner' as const,
    estimatedTime: 2,
    isPremium: false,
  },

  // ========== DOCS: 에러 해결 (errors) ==========
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

  // ========== DOCS: 프롬프트 작성법 (prompts) ==========
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

  // ========== DOCS: 시작 가이드 (getting-started) ==========
  {
    type: 'doc' as const,
    topic: 'Cursor 설치 및 설정',
    stack: ['cursor', 'tools'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
    category: 'getting-started' as const,
  },

  // ========== DOCS: 기능 구현 (implementation) ==========
  {
    type: 'doc' as const,
    topic: 'Clerk 인증 구현 가이드',
    stack: ['nextjs', 'clerk', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 10,
    isPremium: false,
    category: 'implementation' as const,
  },
  {
    type: 'doc' as const,
    topic: 'Supabase 데이터베이스 연결',
    stack: ['nextjs', 'supabase', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 12,
    isPremium: false,
    category: 'implementation' as const,
  },

  // ========== TUTORIALS (프로젝트) ==========
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
    topic: '대기자 명단 (이메일 수집) 랜딩 페이지',
    stack: ['nextjs', 'resend', 'supabase'],
    difficulty: 'beginner' as const,
    estimatedTime: 30,
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
    topic: 'AI 챗봇 만들기 (OpenAI API)',
    stack: ['nextjs', 'openai', 'vercel-ai'],
    difficulty: 'intermediate' as const,
    estimatedTime: 120,
    isPremium: false,
  },

  // ========== SNIPPETS (코드 조각) ==========
  {
    type: 'snippet' as const,
    topic: '구글 소셜 로그인 (Clerk)',
    stack: ['nextjs', 'clerk', 'typescript'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
  },
  {
    type: 'snippet' as const,
    topic: 'Stripe 결제 모달',
    stack: ['nextjs', 'stripe', 'typescript'],
    difficulty: 'intermediate' as const,
    estimatedTime: 10,
    isPremium: false,
  },
  {
    type: 'snippet' as const,
    topic: 'Supabase DB 연결 헬퍼',
    stack: ['nextjs', 'supabase', 'typescript'],
    difficulty: 'beginner' as const,
    estimatedTime: 5,
    isPremium: false,
  },
]

async function main() {
  console.log('\n🚀 Starting batch content generation...\n')
  console.log(`Total items to generate: ${contentBatch.length}\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < contentBatch.length; i++) {
    const item = contentBatch[i]
    console.log(`\n[${i + 1}/${contentBatch.length}] Generating: ${item.topic}`)

    try {
      await generateAndSaveContent(item)
      successCount++
      console.log(`✅ Success (${successCount}/${contentBatch.length})`)
    } catch (error) {
      failCount++
      console.error(`❌ Failed: ${error}`)
      console.log(`Failed count: ${failCount}`)

      // 실패해도 계속 진행
      continue
    }

    // API rate limit을 고려하여 각 요청 사이에 2초 대기
    if (i < contentBatch.length - 1) {
      console.log('⏳ Waiting 2 seconds before next request...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎉 Batch generation complete!')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`📊 Total: ${contentBatch.length}`)
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

export { contentBatch }
