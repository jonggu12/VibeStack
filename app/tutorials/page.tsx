import { supabase } from '@/lib/supabase'
import { TutorialsClient } from './tutorials-client'

export default async function TutorialsPage() {
  // Fetch tutorials from database
  const { data: tutorialsData, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'tutorial')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching tutorials:', error)
  }

  // Transform to UI format
  const tutorials = (tutorialsData || []).map((tutorial: any) => {
    return {
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description || tutorial.excerpt || '',
      slug: tutorial.slug,
      estimatedTime: tutorial.estimated_time_minutes || 60,
      difficulty: tutorial.difficulty || 'beginner',
      successRate: 94, // TODO: Calculate from ratings
      completedCount: tutorial.views || 0,
      tags: tutorial.tags || [],
      isPremium: tutorial.is_premium || false,
      gradient: getGradientForTutorial(tutorial.slug, tutorial.tags || []),
    }
  })

  return <TutorialsClient tutorials={tutorials} />
}

// Helper to determine gradient based on tutorial type
function getGradientForTutorial(slug: string, tags: string[]): string {
  if (slug.includes('todo') || slug.includes('saas')) return 'from-indigo-900/40 to-purple-900/40'
  if (slug.includes('landing') || slug.includes('email')) return 'from-emerald-900/40 to-teal-900/40'
  if (slug.includes('blog') || slug.includes('portfolio')) return 'from-orange-900/40 to-red-900/40'
  if (slug.includes('ai') || slug.includes('chatbot')) return 'from-sky-600 to-blue-700'
  if (slug.includes('commerce') || slug.includes('shop')) return 'from-pink-900/40 to-purple-900/40'
  return 'from-zinc-800 to-zinc-900'
}
