#!/usr/bin/env node

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

/**
 * 모든 draft 상태의 튜토리얼을 published로 변경
 *
 * 사용법:
 * npx tsx scripts/publish-tutorials.ts
 */

async function main() {
  // Dynamically import after env vars are loaded
  const { supabaseAdmin } = await import('../lib/supabase')

  console.log('\n📢 Publishing draft tutorials...\n')

  // Update all draft tutorials to published
  const { data, error } = await supabaseAdmin
    .from('contents')
    .update({
      status: 'published',
      updated_at: new Date().toISOString()
    })
    .eq('type', 'tutorial')
    .eq('status', 'draft')
    .select('id, title')

  if (error) {
    console.error('❌ Error updating tutorials:', error)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No draft tutorials found to publish.')
    return
  }

  console.log(`✅ Published ${data.length} tutorials:\n`)
  data.forEach((tutorial, index) => {
    console.log(`${index + 1}. ${tutorial.title}`)
  })

  console.log('\n' + '='.repeat(60))
  console.log('🎉 All tutorials are now published!')
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
