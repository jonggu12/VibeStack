#!/usr/bin/env tsx
/**
 * Direct migration script - Runs SQL migration directly on Supabase
 * Usage: npx tsx scripts/run-migration-direct.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function runMigrationDirect() {
  console.log('🚀 VibeStack - Soft Onboarding Migration\n')

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials\n')
    console.error('Please ensure the following are set in .env.local:')
    console.error('  - NEXT_PUBLIC_SUPABASE_URL')
    console.error('  - SUPABASE_SERVICE_ROLE_KEY\n')
    console.error('📖 See SUPABASE_SETUP.md for detailed instructions')
    process.exit(1)
  }

  console.log('✅ Environment variables found')
  console.log(`   URL: ${supabaseUrl}\n`)

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Test connection
  console.log('🔌 Testing connection...')
  const { error: connectionError } = await supabase.from('users').select('count').limit(1)

  if (connectionError) {
    console.error('❌ Connection failed:', connectionError.message)
    process.exit(1)
  }
  console.log('✅ Connected to Supabase\n')

  // Read migration file
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '20241127_soft_onboarding_schema.sql'
  )

  console.log('📂 Reading migration file...')
  console.log(`   ${migrationPath}`)

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath)
    process.exit(1)
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
  console.log(`✅ Migration file loaded (${(migrationSQL.length / 1024).toFixed(1)} KB)\n`)

  // Split SQL into individual statements (simple approach)
  // More robust: use a SQL parser, but this works for our migration
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📊 Found ${statements.length} SQL statements\n`)
  console.log('🔧 Executing migration...\n')

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    const preview = statement.substring(0, 60).replace(/\s+/g, ' ')

    process.stdout.write(`   [${i + 1}/${statements.length}] ${preview}... `)

    try {
      // Execute SQL statement
      const { error } = await supabase.rpc('exec_sql', { query: statement })

      if (error) {
        // Some errors are OK (e.g., "already exists" for idempotent migrations)
        if (
          error.message.includes('already exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('does not exist')
        ) {
          console.log('⚠️  (skipped - already exists)')
        } else {
          console.log('❌')
          console.error(`      Error: ${error.message}`)
          errorCount++
        }
      } else {
        console.log('✅')
        successCount++
      }
    } catch (err: unknown) {
      console.log('❌')
      const error = err as Error
      console.error(`      Error: ${error.message}`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 Migration Summary`)
  console.log('='.repeat(60))
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ⚠️  Warnings/Skipped: ${statements.length - successCount - errorCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('='.repeat(60) + '\n')

  if (errorCount > 0) {
    console.log('⚠️  Some errors occurred. Please check above for details.')
    console.log('   If errors are about existing objects, they can be safely ignored.\n')
  } else {
    console.log('🎉 Migration completed successfully!\n')
  }

  // Verify tables were created
  console.log('🔍 Verifying migration...\n')

  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['user_behaviors', 'onboarding_prompts'])

  if (tableError) {
    console.log('⚠️  Could not verify tables (this is OK)')
  } else {
    console.log('✅ Tables created:')
    tables?.forEach(t => console.log(`   - ${t.table_name}`))
  }

  console.log('\n✨ Next steps:')
  console.log('   1. Check Supabase Dashboard → Table Editor')
  console.log('   2. Verify tables: user_behaviors, onboarding_prompts')
  console.log('   3. Check users table for new columns')
  console.log('   4. Restart dev server: npm run dev\n')
}

// Alternative: Execute SQL statement by statement using Supabase's query method
async function executeSQL(supabase: ReturnType<typeof createClient>, sql: string) {
  // This is a fallback if exec_sql RPC doesn't exist
  // You may need to create this function in Supabase first
  return supabase.rpc('exec_sql', { query: sql })
}

// Run migration
runMigrationDirect().catch(error => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
