import { supabase } from '@/lib/supabase'
import { GuidesClient } from './guides-client'

// Helper to determine category from tags
const getCategoryFromTags = (tags: string[]): string => {
  if (tags.some(t => ['cursor', 'nextjs', 'react'].includes(t))) return 'getting-started'
  if (tags.some(t => ['clerk', 'supabase', 'stripe', 'database'].includes(t))) return 'development'
  if (tags.some(t => ['troubleshooting', 'error', 'debug'].includes(t))) return 'error-solving'
  if (tags.some(t => ['vercel', 'deploy', 'hosting'].includes(t))) return 'deployment'
  return 'development'
}

// Helper to get icon based on slug/tags (returns icon name instead of component)
const getIconForGuide = (slug: string, tags: string[]) => {
  if (slug.includes('cursor') || tags.includes('cursor')) return { iconName: 'FaCode', gradient: 'gradient-1' }
  if (slug.includes('prompt') || tags.includes('ai')) return { iconName: 'FaBolt', gradient: 'gradient-1' }
  if (slug.includes('nextjs') || tags.includes('nextjs')) return { iconName: 'FaReact', gradient: 'gradient-1' }
  if (slug.includes('clerk') || tags.includes('clerk')) return { iconName: 'FaLock', gradient: 'gradient-2' }
  if (slug.includes('supabase') || tags.includes('supabase')) return { iconName: 'FaDb', gradient: 'gradient-2' }
  if (slug.includes('환경변수') || slug.includes('env')) return { iconName: 'FaCog', gradient: 'gradient-2' }
  if (slug.includes('module') || slug.includes('not-found')) return { iconName: 'FaExclamationTriangle', gradient: 'gradient-4' }
  if (slug.includes('hydration')) return { iconName: 'FaSyncAlt', gradient: 'gradient-4' }
  if (slug.includes('404') || slug.includes('deployment')) return { iconName: 'FaTimesCircle', gradient: 'gradient-4' }
  return { iconName: 'FaCode', gradient: 'gradient-1' }
}

export default async function GuidesPage() {
  // Fetch docs from database
  const { data: docsData, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'doc')
    .eq('status', 'published')
    .order('views', { ascending: false })

  if (error) {
    console.error('Error fetching docs:', error)
  }

  // Transform to UI format
  const guides = (docsData || []).map((doc: any) => {
    const tags = doc.tags || []
    const category = getCategoryFromTags(tags)
    const iconData = getIconForGuide(doc.slug, tags)

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description || doc.excerpt || '',
      slug: doc.slug,
      category,
      iconName: iconData.iconName,
      gradient: iconData.gradient,
      readTime: doc.estimated_time_minutes || 5,
      views: doc.views || 0,
      tags,
    }
  })

  // Group by category
  const gettingStarted = guides.filter(g => g.category === 'getting-started')
  const development = guides.filter(g => g.category === 'development')
  const errorSolving = guides.filter(g => g.category === 'error-solving')
  const deployment = guides.filter(g => g.category === 'deployment')

  return (
    <GuidesClient
      gettingStarted={gettingStarted}
      development={development}
      errorSolving={errorSolving}
      deployment={deployment}
    />
  )
}
