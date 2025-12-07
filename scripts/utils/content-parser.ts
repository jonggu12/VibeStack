export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈을 하나로
    .replace(/^-|-$/g, '') // 앞뒤 하이픈 제거
}

export interface ExtractedMetadata {
  title: string
  description: string
}

export interface GlossaryMetadata {
  category: string
  relatedTerms: string[]
  synonyms: string[]
  analogy: string
}

export function extractMetadata(content: string): ExtractedMetadata {
  // OpenAI가 코드 블록으로 감싸서 반환하는 경우 제거
  let cleanContent = content.trim()
  if (cleanContent.startsWith('```mdx') || cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```(mdx)?\n/, '').replace(/\n```$/, '')
  }

  // Frontmatter에서 메타데이터 추출
  const frontmatterMatch = cleanContent.match(/^---\n([\s\S]*?)\n---/)

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/)
    const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/)

    if (titleMatch && descMatch) {
      return {
        title: titleMatch[1],
        description: descMatch[1],
      }
    }
  }

  // Frontmatter가 없으면 본문에서 추출
  const titleMatch = cleanContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : '제목 없음'

  // 첫 번째 단락을 설명으로 사용
  const paragraphs = cleanContent
    .split('\n\n')
    .filter(p => !p.startsWith('#') && !p.startsWith('```') && p.trim().length > 0)

  const description = paragraphs[0]
    ? paragraphs[0].substring(0, 200).trim()
    : '설명 없음'

  return { title, description }
}

export function extractTags(content: string, defaultTags: string[] = []): string[] {
  const tags = new Set<string>(defaultTags)

  // 코드 블록에서 언어 추출
  const codeBlocks = content.match(/```(\w+)/g)
  if (codeBlocks) {
    codeBlocks.forEach(block => {
      const lang = block.replace('```', '')
      if (lang) tags.add(lang)
    })
  }

  // 기술 스택 키워드 추출
  const stackKeywords = [
    'Next.js',
    'React',
    'TypeScript',
    'JavaScript',
    'Supabase',
    'Clerk',
    'Stripe',
    'Tailwind',
    'Prisma',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Vercel',
  ]

  stackKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      tags.add(keyword.toLowerCase())
    }
  })

  return Array.from(tags)
}

export function stackToJson(stack: string[]): Record<string, string> {
  const stackMap: Record<string, string> = {}

  // 스택 배열을 카테고리별로 분류
  const categories: Record<string, string[]> = {
    framework: ['nextjs', 'next.js', 'react', 'vue', 'svelte'],
    auth: ['clerk', 'auth0', 'supabase-auth', 'nextauth'],
    database: ['supabase', 'prisma', 'mongodb', 'postgresql', 'mysql'],
    payment: ['stripe', 'paypal'],
    styling: ['tailwind', 'tailwindcss', 'shadcn', 'chakra'],
    deployment: ['vercel', 'netlify', 'aws'],
  }

  stack.forEach(item => {
    const normalized = item.toLowerCase()

    // 카테고리 찾기
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.includes(normalized)) {
        stackMap[category] = item
        return
      }
    }

    // 카테고리를 찾지 못하면 기타로
    stackMap['other'] = item
  })

  return stackMap
}

export function extractGlossaryMetadata(content: string): GlossaryMetadata {
  // OpenAI가 코드 블록으로 감싸서 반환하는 경우 제거
  let cleanContent = content.trim()
  if (cleanContent.startsWith('```mdx') || cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```(mdx)?\n/, '').replace(/\n```$/, '')
  }

  // Frontmatter에서 용어사전 전용 메타데이터 추출
  const frontmatterMatch = cleanContent.match(/^---\n([\s\S]*?)\n---/)

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]

    // term_category 추출
    const categoryMatch = frontmatter.match(/term_category:\s*["'](.+?)["']/)
    const category = categoryMatch ? categoryMatch[1] : '개념'

    // related_terms 추출 (배열)
    const relatedMatch = frontmatter.match(/related_terms:\s*\[([\s\S]*?)\]/)
    let relatedTerms: string[] = []
    if (relatedMatch) {
      relatedTerms = relatedMatch[1]
        .split(',')
        .map(term => term.trim().replace(/["']/g, ''))
        .filter(Boolean)
    }

    // synonyms 추출 (배열)
    const synonymsMatch = frontmatter.match(/synonyms:\s*\[([\s\S]*?)\]/)
    let synonyms: string[] = []
    if (synonymsMatch) {
      synonyms = synonymsMatch[1]
        .split(',')
        .map(term => term.trim().replace(/["']/g, ''))
        .filter(Boolean)
    }

    // analogy 추출
    const analogyMatch = frontmatter.match(/analogy:\s*["'](.+?)["']/s)
    const analogy = analogyMatch ? analogyMatch[1] : ''

    return {
      category,
      relatedTerms,
      synonyms,
      analogy,
    }
  }

  // Frontmatter가 없으면 기본값
  return {
    category: '개념',
    relatedTerms: [],
    synonyms: [],
    analogy: '',
  }
}
