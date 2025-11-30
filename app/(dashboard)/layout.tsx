import { Header } from '@/components/layout/header'
import { OnboardingProvider } from '@/components/providers/onboarding-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        {children}
      </div>
    </OnboardingProvider>
  )
}
