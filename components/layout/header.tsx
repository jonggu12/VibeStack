import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <nav className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          VibeStack
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/docs" className="text-gray-600 hover:text-gray-900">
            Docs
          </Link>
          <Link href="/tutorials" className="text-gray-600 hover:text-gray-900">
            Tutorials
          </Link>
          <Link href="/snippets" className="text-gray-600 hover:text-gray-900">
            Snippets
          </Link>
        </div>
      </nav>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  )
}
