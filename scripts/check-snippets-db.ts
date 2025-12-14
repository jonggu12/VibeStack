import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load env vars first
dotenv.config({ path: '.env.local' })

async function checkSnippets() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars:')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: snippets, error } = await supabaseAdmin
    .from('contents')
    .select('id, slug, title, type, status')
    .eq('type', 'snippet')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\n=== Snippets in Database ===\n')
  snippets?.forEach((snippet, index) => {
    console.log(`${index + 1}. Slug: "${snippet.slug}"`)
    console.log(`   Title: ${snippet.title}`)
    console.log(`   Status: ${snippet.status}`)
    console.log(`   ID: ${snippet.id}`)
    console.log('')
  })

  console.log(`Total: ${snippets?.length || 0} snippets\n`)
}

checkSnippets()
