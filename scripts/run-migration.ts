/**
 * Script to run Supabase migrations
 * Usage: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Read migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20241127_soft_onboarding_schema.sql'
  )

  console.log('📂 Reading migration file:', migrationPath)

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath)
    process.exit(1)
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  console.log('🚀 Running soft onboarding schema migration...')

  try {
    // Execute migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    })

    if (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }

    console.log('✅ Migration completed successfully!')
    console.log('\n📊 Created tables:')
    console.log('  - user_behaviors')
    console.log('  - onboarding_prompts')
    console.log('\n📝 Added columns to users table:')
    console.log('  - onboarding_completed')
    console.log('  - onboarding_dismissed_at')
    console.log('  - inferred_stack')
    console.log('  - content_view_count')
    console.log('  - search_count')
    console.log('  - project_type')
    console.log('  - stack_preset')
    console.log('\n⚙️  Created functions:')
    console.log('  - update_user_behavior_counts()')
    console.log('  - infer_user_stack()')
    console.log('\n🔐 Enabled RLS policies for new tables')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

runMigration()
