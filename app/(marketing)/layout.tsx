import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 h-16 bg-zinc-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform">
              V
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block text-white">VibeStack</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="text-zinc-400 hover:text-white transition-colors">
              기능
            </Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
              가격
            </Link>
            <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors">
              블로그
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                로그인
              </Link>
              <Link
                href="/sign-up"
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
              >
                무료로 시작하기
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
              >
                대시보드
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-white text-xs font-bold">
              V
            </div>
            <span className="text-zinc-500 text-sm font-medium">© 2024 VibeStack</span>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <Link href="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
