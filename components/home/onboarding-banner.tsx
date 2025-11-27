'use client'

import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OnboardingBannerProps {
  userId?: string
  onDismiss?: () => void
}

export function OnboardingBanner({ userId, onDismiss }: OnboardingBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem(`onboarding-banner-dismissed-${userId}`)
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [userId])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    if (userId) {
      localStorage.setItem(`onboarding-banner-dismissed-${userId}`, 'true')
    }
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Message */}
              <div className="flex items-center gap-3 flex-1">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    💡 3분만 투자하면 맞춤 추천을 받을 수 있어요
                  </p>
                  <p className="text-xs sm:text-sm text-white/90 mt-1">
                    프로젝트 타입과 사용할 스택을 선택하면, 딱 맞는 튜토리얼을 추천해드립니다
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/onboarding">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
                  >
                    맞춤 추천 받기
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 whitespace-nowrap hidden sm:inline-flex"
                >
                  나중에
                </Button>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="배너 닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
