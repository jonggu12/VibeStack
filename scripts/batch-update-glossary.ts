#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

import { buildGlossaryPrompt } from './prompts/glossary-prompt'
import { generateContent } from './utils/openai-client'
import {
  extractGlossaryMetadata,
  extractMetadata,
  slugify,
  stackToJson,
} from './utils/content-parser'
import { backupToFile } from './utils/backup'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase credentials not found in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface GlossarySeedRow {
  id: string
  slug: string
  title: string
  stack?: Record<string, string> | string | null
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimated_time_mins?: number
  is_premium?: boolean
  price_cents?: number
  status?: string
  category?: string | null
  type?: string
}

interface NormalizedStack {
  record: Record<string, string> | null
  values: string[]
}

function normalizeStack(raw: GlossarySeedRow['stack']): NormalizedStack {
  if (!raw) {
    return { record: null, values: [] }
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return {
          record: parsed as Record<string, string>,
          values: Object.values(parsed as Record<string, string>).map(String),
        }
      }
    } catch {
      return { record: null, values: raw.split(',').map(item => item.trim()).filter(Boolean) }
    }
  }

  if (Array.isArray(raw)) {
    const values = raw.map(String).filter(Boolean)
    return {
      record: values.length ? stackToJson(values) : null,
      values,
    }
  }

  if (typeof raw === 'object') {
    const record = raw as Record<string, string>
    return {
      record,
      values: Object.values(record).map(String),
    }
  }

  return { record: null, values: [] }
}

function unwrapGeneratedContent(content: string): string {
  let trimmed = content.trim()

  if (trimmed.startsWith('```mdx')) {
    trimmed = trimmed.replace(/^```mdx\s*\n/, '').replace(/\n```$/, '')
  } else if (trimmed.startsWith('```')) {
    trimmed = trimmed.replace(/^```\s*\n/, '').replace(/\n```$/, '')
  }

  return trimmed
}

async function updateGlossaryEntry(row: GlossarySeedRow, index: number, total: number) {
  console.log(`\n[${index + 1}/${total}] Updating "${row.title}" (${row.slug})`)

  if (!row.id) {
    throw new Error('Row id is missing')
  }

  const { record: existingStack, values: stackValues } = normalizeStack(row.stack)
  const prompt = buildGlossaryPrompt({
    term: row.title || row.slug,
    relatedStack: stackValues,
  })

  const generated = await generateContent({
    prompt,
    model: 'gpt-4o',
    maxTokens: 6000,
    temperature: 0.6,
  })

  const cleanedContent = unwrapGeneratedContent(generated)
  const metadata = extractMetadata(cleanedContent)
  const glossaryMeta = extractGlossaryMetadata(cleanedContent)
  const slug = row.slug || slugify(metadata.title)
  const stackPayload =
    stackValues.length > 0 ? stackToJson(stackValues) : existingStack || stackToJson([])

  await backupToFile('glossary', slug, cleanedContent)

  const difficulty = row.difficulty || 'beginner'
  const estimatedTime = row.estimated_time_mins || 5
  const isPremium = row.is_premium ?? false
  const priceCents = row.price_cents ?? (isPremium ? 1200 : 0)

  const { error } = await supabase
    .from('contents')
    .update({
      type: row.type || 'doc',
      category: row.category || 'concepts',
      title: metadata.title,
      description: metadata.description,
      content: cleanedContent,
      slug,
      stack: stackPayload,
      difficulty,
      estimated_time_mins: estimatedTime,
      is_premium: isPremium,
      price_cents: priceCents,
      status: row.status || 'published',
      meta_title: metadata.title,
      meta_description: metadata.description,
      term_category: glossaryMeta.category,
      related_terms: glossaryMeta.relatedTerms,
      synonyms: glossaryMeta.synonyms,
      analogy: glossaryMeta.analogy,
    })
    .eq('id', row.id)

  if (error) {
    throw error
  }

  console.log(`✅ Updated Supabase row ${row.id}`)
}

async function main() {
  const inputArg = process.argv[2]

  if (!inputArg) {
    console.error('Usage: npm run glossary:update -- <path-to-json>')
    process.exit(1)
  }

  const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg)
  const fileContents = await fs.readFile(inputPath, 'utf-8')
  const rows: GlossarySeedRow[] = JSON.parse(fileContents)

  if (!Array.isArray(rows)) {
    throw new Error('Input file must contain an array of glossary rows')
  }

  console.log(`📚 Loaded ${rows.length} glossary entries from ${inputPath}`)

  let errors = 0

  for (let i = 0; i < rows.length; i++) {
    try {
      await updateGlossaryEntry(rows[i], i, rows.length)
    } catch (error) {
      errors += 1
      console.error(`❌ Failed to update row ${rows[i]?.slug || rows[i]?.id}:`, error)
    }
  }

  if (errors > 0) {
    console.error(`\n⚠️ Completed with ${errors} error(s). Check the log above for details.`)
    process.exit(1)
  }

  console.log('\n🎉 All glossary entries updated successfully!')
}

main().catch(error => {
  console.error('Unexpected error while running batch update:', error)
  process.exit(1)
})
