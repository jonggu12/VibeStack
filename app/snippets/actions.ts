// Snippet 데이터 페칭 함수

import { supabaseAdmin } from '@/lib/supabase'

// 타입 정의
export type SnippetCategory =
  | 'auth'
  | 'payment'
  | 'database'
  | 'storage'
  | 'email'
  | 'ui'
  | 'hooks'
  | 'api'
  | 'validation'
  | 'integration'

export interface Snippet {
  id: string
  slug: string
  title: string
  description: string | null
  snippet_category: SnippetCategory | null
  tags: string[] | null
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
      snippet_category,
      tags,
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
  // URL에서 오는 slug는 인코딩되어 있을 수 있으므로 디코딩
  const decodedSlug = decodeURIComponent(slug)

  const { data: snippet, error } = await supabaseAdmin
    .from('contents')
    .select(`
      id,
      slug,
      title,
      description,
      snippet_category,
      tags,
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
    .eq('slug', decodedSlug)
    .single()

  if (error) {
    console.error('Error fetching snippet:', error)
    return null
  }

  return snippet as Snippet
}
