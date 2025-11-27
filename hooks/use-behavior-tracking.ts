'use client'

import { useCallback } from 'react'
import { trackBehavior, type BehaviorType } from '@/app/actions/behavior-tracking'

/**
 * Hook for tracking user behavior
 * Provides convenient methods for common tracking scenarios
 */
export function useBehaviorTracking() {
  const track = useCallback(async (behaviorType: BehaviorType, metadata?: Record<string, unknown>) => {
    try {
      await trackBehavior({ behaviorType, metadata })
    } catch (error) {
      console.error('Error tracking behavior:', error)
    }
  }, [])

  // Convenience methods for specific behaviors
  const trackContentView = useCallback(
    (contentId: string, contentType: 'doc' | 'tutorial' | 'snippet', contentTitle?: string) => {
      return track('content_view', {
        content_id: contentId,
        content_type: contentType,
        content_title: contentTitle,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackSearch = useCallback(
    (query: string, resultsCount?: number, filters?: Record<string, unknown>) => {
      return track('search_query', {
        query,
        results_count: resultsCount,
        filters,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackSnippetCopy = useCallback(
    (snippetId: string, snippetTitle?: string, language?: string) => {
      return track('snippet_copy', {
        snippet_id: snippetId,
        snippet_title: snippetTitle,
        language,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackTutorialStart = useCallback(
    (tutorialId: string, tutorialTitle?: string) => {
      return track('tutorial_start', {
        tutorial_id: tutorialId,
        tutorial_title: tutorialTitle,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackTutorialComplete = useCallback(
    (tutorialId: string, tutorialTitle?: string, timeSpentMins?: number) => {
      return track('tutorial_complete', {
        tutorial_id: tutorialId,
        tutorial_title: tutorialTitle,
        time_spent_mins: timeSpentMins,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackDocRead = useCallback(
    (docId: string, docTitle?: string, readingTimeMins?: number) => {
      return track('doc_read', {
        doc_id: docId,
        doc_title: docTitle,
        reading_time_mins: readingTimeMins,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  const trackErrorDiagnostic = useCallback(
    (errorPattern?: string, solutionFound?: boolean) => {
      return track('error_diagnostic', {
        error_pattern: errorPattern,
        solution_found: solutionFound,
        timestamp: new Date().toISOString(),
      })
    },
    [track]
  )

  return {
    track,
    trackContentView,
    trackSearch,
    trackSnippetCopy,
    trackTutorialStart,
    trackTutorialComplete,
    trackDocRead,
    trackErrorDiagnostic,
  }
}
