import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in?redirect_url=/onboarding')
  }

  // Check if user has already completed onboarding
  const supabase = await createClient()
  const { data: dbUser } = await supabase
    .from('users')
    .select('onboarding_completed, onboarding_dismissed_at')
    .eq('clerk_user_id', user.id)
    .single()

  // If onboarding already completed, redirect to dashboard
  if (dbUser?.onboarding_completed) {
    redirect('/dashboard')
  }

  // If user dismissed onboarding within last 7 days, redirect to dashboard
  if (dbUser?.onboarding_dismissed_at) {
    const dismissed = new Date(dbUser.onboarding_dismissed_at)
    const daysSince = (Date.now() - dismissed.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince < 7) {
      redirect('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <OnboardingWizard />
    </main>
  )
}
