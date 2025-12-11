/**
 * Script to run Bundle Integration Phase 2/3 (Cleanup)
 * Usage: npx tsx scripts/run-bundle-migration-cleanup.ts
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

  // Read Phase 2/3 cleanup migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20241211_02_integrate_bundles_cleanup.sql'
  )

  console.log('📂 Reading migration file:', migrationPath)

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath)
    process.exit(1)
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  console.log('🚀 Running Bundle Integration Phase 2/3 (Cleanup)...')
  console.log('   This will remove the bundles table')
  console.log('   ⚠️  Make sure Phase 1 completed successfully!')
  console.log('')

  try {
    // Execute the entire migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    })

    if (error) {
      console.error('❌ Migration failed:', error.message)
      console.error('')
      console.error('Common issues:')
      console.error('  1. Phase 1 not completed - run Phase 1 first')
      console.error('  2. bundles table has data - should be empty')
      console.error('  3. purchases table references bundles - should be none')
      process.exit(1)
    }

    console.log('')
    console.log('✅ Phase 2/3 Migration completed successfully!')
    console.log('')
    console.log('📊 Changes applied:')
    console.log('   ✅ Dropped bundles table')
    console.log('   ✅ Removed bundle_id from purchases table')
    console.log('   ✅ Updated CHECK constraints')
    console.log('')
    console.log('📋 Current Database Structure:')
    console.log('')
    console.log('   contents table:')
    console.log('   ├─ id, type, slug, title, ...')
    console.log('   ├─ discount_pct (bundle only)')
    console.log('   └─ thumbnail_url (bundle only)')
    console.log('')
    console.log('   content_children table:')
    console.log('   ├─ parent_content_id → contents(id) [bundle]')
    console.log('   ├─ content_id → contents(id) [child]')
    console.log('   └─ display_order')
    console.log('')
    console.log('   purchases table:')
    console.log('   └─ content_id → contents(id) [includes bundles]')
    console.log('')
    console.log('🎯 Next Steps:')
    console.log('   1. Update TypeScript types (remove Bundle interface)')
    console.log('   2. Update server actions (use contents table only)')
    console.log('   3. Test bundle CRUD operations')
    console.log('   4. Update admin panel (if needed)')
    console.log('')
    console.log('🎉 Bundle integration complete!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

runMigration()
