import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { requireAdmin } from '@/app/actions/user'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin access
  try {
    await requireAdmin()
  } catch (error) {
    // Not admin - redirect to home
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 min-w-0">
        {children}
      </main>
    </div>
  )
}
