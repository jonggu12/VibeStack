import { Header } from '@/components/layout/header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header only - no sidebar */}
      <Header />

      {/* Full-width main content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
