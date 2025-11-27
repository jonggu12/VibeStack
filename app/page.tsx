import { currentUser } from '@clerk/nextjs/server'
import { HeroSection } from '@/components/home/hero-section'
import { OnboardingBanner } from '@/components/home/onboarding-banner'
import { PopularTutorials } from '@/components/home/popular-tutorials'
import { QuickStartDocs } from '@/components/home/quick-start-docs'
import { CodeSnippetsPreview } from '@/components/home/code-snippets-preview'
import { TrustSection } from '@/components/home/trust-section'
import { getHomePageData } from '@/app/actions/home'

export default async function Home() {
  const user = await currentUser()
  const { popularTutorials, quickStartDocs, popularSnippets } = await getHomePageData()

  return (
    <main className="min-h-screen">
      {/* Dismissable onboarding banner (only for logged-in users) */}
      {user && <OnboardingBanner userId={user.id} />}

      {/* Hero section with animated background */}
      <HeroSection />

      {/* Popular tutorials section */}
      {popularTutorials.length > 0 && (
        <PopularTutorials tutorials={popularTutorials} />
      )}

      {/* Quick start docs */}
      {quickStartDocs.length > 0 && (
        <QuickStartDocs docs={quickStartDocs} />
      )}

      {/* Code snippets preview */}
      {popularSnippets.length > 0 && (
        <CodeSnippetsPreview snippets={popularSnippets} />
      )}

      {/* Trust indicators & testimonials */}
      <TrustSection />

      {/* TODO: Add pricing CTA section */}
      {/* TODO: Add FAQ section */}
      {/* TODO: Add footer */}
    </main>
  )
}
