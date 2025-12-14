import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load env vars first
dotenv.config({ path: '.env.local' })

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // 공백을 대시로
    .replace(/[^\w\-가-힣]/g, '') // 특수문자 제거
    .replace(/\-\-+/g, '-') // 연속된 대시를 하나로
    .replace(/^-+/, '') // 시작 대시 제거
    .replace(/-+$/, '') // 끝 대시 제거
}

async function fixSlugs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // 모든 스니펫 가져오기
  const { data: snippets, error } = await supabaseAdmin
    .from('contents')
    .select('id, slug, title')
    .eq('type', 'snippet')

  if (error) {
    console.error('Error fetching snippets:', error)
    return
  }

  console.log(`\nFound ${snippets.length} snippets. Fixing slugs...\n`)

  // 각 스니펫의 슬러그 업데이트
  for (const snippet of snippets) {
    const newSlug = generateSlug(snippet.title)

    if (snippet.slug !== newSlug) {
      console.log(`Updating: "${snippet.slug}" → "${newSlug}"`)
      console.log(`  Title: ${snippet.title}`)

      const { error: updateError } = await supabaseAdmin
        .from('contents')
        .update({ slug: newSlug })
        .eq('id', snippet.id)

      if (updateError) {
        console.error(`  ❌ Error updating:`, updateError)
      } else {
        console.log(`  ✅ Updated successfully`)
      }
      console.log('')
    } else {
      console.log(`✓ Slug already correct: "${newSlug}"`)
    }
  }

  console.log('\nDone!\n')
}

fixSlugs()
