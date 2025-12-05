'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectTypeSelection, type ProjectType } from './project-type-selection'
import { ExperienceLevelSelection, type ExperienceLevel } from './experience-level-selection'
import { StackSelection, type StackPreferences } from './stack-selection'
import { PainPointSelection, type PainPoint } from './pain-point-selection'
import { StackPresetSelection, type StackPreset } from './stack-preset-selection'
import { completeOnboarding, skipOnboarding } from '@/app/actions/onboarding'
import { toast } from 'sonner'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 1 | 2 | 3 | 4 | 5

const STEPS = {
  PROJECT_TYPE: 1 as const,
  EXPERIENCE_LEVEL: 2 as const,
  STACK_SELECTION: 3 as const,
  PAIN_POINTS: 4 as const,
  STACK_PRESET: 5 as const,
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(STEPS.PROJECT_TYPE)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // User selections
  const [projectType, setProjectType] = useState<ProjectType>()
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>()
  const [stackPreferences, setStackPreferences] = useState<StackPreferences>({})
  const [painPoints, setPainPoints] = useState<PainPoint[]>([])
  const [stackPreset, setStackPreset] = useState<StackPreset>()

  const progress = (currentStep / 5) * 100

  const handleStackToggle = (feature: keyof StackPreferences) => {
    setStackPreferences((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const handlePainPointToggle = (painPoint: PainPoint) => {
    setPainPoints((prev) => {
      if (prev.includes(painPoint)) {
        return prev.filter((p) => p !== painPoint)
      } else {
        return [...prev, painPoint]
      }
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.PROJECT_TYPE:
        return !!projectType
      case STEPS.EXPERIENCE_LEVEL:
        return !!experienceLevel
      case STEPS.STACK_SELECTION:
        return Object.keys(stackPreferences).length > 0
      case STEPS.PAIN_POINTS:
        return painPoints.length > 0
      case STEPS.STACK_PRESET:
        return !!stackPreset
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
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
    if (!projectType || !experienceLevel || !stackPreset) {
      toast.error('필수 항목을 선택해주세요')
      return
    }

    setIsSubmitting(true)

    const result = await completeOnboarding({
      projectType,
      experienceLevel,
      stackPreferences,
      painPoints,
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-zinc-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="absolute top-8 left-0 w-full px-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg">
            V
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">VibeStack</span>
        </div>
        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="text-zinc-500 hover:text-white text-sm transition-colors"
        >
          <X className="w-4 h-4 inline mr-1" />
          나가기
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentStep === STEPS.PROJECT_TYPE && (
              <ProjectTypeSelection
                selected={projectType}
                onSelect={setProjectType}
              />
            )}

            {currentStep === STEPS.EXPERIENCE_LEVEL && (
              <ExperienceLevelSelection
                selected={experienceLevel}
                onSelect={setExperienceLevel}
              />
            )}

            {currentStep === STEPS.STACK_SELECTION && (
              <StackSelection
                selected={stackPreferences}
                onToggle={handleStackToggle}
              />
            )}

            {currentStep === STEPS.PAIN_POINTS && (
              <PainPointSelection
                selected={painPoints}
                onToggle={handlePainPointToggle}
              />
            )}

            {currentStep === STEPS.STACK_PRESET && (
              <StackPresetSelection
                selected={stackPreset}
                onSelect={setStackPreset}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="text-zinc-400 hover:text-white font-medium py-3 px-6 transition-colors"
            >
              뒤로가기
            </button>
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="bg-white text-black font-bold py-3 px-12 rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-white/10"
            >
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || isSubmitting}
              className="bg-white text-black font-bold py-3 px-12 rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-white/10"
            >
              {isSubmitting ? '저장 중...' : '완료'}
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
