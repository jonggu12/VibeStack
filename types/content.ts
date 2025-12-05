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
  createdAt: string
  updatedAt: string
}
