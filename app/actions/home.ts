'use server'

import { createClient } from '@/lib/supabase/server'

export interface HomePageData {
  popularTutorials: Array<{
    id: string
    slug: string
    title: string
    description: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    estimatedTimeMins: number
    completions: number
    successRate: number
    stack: Record<string, string>
    isPremium: boolean
  }>
  quickStartDocs: Array<{
    id: string
    slug: string
    title: string
    description: string
    estimatedTimeMins: number
    views: number
    icon: string
  }>
  popularSnippets: Array<{
    id: string
    slug: string
    title: string
    description: string
    codePreview: string
    language: string
    copiedCount: number
    tags: string[]
  }>
}

/**
 * Fetch all data needed for the home page
 * Based on ERD: contents table with type filtering
 */
export async function getHomePageData(): Promise<HomePageData> {
  const supabase = await createClient()

  try {
    // 1. Get popular tutorials (type = 'tutorial', ordered by completions)
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('contents')
      .select(`
        id,
        slug,
        title,
        description,
        difficulty,
        estimated_time_mins,
        completion_count,
        avg_rating,
        stack,
        is_premium
      `)
      .eq('type', 'tutorial')
      .eq('status', 'published')
      .order('completion_count', { ascending: false })
      .limit(6)

    if (tutorialsError) {
      console.error('Error fetching tutorials:', tutorialsError)
    }

    // 2. Get quick start docs (type = 'doc', specific tags)
    const { data: docs, error: docsError } = await supabase
      .from('contents')
      .select(`
        id,
        slug,
        title,
        description,
        estimated_time_mins,
        views
      `)
      .eq('type', 'doc')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(6)

    if (docsError) {
      console.error('Error fetching docs:', docsError)
    }

    // 3. Get popular code snippets (type = 'snippet')
    const { data: snippets, error: snippetsError } = await supabase
      .from('contents')
      .select(`
        id,
        slug,
        title,
        description,
        content,
        views
      `)
      .eq('type', 'snippet')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(4)

    if (snippetsError) {
      console.error('Error fetching snippets:', snippetsError)
    }

    // Transform data to match component props
    const popularTutorials = (tutorials || []).map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description || '',
      difficulty: (t.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      estimatedTimeMins: t.estimated_time_mins || 0,
      completions: t.completion_count || 0,
      successRate: Math.round((t.avg_rating || 0) * 20), // Convert 1-5 rating to 0-100%
      stack: (t.stack as Record<string, string>) || {},
      isPremium: t.is_premium || false,
    }))

    const quickStartDocs = (docs || []).map((d) => {
      // Assign icons based on common doc types
      let icon = 'default'
      if (d.title.toLowerCase().includes('cursor')) icon = 'cursor'
      else if (d.title.toLowerCase().includes('프롬프트') || d.title.toLowerCase().includes('prompt')) icon = 'prompt'
      else if (d.title.toLowerCase().includes('에러') || d.title.toLowerCase().includes('error')) icon = 'error'

      return {
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description || '',
        estimatedTimeMins: d.estimated_time_mins || 5,
        views: d.views || 0,
        icon,
      }
    })

    const popularSnippets = (snippets || []).map((s) => {
      // Extract first 10 lines of code for preview
      const content = s.content || ''
      const lines = content.split('\n').slice(0, 10)
      const codePreview = lines.join('\n') + (content.split('\n').length > 10 ? '\n...' : '')

      // Detect language from content (simple heuristic)
      let language = 'typescript'
      if (content.includes('export default function')) language = 'tsx'
      else if (content.includes('const') || content.includes('function')) language = 'javascript'

      // Generate mock tags (in production, fetch from content_tags table)
      const tags = ['인증', '데이터베이스', 'UI'].slice(0, Math.floor(Math.random() * 3) + 1)

      return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        description: s.description || '',
        codePreview,
        language,
        copiedCount: s.views || 0, // Use views as proxy for copied count
        tags,
      }
    })

    return {
      popularTutorials,
      quickStartDocs,
      popularSnippets,
    }
  } catch (error) {
    console.error('Error in getHomePageData:', error)

    // Return empty data on error
    return {
      popularTutorials: [],
      quickStartDocs: [],
      popularSnippets: [],
    }
  }
}
