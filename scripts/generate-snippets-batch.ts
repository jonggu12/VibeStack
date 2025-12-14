/**
 * 스니펫 10개 일괄 생성 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/generate-snippets-batch.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { buildSnippetPrompt, type SnippetPromptOptions } from './prompts/snippet-prompt'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

// 환경변수 확인
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 환경변수가 설정되지 않았습니다.')
  console.error('필요한 환경변수: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

// Supabase 클라이언트 초기화 (Admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// 📋 생성할 스니펫 10개 주제
const snippetTopics: SnippetPromptOptions[] = [
  {
    topic: 'Google 소셜 로그인',
    category: 'Auth',
    stack: ['Next.js', 'Clerk'],
    difficulty: 'beginner',
  },
  {
    topic: 'Stripe 결제 체크아웃',
    category: 'Payment',
    stack: ['Next.js', 'Stripe'],
    difficulty: 'intermediate',
  },
  {
    topic: 'Supabase 클라이언트 설정',
    category: 'Database',
    stack: ['Next.js', 'Supabase'],
    difficulty: 'beginner',
  },
  {
    topic: 'useDebounce 훅',
    category: 'Hook',
    stack: ['React', 'TypeScript'],
    difficulty: 'beginner',
  },
  {
    topic: 'Shadcn 버튼 컴포넌트',
    category: 'UI',
    stack: ['React', 'Shadcn/ui', 'Tailwind'],
    difficulty: 'beginner',
  },
  {
    topic: 'Nodemailer 이메일 발송',
    category: 'API',
    stack: ['Next.js', 'Nodemailer'],
    difficulty: 'intermediate',
  },
  {
    topic: 'S3 파일 업로드',
    category: 'Storage',
    stack: ['Next.js', 'AWS S3'],
    difficulty: 'intermediate',
  },
  {
    topic: 'JWT 토큰 검증',
    category: 'Auth',
    stack: ['Next.js', 'jsonwebtoken'],
    difficulty: 'intermediate',
  },
  {
    topic: 'Zod 폼 유효성 검사',
    category: 'Validation',
    stack: ['React', 'Zod', 'React Hook Form'],
    difficulty: 'beginner',
  },
  {
    topic: 'Toast 알림',
    category: 'UI',
    stack: ['React', 'Sonner'],
    difficulty: 'beginner',
  },
]

// 스니펫 데이터 타입
interface SnippetData {
  content: string
  code_snippet: string
  prompt_text: string
}

// OpenAI API 호출해서 스니펫 생성
async function generateSnippet(options: SnippetPromptOptions): Promise<SnippetData> {
  console.log(`\n🤖 GPT-4o API 호출 중: "${options.topic}"...`)

  const prompt = buildSnippetPrompt(options)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' }, // JSON 모드 활성화
    temperature: 0.7,
    max_tokens: 4000,
  })

  // 응답에서 JSON 추출 (JSON 모드 사용 시 코드 블록 없이 바로 JSON 반환)
  const responseText = completion.choices[0]?.message?.content || ''

  let snippetData: SnippetData
  try {
    snippetData = JSON.parse(responseText)
  } catch (parseError) {
    console.error('❌ JSON 파싱 실패')
    console.error('응답 (첫 1000자):', responseText.slice(0, 1000))
    throw parseError
  }

  console.log('✅ 생성 완료!')
  console.log(`   - 문서 길이: ${snippetData.content.length}자`)
  console.log(`   - 코드 길이: ${snippetData.code_snippet.length}자`)
  console.log(`   - 프롬프트 길이: ${snippetData.prompt_text.length}자`)

  return snippetData
}

// Supabase에 스니펫 저장
async function saveSnippet(options: SnippetPromptOptions, data: SnippetData) {
  console.log(`\n💾 Supabase에 저장 중: "${options.topic}"...`)

  // slug 생성 (한글 제거, 공백을 하이픈으로)
  const slug = options.topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || `snippet-${Date.now()}`

  // frontmatter에서 title, description 추출
  const frontmatterMatch = data.content.match(/---\s*\n([\s\S]*?)\n---/)
  let title = options.topic
  let description = ''

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/)
    const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/)

    if (titleMatch) title = titleMatch[1]
    if (descMatch) description = descMatch[1]
  }

  // 언어 감지 (code_snippet에서 첫 번째 코드 블록의 언어)
  const langMatch = data.code_snippet.match(/^\/\/.*|^import\s/)
  const snippet_language = langMatch ? 'typescript' : 'typescript'

  // 데이터 삽입 (category는 제외 - enum 타입 충돌 방지)
  const { data: insertedData, error } = await supabase.from('contents').insert({
    type: 'snippet',
    slug,
    title,
    description,
    content: data.content,
    code_snippet: data.code_snippet,
    prompt_text: data.prompt_text,
    snippet_language,
    // category: options.category, // enum 충돌로 인해 제외
    stack: { framework: options.stack[0], tools: options.stack.slice(1) },
    difficulty: options.difficulty,
    is_premium: false,
    status: 'published',
    estimated_time_mins: 10,
    price_cents: 0,
  })

  if (error) {
    console.error('❌ 저장 실패:', error.message)
    throw error
  }

  console.log(`✅ 저장 완료! slug: ${slug}`)
}

// 메인 실행 함수
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📦 스니펫 일괄 생성 스크립트')
  console.log(`총 ${snippetTopics.length}개 스니펫 생성 예정`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < snippetTopics.length; i++) {
    const topic = snippetTopics[i]

    console.log(`\n[${i + 1}/${snippetTopics.length}] 처리 중: "${topic.topic}"`)
    console.log('─────────────────────────────────────────')

    try {
      // 1. Claude API로 스니펫 생성
      const snippetData = await generateSnippet(topic)

      // 2. Supabase에 저장
      await saveSnippet(topic, snippetData)

      successCount++

      // API Rate Limit 방지 (2초 대기)
      if (i < snippetTopics.length - 1) {
        console.log('\n⏳ 2초 대기 중...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error(`\n❌ 실패: "${topic.topic}"`)
      console.error(error)
      failCount++
    }
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 최종 결과')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ 성공: ${successCount}개`)
  console.log(`❌ 실패: ${failCount}개`)
  console.log(`📦 총 ${successCount + failCount}개 처리 완료`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (successCount > 0) {
    console.log('🎉 생성된 스니펫은 /snippets 페이지에서 확인할 수 있습니다!')
  }
}

// 실행
main().catch((error) => {
  console.error('💥 치명적 오류:', error)
  process.exit(1)
})
