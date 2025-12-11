// Content types
export type ContentType = 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface Content {
  id: string
  type: ContentType
  slug: string
  title: string
  description?: string
  content?: string
  difficulty?: DifficultyLevel
  estimatedTimeMinutes?: number
  priceCents: number
  isPremium: boolean
  status: ContentStatus

  // Bundle-specific fields (only used when type='bundle')
  discountPct?: number
  thumbnailUrl?: string

  createdAt: string
  updatedAt: string
}

// Bundle children relationship (replaces bundle_contents)
export interface ContentChild {
  id: string
  parentContentId: string  // parent content (type='bundle')
  contentId: string         // child content
  displayOrder: number
}
