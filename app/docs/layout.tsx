import { OnboardingProvider } from '@/components/providers/onboarding-provider'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}
