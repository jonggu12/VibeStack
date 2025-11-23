'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchBarProps {
    onSearch?: (query: string) => void
    placeholder?: string
    autoFocus?: boolean
    showInstantResults?: boolean
}

export function SearchBar({
    onSearch,
    placeholder = '검색어를 입력하세요...',
    autoFocus = false,
    showInstantResults = false,
}: SearchBarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)

    const initialQuery = searchParams.get('q') || ''
    const [query, setQuery] = useState(initialQuery)
    const [isSearching, setIsSearching] = useState(false)
    const [hasUserTyped, setHasUserTyped] = useState(false)

    const debouncedQuery = useDebounce(query, 300)

    // Instant search callback - 유저가 타이핑한 경우에만 실행
    useEffect(() => {
        if (showInstantResults && onSearch && hasUserTyped && debouncedQuery.trim()) {
            onSearch(debouncedQuery)
        }
    }, [debouncedQuery, showInstantResults, onSearch, hasUserTyped])

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault()
            if (!query.trim()) return

            setIsSearching(true)

            if (onSearch) {
                onSearch(query)
                setIsSearching(false)
            } else {
                // Navigate to search page
                router.push(`/search?q=${encodeURIComponent(query)}`)
            }
        },
        [query, onSearch, router]
    )

    const handleClear = useCallback(() => {
        setQuery('')
        inputRef.current?.focus()
        if (onSearch) {
            onSearch('')
        }
    }, [onSearch])

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value)
                        setHasUserTyped(true)
                    }}
                    placeholder={placeholder}
                    className="pl-10 pr-20"
                    autoFocus={autoFocus}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isSearching || !query.trim()}
                        className="h-7"
                    >
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            '검색'
                        )}
                    </Button>
                </div>
            </div>
            <div className="absolute right-24 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                    {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">K</kbd>
            </div>
        </form>
    )
}
