'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking'

interface CopyButtonWithTrackingProps {
  code: string
  snippetId?: string
  snippetTitle?: string
  language?: string
  className?: string
}

/**
 * Copy button with automatic behavior tracking
 * Tracks when users copy code snippets
 */
export function CopyButtonWithTracking({
  code,
  snippetId,
  snippetTitle,
  language,
  className = '',
}: CopyButtonWithTrackingProps) {
  const [copied, setCopied] = useState(false)
  const { trackSnippetCopy } = useBehaviorTracking()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)

      // Track snippet copy behavior
      if (snippetId) {
        await trackSnippetCopy(snippetId, snippetTitle, language)
      }

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Button
      size="sm"
      variant={copied ? 'default' : 'outline'}
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          복사됨!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          복사
        </>
      )}
    </Button>
  )
}
