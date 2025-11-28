import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { OnboardingProvider } from '@/components/providers/onboarding-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Clerk UserButton */}
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </OnboardingProvider>
  )
}
