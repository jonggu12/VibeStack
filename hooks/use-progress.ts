'use client'

// Hook for progress tracking
export function useProgress(contentId: string) {
  // TODO: Implement
  return {
    progress: 0,
    isLoading: false,
    updateProgress: (progress: number) => {},
  }
}
