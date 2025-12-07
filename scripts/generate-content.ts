#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { generateContent } from './utils/openai-client'
import { backupToFile, ContentType } from './utils/backup'
import { slugify, extractMetadata, extractTags, stackToJson } from './utils/content-parser'
import {
  buildTutorialPrompt,
  TutorialPromptOptions,
} from './prompts/tutorial-prompt'
import { buildSnippetPrompt, SnippetPromptOptions } from './prompts/snippet-prompt'
import { buildDocPrompt, DocPromptOptions } from './prompts/doc-prompt'
import {
  buildGlossaryPrompt,
  GlossaryPromptOptions,
} from './prompts/glossary-prompt'

dotenv.config({ path: '.env.local' })

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials not found in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface GenerateOptions {
  type: ContentType
  topic: string
  stack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime?: number
  isPremium?: boolean
}

async function generateAndSaveContent(options: GenerateOptions) {
  const { type, topic, stack, difficulty, estimatedTime = 30, isPremium = false } = options

  console.log('\n' + '='.repeat(60))
  console.log(`🚀 Generating ${type.toUpperCase()}: ${topic}`)
  console.log('='.repeat(60) + '\n')

  // 1. 프롬프트 생성
  let prompt: string
  switch (type) {
    case 'tutorial':
      prompt = buildTutorialPrompt({
        topic,
        stack,
        difficulty,
        estimatedTime,
      } as TutorialPromptOptions)
      break
    case 'snippet':
      prompt = buildSnippetPrompt({
        topic,
        stack,
        difficulty,
      } as SnippetPromptOptions)
      break
    case 'doc':
      prompt = buildDocPrompt({
        topic,
        stack,
        difficulty,
      } as DocPromptOptions)
      break
    case 'glossary':
      prompt = buildGlossaryPrompt({
        term: topic,
        relatedStack: stack,
      } as GlossaryPromptOptions)
      break
    default:
      throw new Error(`Unknown content type: ${type}`)
  }

  // 2. OpenAI API 호출
  const generatedContent = await generateContent({
    prompt,
    model: 'gpt-4o',
    maxTokens: 8000,
    temperature: 0.7,
  })

  // 3. 메타데이터 추출
  const metadata = extractMetadata(generatedContent)
  const slug = slugify(metadata.title)
  const tags = extractTags(generatedContent, stack)
  const stackJson = stackToJson(stack)

  console.log(`\n📋 Metadata:`)
  console.log(`  Title: ${metadata.title}`)
  console.log(`  Slug: ${slug}`)
  console.log(`  Tags: ${tags.join(', ')}`)

  // 4. 로컬 파일로 백업
  await backupToFile(type, slug, generatedContent)

  // 5. Supabase에 저장
  console.log(`\n💾 Saving to Supabase...`)

  const { data, error } = await supabase
    .from('contents')
    .insert({
      type,
      title: metadata.title,
      description: metadata.description,
      content: generatedContent,
      slug,
      stack: stackJson,
      tags,
      difficulty,
      estimated_time_mins: estimatedTime,
      is_premium: isPremium,
      status: 'draft', // 검수 후 published로 변경
      published_at: null,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to save to Supabase:', error)
    throw error
  }

  // 6. 성공 메시지
  console.log(`\n✅ Successfully generated and saved!`)
  console.log(`\n📍 Locations:`)
  console.log(`  - Database: ID ${data.id}`)
  console.log(`  - Admin UI: http://localhost:3000/admin/content/${data.id}`)
  console.log(`  - Backup: scripts/generated/${type}s/${slug}.mdx`)
  console.log(`  - Status: ${data.status}`)
  console.log('\n' + '='.repeat(60) + '\n')

  return data
}

// CLI 실행
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 4) {
    console.log(`
Usage: npm run generate -- <type> <topic> <stack> <difficulty> [estimatedTime] [isPremium]

Examples:
  npm run generate -- tutorial "Next.js 인증 구현" "nextjs,clerk,typescript" intermediate 45
  npm run generate -- snippet "useDebounce 훅" "react,typescript" beginner
  npm run generate -- doc "Server Components 가이드" "nextjs,react" beginner
  npm run generate -- glossary "Server Actions" "nextjs" beginner

Arguments:
  type          tutorial | snippet | doc | glossary
  topic         콘텐츠 주제 (따옴표로 감싸기)
  stack         쉼표로 구분된 기술 스택
  difficulty    beginner | intermediate | advanced
  estimatedTime (선택) 예상 소요 시간 (분) - default: 30
  isPremium     (선택) true | false - default: false
`)
    process.exit(1)
  }

  const type = args[0] as ContentType
  const topic = args[1]
  const stack = args[2].split(',').map(s => s.trim())
  const difficulty = args[3] as 'beginner' | 'intermediate' | 'advanced'
  const estimatedTime = args[4] ? parseInt(args[4]) : 30
  const isPremium = args[5] === 'true'

  try {
    await generateAndSaveContent({
      type,
      topic,
      stack,
      difficulty,
      estimatedTime,
      isPremium,
    })
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main()
}

export { generateAndSaveContent }
