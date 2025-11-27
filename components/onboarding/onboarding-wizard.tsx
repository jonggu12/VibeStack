'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ProjectTypeSelection, type ProjectType } from './project-type-selection'
import { StackSelection, type StackPreferences } from './stack-selection'
import { StackPresetSelection, type StackPreset } from './stack-preset-selection'
import { completeOnboarding, skipOnboarding } from '@/app/actions/onboarding'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 1 | 2 | 3

const STEPS = {
  PROJECT_TYPE: 1 as const,
  STACK_SELECTION: 2 as const,
  STACK_PRESET: 3 as const,
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.PROJECT_TYPE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // User selections
  const [projectType, setProjectType] = useState<ProjectType>()
  const [stackPreferences, setStackPreferences] = useState<StackPreferences>({})
  const [stackPreset, setStackPreset] = useState<StackPreset>()

  const progress = (currentStep / 3) * 100

  const handleStackSelect = (category: keyof StackPreferences, value: string) => {
    setStackPreferences((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.PROJECT_TYPE:
        return !!projectType
      case STEPS.STACK_SELECTION:
        return Object.keys(stackPreferences).length > 0
      case STEPS.STACK_PRESET:
        return !!stackPreset
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSkip = async () => {
    const result = await skipOnboarding()
    if (result.success) {
      toast.success('나중에 설정에서 맞춤 추천을 받을 수 있어요')
      router.push('/dashboard')
    } else {
      toast.error('오류가 발생했습니다')
    }
  }

  const handleComplete = async () => {
    if (!projectType || !stackPreset) {
      toast.error('필수 항목을 선택해주세요')
      return
    }

    setIsSubmitting(true)

    // Apply preset if selected
    let finalStackPreferences = stackPreferences
    if (stackPreset === 'saas-kit') {
      finalStackPreferences = {
        framework: 'nextjs',
        auth: 'clerk',
        database: 'supabase',
        hosting: 'vercel',
        styling: 'shadcn',
        payments: 'stripe',
      }
    } else if (stackPreset === 'ecommerce') {
      finalStackPreferences = {
        framework: 'nextjs',
        auth: 'clerk',
        database: 'supabase',
        hosting: 'vercel',
        styling: 'shadcn',
        payments: 'toss',
      }
    }

    const result = await completeOnboarding({
      projectType,
      stackPreferences: finalStackPreferences,
      stackPreset,
    })

    setIsSubmitting(false)

    if (result.success) {
      toast.success('맞춤 추천이 설정되었습니다! 🎉')
      router.push('/dashboard')
    } else {
      toast.error(result.error || '오류가 발생했습니다')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                맞춤 추천 설정
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentStep === STEPS.PROJECT_TYPE && '프로젝트 유형을 선택해주세요'}
                {currentStep === STEPS.STACK_SELECTION && '선호하는 스택을 선택해주세요'}
                {currentStep === STEPS.STACK_PRESET && '시작 템플릿을 선택해주세요'}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isSubmitting}
            >
              나중에 하기
            </Button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>단계 {currentStep} / 3</span>
              <span>{Math.round(progress)}% 완료</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === STEPS.PROJECT_TYPE && (
                <ProjectTypeSelection
                  selected={projectType}
                  onSelect={setProjectType}
                />
              )}

              {currentStep === STEPS.STACK_SELECTION && (
                <StackSelection
                  selected={stackPreferences}
                  onSelect={handleStackSelect}
                />
              )}

              {currentStep === STEPS.STACK_PRESET && (
                <StackPresetSelection
                  selected={stackPreset}
                  onSelect={setStackPreset}
                  userSelectedStack={Object.keys(stackPreferences).length > 0 ? stackPreferences : undefined}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="bg-white border-t sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
              >
                다음
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              >
                {isSubmitting ? (
                  '저장 중...'
                ) : (
                  <>
                    완료
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
