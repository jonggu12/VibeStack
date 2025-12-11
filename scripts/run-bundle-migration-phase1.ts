/**
 * Script to run Bundle Integration Phase 1 Migration
 * Usage: npx tsx scripts/run-bundle-migration-phase1.ts
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

  // Read Phase 1 migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20241211_01_integrate_bundles_phase1.sql'
  )

  console.log('📂 Reading migration file:', migrationPath)

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath)
    process.exit(1)
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

  console.log('🚀 Running Bundle Integration Phase 1...')
  console.log('   This will update the database schema (no data changes)')
  console.log('')

  try {
    // Split the SQL into individual statements
    // PostgreSQL doesn't support all statements in a single RPC call
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)
    console.log('')

    let successCount = 0
    let skipCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.startsWith('/*') || statement.length < 5) {
        skipCount++
        continue
      }

      // Show what we're executing
      const preview = statement.substring(0, 60).replace(/\s+/g, ' ')
      console.log(`[${i + 1}/${statements.length}] ${preview}...`)

      const { error } = await supabase.rpc('exec_sql', {
        sql: statement + ';',
      })

      if (error) {
        console.error(`❌ Failed at statement ${i + 1}:`, error.message)
        console.error('Statement:', statement)
        process.exit(1)
      }

      successCount++
    }

    console.log('')
    console.log('✅ Phase 1 Migration completed successfully!')
    console.log(`   Executed: ${successCount} statements`)
    console.log(`   Skipped: ${skipCount} comments/empty statements`)
    console.log('')
    console.log('📊 Changes applied:')
    console.log('   ✅ Added columns to contents table:')
    console.log('      - discount_pct (INTEGER)')
    console.log('      - thumbnail_url (TEXT)')
    console.log('')
    console.log('   ✅ Renamed table:')
    console.log('      - bundle_contents → content_children')
    console.log('')
    console.log('   ✅ Renamed column:')
    console.log('      - bundle_id → parent_content_id')
    console.log('')
    console.log('   ✅ Updated foreign keys:')
    console.log('      - parent_content_id now references contents(id)')
    console.log('')
    console.log('   ✅ Created indexes:')
    console.log('      - idx_content_children_parent')
    console.log('      - idx_content_children_content')
    console.log('      - idx_content_children_parent_order')
    console.log('      - idx_contents_bundle_discount')
    console.log('      - idx_contents_bundle_published')
    console.log('')
    console.log('⚠️  Note: bundles table still exists (will be removed in Phase 3)')
    console.log('')
    console.log('📋 Next steps:')
    console.log('   1. Verify schema changes in Supabase Dashboard')
    console.log('   2. Run Phase 2: Data migration (if bundles table has data)')
    console.log('   3. Run Phase 3: Cleanup (remove bundles table)')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

runMigration()
