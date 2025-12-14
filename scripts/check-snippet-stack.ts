import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

async function checkSnippetStack() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: snippets, error } = await supabaseAdmin
    .from('contents')
    .select('title, stack, snippet_language, description')
    .eq('type', 'snippet')
    .limit(3)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\n=== Sample Snippet Data ===\n')
  snippets?.forEach((snippet, i) => {
    console.log(`${i + 1}. ${snippet.title}`)
    console.log('   Stack:', JSON.stringify(snippet.stack, null, 2))
    console.log('   Language:', snippet.snippet_language)
    console.log('   Description:', snippet.description?.substring(0, 60) + '...')
    console.log('')
  })
}

checkSnippetStack()
