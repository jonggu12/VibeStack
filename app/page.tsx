import { supabaseAdmin } from '@/lib/supabase'
import { HomeClient } from './home-client'

interface Tutorial {
  id: string
  title: string
  slug: string
  description: string
  estimated_time_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export default async function HomePage() {
  let tutorials: Tutorial[] = []

  try {
    // Fetch published tutorials from database (using admin client to bypass RLS)
    const { data: tutorialsData, error } = await supabaseAdmin
      .from('contents')
      .select('id, title, slug, description, estimated_time_mins, difficulty')
      .eq('type', 'tutorial')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(12) // Get up to 12 tutorials for home page

    if (error) {
      console.error('Error fetching tutorials:', error)
      tutorials = []
    } else {
      // Transform to the format expected by the client component
      tutorials = (tutorialsData || []).map((tutorial: any) => ({
        id: tutorial.id,
        title: tutorial.title,
        slug: tutorial.slug,
        description: tutorial.description || '',
        estimated_time_minutes: tutorial.estimated_time_mins || 60,
        difficulty: tutorial.difficulty || 'beginner',
        tags: [], // tags column doesn't exist, use empty array
      }))
    }
  } catch (err) {
    console.error('Exception fetching tutorials:', err)
    tutorials = []
  }

  return <HomeClient tutorials={tutorials} />
}
