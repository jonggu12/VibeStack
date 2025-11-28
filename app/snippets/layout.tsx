import { OnboardingProvider } from '@/components/providers/onboarding-provider'

export default function SnippetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}
