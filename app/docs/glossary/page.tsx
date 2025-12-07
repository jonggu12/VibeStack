import { supabase } from '@/lib/supabase'
import { Content } from '@/types/content'
import { GlossaryClient } from './glossary-client'

// Icon mapping helper (returns icon name instead of component)
const getIconForTerm = (slug: string) => {
  const iconMap: Record<string, any> = {
    'api': { iconName: 'FaPlug', color: 'text-blue-400' },
    '웹훅-webhook': { iconName: 'FaBell', color: 'text-yellow-400' },
    'webhook': { iconName: 'FaBell', color: 'text-yellow-400' },
    '데이터베이스': { iconName: 'FaDatabase', color: 'text-emerald-400' },
    'database': { iconName: 'FaDatabase', color: 'text-emerald-400' },
    '컴포넌트': { iconName: 'FaCube', color: 'text-indigo-400' },
    'component': { iconName: 'FaCube', color: 'text-indigo-400' },
    '환경변수': { iconName: 'FaKey', color: 'text-orange-400' },
    'env': { iconName: 'FaKey', color: 'text-orange-400' },
    'ssr-vs-csr': { iconName: 'FaBolt', color: 'text-purple-400' },
    '빌드-build': { iconName: 'FaHammer', color: 'text-zinc-400' },
    'build': { iconName: 'FaHammer', color: 'text-zinc-400' },
    '배포-deploy': { iconName: 'FaRocket', color: 'text-pink-400' },
    'deploy': { iconName: 'FaRocket', color: 'text-pink-400' },
    'cors': { iconName: 'FaShieldAlt', color: 'text-red-400' },
    'npm': { iconName: 'FaBox', color: 'text-cyan-400' },
  }

  return iconMap[slug] || { iconName: 'FaPlug', color: 'text-zinc-400' }
}

// Category helper
const getCategoryForTags = (tags: string[]): string => {
  if (tags.some(t => ['basic', 'concept'].includes(t))) return 'basic'
  if (tags.some(t => ['nextjs', 'react', 'next.js'].includes(t))) return 'nextjs'
  if (tags.some(t => ['tools', 'nodejs', 'cursor'].includes(t))) return 'tools'
  if (tags.some(t => ['error', 'troubleshooting', 'debug'].includes(t))) return 'error'
  return 'basic'
}

export default async function GlossaryPage() {
  // Fetch glossary terms from database
  const { data: glossaryData, error } = await supabase
    .from('contents')
    .select('*')
    .eq('type', 'glossary')
    .eq('status', 'published')
    .order('views', { ascending: false })

  if (error) {
    console.error('Error fetching glossary:', error)
  }

  // Transform DB data to match UI format
  const glossaryTerms = (glossaryData || []).map((item: any, index: number) => {
    const tags = item.tags || []
    const iconData = getIconForTerm(item.slug)

    return {
      id: index + 1,
      dbId: item.id,
      title: item.title,
      subtitle: `${item.title}이/가 뭐예요?`,
      analogy: item.analogy || '개념 설명',
      description: item.description || item.excerpt || '',
      category: getCategoryForTags(tags),
      slug: item.slug,
      views: item.views || 0,
      readTime: item.estimated_time_minutes || 2,
      iconName: iconData.iconName,
      iconColor: iconData.color,
    }
  })

  const categories = [
    { id: 'all', name: '전체', count: glossaryTerms.length, color: 'white' },
    { id: 'basic', name: '기본 개념', count: glossaryTerms.filter(t => t.category === 'basic').length, color: 'indigo' },
    { id: 'nextjs', name: 'Next.js 용어', count: glossaryTerms.filter(t => t.category === 'nextjs').length, color: 'blue' },
    { id: 'tools', name: '개발 도구', count: glossaryTerms.filter(t => t.category === 'tools').length, color: 'emerald' },
    { id: 'error', name: '에러 용어', count: glossaryTerms.filter(t => t.category === 'error').length, color: 'red' },
  ]

  // Popular terms (top 5 by views)
  const popularTerms = [...glossaryTerms]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  return (
    <GlossaryClient
      glossaryTerms={glossaryTerms}
      categories={categories}
      popularTerms={popularTerms}
    />
  )
}
