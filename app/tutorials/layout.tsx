import { OnboardingProvider } from '@/components/providers/onboarding-provider'

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}
