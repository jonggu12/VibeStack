'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, BookOpen, Code2, Clock, Eye, Star, Lock } from 'lucide-react'
import type { AlgoliaContentRecord } from '@/lib/algolia'

interface SearchResultsProps {
    results: AlgoliaContentRecord[]
    query: string
    isLoading?: boolean
    totalHits?: number
    processingTime?: number
}

const contentTypeConfig = {
    doc: { icon: FileText, label: '문서', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    tutorial: { icon: BookOpen, label: '튜토리얼', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    snippet: { icon: Code2, label: '스니펫', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    bundle: { icon: BookOpen, label: '번들', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    glossary: { icon: FileText, label: '용어사전', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
}

const difficultyConfig = {
    beginner: { label: '입문', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    intermediate: { label: '중급', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    advanced: { label: '고급', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
}

function formatNumber(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
}

function getContentUrl(content: AlgoliaContentRecord): string {
    switch (content.type) {
        case 'doc':
            return `/docs/${content.slug}`
        case 'tutorial':
            return `/tutorials/${content.slug}`
        case 'snippet':
            return `/snippets/${content.slug}`
        case 'bundle':
            return `/bundles/${content.slug}`
        case 'glossary':
            return `/docs/${content.slug}`
        default:
            return `/${content.type}/${content.slug}`
    }
}

export function SearchResults({
    results,
    query,
    isLoading = false,
    totalHits = 0,
    processingTime = 0,
}: SearchResultsProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-5 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 bg-muted rounded w-full" />
                            <div className="h-4 bg-muted rounded w-2/3 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!query) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>검색어를 입력하세요</p>
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">
                    &quot;{query}&quot;에 대한 검색 결과가 없습니다
                </p>
                <p className="text-sm text-muted-foreground">
                    다른 검색어를 시도하거나 필터를 조정해 보세요
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Results Summary */}
            <div className="text-sm text-muted-foreground">
                {totalHits}개의 결과 ({processingTime}ms)
            </div>

            {/* Results List */}
            <div className="space-y-3">
                {results.map((result) => {
                    const typeConfig = contentTypeConfig[result.type]
                    const diffConfig = difficultyConfig[result.difficulty]
                    const TypeIcon = typeConfig.icon

                    return (
                        <Link key={result.objectID} href={getContentUrl(result)}>
                            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={typeConfig.color}>
                                                <TypeIcon className="h-3 w-3 mr-1" />
                                                {typeConfig.label}
                                            </Badge>
                                            <Badge variant="outline" className={diffConfig.color}>
                                                {diffConfig.label}
                                            </Badge>
                                            {result.isPremium && (
                                                <Badge variant="secondary">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Pro
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-2">
                                        {result.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {result.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {/* Tags */}
                                    {result.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {result.tags.slice(0, 5).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {result.tags.length > 5 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{result.tags.length - 5}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        {result.estimatedTimeMins > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {result.estimatedTimeMins}분
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {formatNumber(result.views)}
                                        </span>
                                        {result.avgRating > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                {result.avgRating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
