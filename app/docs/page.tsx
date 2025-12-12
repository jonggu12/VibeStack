import { supabase } from '@/lib/supabase'
import { DocsClient } from './docs-client'

export type DocCategory = 'getting-started' | 'implementation' | 'prompts' | 'errors' | 'concepts'

export interface Doc {
  id: string
  title: string
  description: string
  slug: string
  difficulty: string
  estimatedTime: number
  category: DocCategory
  isPremium: boolean
  views: number
  // Glossary-specific fields (nullable)
  termCategory?: string | null
  relatedTerms?: string[] | null
  synonyms?: string[] | null
  analogy?: string | null
}

interface DocsPageProps {
  searchParams: { category?: string }
}

export default async function DocsPage({ searchParams }: DocsPageProps) {
  const selectedCategory = searchParams.category as DocCategory | undefined

  // Fetch all published docs
  const { data: docsData, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'doc')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching docs:', error)
  }

  // Transform to UI format
  const docs: Doc[] = (docsData || []).map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description || '',
    slug: doc.slug,
    difficulty: doc.difficulty || 'beginner',
    estimatedTime: doc.estimated_time_mins || 10,
    category: doc.category || 'concepts',
    isPremium: doc.is_premium || false,
    views: doc.views || 0,
    // Include glossary-specific fields if present
    termCategory: doc.term_category,
    relatedTerms: doc.related_terms,
    synonyms: doc.synonyms,
    analogy: doc.analogy,
  }))

  // Count by category
  const categoryCounts = {
    all: docs.length,
    'getting-started': docs.filter(d => d.category === 'getting-started').length,
    implementation: docs.filter(d => d.category === 'implementation').length,
    prompts: docs.filter(d => d.category === 'prompts').length,
    errors: docs.filter(d => d.category === 'errors').length,
    concepts: docs.filter(d => d.category === 'concepts').length,
  }

  return <DocsClient docs={docs} categoryCounts={categoryCounts} selectedCategory={selectedCategory} />
}
