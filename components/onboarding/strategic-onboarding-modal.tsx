'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Search, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { shouldShowOnboardingPrompt, logOnboardingPromptShown, updateOnboardingPromptStatus } from '@/app/actions/behavior-tracking'

interface StrategicOnboardingModalProps {
  // Optional: Control from parent component
  isOpen?: boolean
  onClose?: () => void
}

// Trigger type별 메시지 정의
const TRIGGER_MESSAGES = {
  content_views: {
    icon: Sparkles,
    iconColor: 'text-blue-500',
    bgGradient: 'from-blue-500 to-purple-500',
    title: '관심사를 발견했어요! 🎯',
    description: '자주 보시는 주제를 기반으로 맞춤 추천을 제공해드릴 수 있어요.',
    benefits: [
      '딱 맞는 튜토리얼만 보기',
      '관심 스택 기반 추천',
      '학습 진행률 추적',
    ],
    ctaText: '맞춤 추천 받기',
    stats: '3개 이상의 콘텐츠를 보셨어요',
  },
  searches: {
    icon: Search,
    iconColor: 'text-green-500',
    bgGradient: 'from-green-500 to-teal-500',
    title: '찾으시는 게 많으시네요! 🔍',
    description: '검색 대신 맞춤 설정하면 원하는 콘텐츠를 바로 찾을 수 있어요.',
    benefits: [
      '검색 시간 단축',
      '선호하는 스택만 보기',
      '새 콘텐츠 자동 추천',
    ],
    ctaText: '맞춤 설정하기',
    stats: '3번 이상 검색하셨어요',
  },
  completion: {
    icon: CheckCircle,
    iconColor: 'text-yellow-500',
    bgGradient: 'from-yellow-500 to-orange-500',
    title: '첫 프로젝트 완성 축하드려요! 🎉',
    description: '다음 단계의 프로젝트를 추천해드릴까요?',
    benefits: [
      '레벨에 맞는 다음 과제',
      '학습 경로 자동 생성',
      '완성률 기반 추천',
    ],
    ctaText: '다음 프로젝트 보기',
    stats: '첫 튜토리얼을 완료하셨어요',
  },
} as const

export function StrategicOnboardingModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: StrategicOnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [triggerType, setTriggerType] = useState<'content_views' | 'searches' | 'completion'>('content_views')
  const [promptId, setPromptId] = useState<string | null>(null)
  const [contentViewCount, setContentViewCount] = useState(0)
  const [searchCount, setSearchCount] = useState(0)

  // Check if modal should be shown
  useEffect(() => {
    async function checkAndShow() {
      if (controlledIsOpen !== undefined) {
        // Controlled mode
        return
      }

      const result = await shouldShowOnboardingPrompt()

      if (result.shouldShow && result.triggerType) {
        setTriggerType(result.triggerType as typeof triggerType)
        setContentViewCount(result.contentViewCount || 0)
        setSearchCount(result.searchCount || 0)

        // Log that prompt was shown
        const logged = await logOnboardingPromptShown(result.triggerType)
        if (logged.success) {
          setIsOpen(true)
        }
      }
    }

    // Check after a short delay to not interrupt page load
    const timer = setTimeout(checkAndShow, 2000)
    return () => clearTimeout(timer)
  }, [controlledIsOpen])

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose()
    } else {
      setIsOpen(false)
    }

    // Mark as dismissed
    if (promptId) {
      updateOnboardingPromptStatus(promptId, 'dismissed')
    }
  }

  const handleCTAClick = () => {
    // Mark as clicked
    if (promptId) {
      updateOnboardingPromptStatus(promptId, 'clicked')
    }

    handleClose()
  }

  const message = TRIGGER_MESSAGES[triggerType]
  const Icon = message.icon

  const open = controlledIsOpen !== undefined ? controlledIsOpen : isOpen

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Animated icon */}
        <div className="flex justify-center pt-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${message.bgGradient} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold">
            {message.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        {/* Stats badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700">
            <span className="text-xl">📊</span>
            <span className="font-medium">{message.stats}</span>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-3 py-4">
          <p className="text-sm font-semibold text-gray-700">맞춤 추천의 장점:</p>
          <ul className="space-y-2">
            {message.benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${message.bgGradient}`} />
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link href="/onboarding" onClick={handleCTAClick}>
            <Button
              className={`w-full bg-gradient-to-r ${message.bgGradient} hover:opacity-90 text-white font-semibold`}
              size="lg"
            >
              {message.ctaText}
              <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            나중에 할게요
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-gray-500 pt-2">
          언제든지 설정에서 맞춤 추천을 받을 수 있어요
        </p>
      </DialogContent>
    </Dialog>
  )
}
