import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in .env.local')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateContentOptions {
  prompt: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export async function generateContent(options: GenerateContentOptions): Promise<string> {
  const {
    prompt,
    model = 'gpt-4o', // GPT-4 Omni (최신 모델)
    maxTokens = 8000,
    temperature = 0.7,
  } = options

  console.log(`🤖 Calling OpenAI API (${model})...`)

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert technical content writer for VibeStack, a developer learning platform. Write clear, practical, and actionable content for developers using AI coding tools.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature,
  })

  const content = response.choices[0]?.message?.content

  if (!content) {
    throw new Error('No content generated from OpenAI')
  }

  console.log(`✅ Generated ${content.length} characters`)
  console.log(`💰 Tokens used: ${response.usage?.total_tokens || 0}`)

  return content
}
