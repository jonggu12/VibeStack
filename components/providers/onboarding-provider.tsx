'use client'

import { StrategicOnboardingModal } from '@/components/onboarding/strategic-onboarding-modal'

/**
 * Onboarding Provider
 * Place this in the root layout to show strategic onboarding prompts
 * throughout the app based on user behavior
 */
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StrategicOnboardingModal />
    </>
  )
}
