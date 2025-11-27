import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in?redirect_url=/onboarding')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <OnboardingWizard />
    </main>
  )
}
