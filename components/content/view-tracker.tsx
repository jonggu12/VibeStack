'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

interface ViewTrackerProps {
    contentId: string
}

export function ViewTracker({ contentId }: ViewTrackerProps) {
    const [tracked, setTracked] = useState(false)

    useEffect(() => {
        // 쿠키 키: viewed_content_{contentId}
        const cookieKey = `viewed_${contentId}`

        // 이미 본 콘텐츠인지 확인
        const alreadyViewed = Cookies.get(cookieKey)

        if (alreadyViewed) {
            console.log('[ViewTracker] Already viewed within 24h, skipping...')
            return
        }

        // 5초 후 조회수 증가
        const timer = setTimeout(async () => {
            try {
                // 서버 액션 호출
                const response = await fetch('/api/content/track-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contentId }),
                })

                if (response.ok) {
                    // 24시간 동안 쿠키 설정
                    Cookies.set(cookieKey, '1', { expires: 1 }) // 1 = 1 day
                    setTracked(true)
                    console.log('[ViewTracker] View counted!')
                }
            } catch (error) {
                console.error('[ViewTracker] Failed to track view:', error)
            }
        }, 5000) // 5초 대기

        // 컴포넌트 언마운트 시 타이머 정리
        return () => clearTimeout(timer)
    }, [contentId])

    // UI 렌더링 없음 (추적만 함)
    return null
}
