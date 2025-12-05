'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, BookOpen, Code2, X } from 'lucide-react'

export interface SearchFiltersState {
    type?: 'doc' | 'tutorial' | 'snippet' | 'bundle' | 'glossary'
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    isPremium?: boolean
    tags?: string[]
}

interface SearchFiltersProps {
    filters: SearchFiltersState
    onChange: (filters: SearchFiltersState) => void
    availableTags?: string[]
}

const contentTypes = [
    { id: 'doc', label: '문서', icon: FileText },
    { id: 'tutorial', label: '튜토리얼', icon: BookOpen },
    { id: 'snippet', label: '스니펫', icon: Code2 },
] as const

const difficulties = [
    { id: 'beginner', label: '입문', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'intermediate', label: '중급', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { id: 'advanced', label: '고급', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
] as const

export function SearchFilters({ filters, onChange, availableTags = [] }: SearchFiltersProps) {
    const handleTypeChange = (type: 'doc' | 'tutorial' | 'snippet') => {
        onChange({
            ...filters,
            type: filters.type === type ? undefined : type,
        })
    }

    const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
        onChange({
            ...filters,
            difficulty: filters.difficulty === difficulty ? undefined : difficulty,
        })
    }

    const handlePremiumChange = (isPremium: boolean) => {
        onChange({
            ...filters,
            isPremium: filters.isPremium === isPremium ? undefined : isPremium,
        })
    }

    const handleTagToggle = (tag: string) => {
        const currentTags = filters.tags || []
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag]
        onChange({
            ...filters,
            tags: newTags.length > 0 ? newTags : undefined,
        })
    }

    const clearAllFilters = () => {
        onChange({})
    }

    const hasActiveFilters =
        filters.type || filters.difficulty || filters.isPremium !== undefined || (filters.tags && filters.tags.length > 0)

    return (
        <div className="space-y-4">
            {/* Content Type */}
            <div>
                <h4 className="text-sm font-medium mb-2">콘텐츠 유형</h4>
                <div className="flex flex-wrap gap-2">
                    {contentTypes.map(({ id, label, icon: Icon }) => (
                        <Button
                            key={id}
                            variant={filters.type === id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTypeChange(id)}
                            className="h-8"
                        >
                            <Icon className="h-3.5 w-3.5 mr-1.5" />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div>
                <h4 className="text-sm font-medium mb-2">난이도</h4>
                <div className="flex flex-wrap gap-2">
                    {difficulties.map(({ id, label, color }) => (
                        <Button
                            key={id}
                            variant={filters.difficulty === id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleDifficultyChange(id)}
                            className={`h-8 ${filters.difficulty === id ? '' : color}`}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Premium Filter */}
            <div>
                <h4 className="text-sm font-medium mb-2">접근 유형</h4>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={filters.isPremium === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePremiumChange(false)}
                        className="h-8"
                    >
                        무료
                    </Button>
                    <Button
                        variant={filters.isPremium === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePremiumChange(true)}
                        className="h-8"
                    >
                        프리미엄
                    </Button>
                </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2">태그</h4>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => handleTagToggle(tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground"
                >
                    <X className="h-4 w-4 mr-1" />
                    필터 초기화
                </Button>
            )}
        </div>
    )
}
