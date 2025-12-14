import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

// 스니펫별 카테고리 및 태그 매핑
const SNIPPET_MAPPINGS: Record<string, { category: string; tags: string[] }> = {
  // Auth
  'google-소셜-로그인': {
    category: 'auth',
    tags: ['google', 'oauth', 'clerk', 'social-login', '소셜로그인', '인증'],
  },
  'jwt-토큰-검증': {
    category: 'auth',
    tags: ['jwt', 'token', 'authentication', '토큰', '인증', 'security'],
  },

  // Payment
  'stripe-결제-체크아웃': {
    category: 'payment',
    tags: ['stripe', 'checkout', 'payment', '결제', 'subscription'],
  },

  // Database
  'supabase-클라이언트-설정': {
    category: 'database',
    tags: ['supabase', 'postgresql', 'database', 'db', '데이터베이스', 'client'],
  },

  // Storage
  's3-파일-업로드': {
    category: 'storage',
    tags: ['aws', 's3', 'upload', 'storage', '업로드', '파일', 'file'],
  },

  // Email
  'nodemailer-이메일-발송': {
    category: 'email',
    tags: ['nodemailer', 'email', 'smtp', '이메일', '메일', 'send'],
  },

  // UI
  'toast-알림': {
    category: 'ui',
    tags: ['toast', 'notification', 'sonner', 'ui', '알림', 'alert'],
  },
  'shadcn-버튼-컴포넌트': {
    category: 'ui',
    tags: ['shadcn', 'button', 'component', 'ui', '버튼', '컴포넌트', 'radix'],
  },

  // Hooks
  'usedebounce-훅': {
    category: 'hooks',
    tags: ['debounce', 'hook', 'react', 'custom-hook', 'performance', '훅', '최적화'],
  },

  // Validation
  'zod-폼-유효성-검사': {
    category: 'validation',
    tags: ['zod', 'validation', 'form', 'schema', '유효성', '검증', '폼'],
  },
}

async function updateSnippetCategories() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  console.log('\n🚀 Updating snippet categories and tags...\n')

  let successCount = 0
  let errorCount = 0

  for (const [slug, mapping] of Object.entries(SNIPPET_MAPPINGS)) {
    try {
      const { error } = await supabaseAdmin
        .from('contents')
        .update({
          snippet_category: mapping.category,
          tags: mapping.tags,
        })
        .eq('type', 'snippet')
        .eq('slug', slug)

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Updated: ${slug}`)
        console.log(`   Category: ${mapping.category}`)
        console.log(`   Tags: [${mapping.tags.join(', ')}]`)
        console.log('')
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception updating ${slug}:`, err)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('')

  // Verify results
  const { data: snippets, error: queryError } = await supabaseAdmin
    .from('contents')
    .select('slug, snippet_category, tags')
    .eq('type', 'snippet')
    .order('created_at', { ascending: false })

  if (!queryError && snippets) {
    console.log('📋 Current state:')
    snippets.forEach((snippet) => {
      console.log(`   ${snippet.slug}: ${snippet.snippet_category || 'null'} | ${JSON.stringify(snippet.tags || [])}`)
    })
  }
}

updateSnippetCategories()
