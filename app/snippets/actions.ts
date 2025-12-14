// Snippet 데이터 페칭 함수

import { supabaseAdmin } from '@/lib/supabase'

// 타입 정의
export interface Snippet {
  id: string
  slug: string
  title: string
  description: string | null
  stack: Record<string, any> | null
  code_snippet: string | null
  prompt_text: string | null
  snippet_language: string | null
  is_premium: boolean
  thumbnail_url?: string | null
  created_at?: string
}

// 모든 스니펫 가져오기
export async function getSnippets(): Promise<Snippet[]> {
  const { data: snippets, error } = await supabaseAdmin
    .from('contents')
    .select(`
      id,
      slug,
      title,
      description,
      stack,
      code_snippet,
      prompt_text,
      snippet_language,
      is_premium,
      thumbnail_url,
      created_at
    `)
    .eq('type', 'snippet')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching snippets:', error)
    return []
  }

  return (snippets || []) as Snippet[]
}

// 개별 스니펫 가져오기 (slug로)
export async function getSnippetBySlug(slug: string): Promise<Snippet | null> {
  const { data: snippet, error } = await supabaseAdmin
    .from('contents')
    .select(`
      id,
      slug,
      title,
      description,
      stack,
      code_snippet,
      prompt_text,
      snippet_language,
      is_premium,
      thumbnail_url,
      created_at
    `)
    .eq('type', 'snippet')
    .eq('status', 'published')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching snippet:', error)
    return null
  }

  return snippet as Snippet
}
