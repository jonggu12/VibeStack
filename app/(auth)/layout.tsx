import { Suspense } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/routes'

/**
 * Loading fallback for auth pages
 */
function AuthLoading() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Loading...</p>
        </div>
    )
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header with Logo */}
            <header className="absolute top-0 left-0 right-0 px-6 py-4">
                <Link
                    href={ROUTES.HOME}
                    className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    VibeStack
                </Link>
            </header>

            {/* Main Content with Loading State */}
            <main className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<AuthLoading />}>
                    {children}
                </Suspense>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-gray-600">
                <p>
                    © 2024 VibeStack. AI-era developer learning platform.
                </p>
            </footer>
        </div>
    )
}
