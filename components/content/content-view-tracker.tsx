'use client'

import { useEffect } from 'react'
import { useBehaviorTracking } from '@/hooks/use-behavior-tracking'

interface ContentViewTrackerProps {
  contentId: string
  contentType: 'doc' | 'tutorial' | 'snippet'
  contentTitle: string
}

/**
 * Component to track content views
 * Place this in content detail pages to automatically track views
 */
export function ContentViewTracker({ contentId, contentType, contentTitle }: ContentViewTrackerProps) {
  const { trackContentView } = useBehaviorTracking()

  useEffect(() => {
    // Track view after 5 seconds (dwell time)
    const timer = setTimeout(() => {
      trackContentView(contentId, contentType, contentTitle)
    }, 5000)

    return () => clearTimeout(timer)
  }, [contentId, contentType, contentTitle, trackContentView])

  return null // This is a tracking-only component
}
