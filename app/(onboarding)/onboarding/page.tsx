import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in?redirect_url=/onboarding')
  }

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <OnboardingWizard />
    </main>
  )
}
