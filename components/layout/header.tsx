'use client'

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signInButtonConfig } from '@/lib/clerk'
import { UserMenu } from './user-menu'
import { Bell, Search } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 transition-all duration-300 bg-zinc-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg group-hover:rotate-3 transition-transform">
            V
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block text-white">VibeStack</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
            placeholder="대시보드 검색 (프로젝트, 저장된 스니펫)"
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">⌘K</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-6 w-px bg-zinc-800"></div>

          {/* User Menu */}
          <SignedIn>
            <UserMenu />
          </SignedIn>
          <SignedOut>
            <SignInButton {...signInButtonConfig}>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="border-t border-zinc-800/50 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-8 overflow-x-auto">
          <Link
            href="/dashboard"
            className={`text-sm font-medium h-full flex items-center transition-colors ${
              pathname === '/dashboard'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            개요
          </Link>
          <Link
            href="/projects"
            className={`text-sm font-medium h-full flex items-center transition-colors ${
              pathname === '/projects'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            내 프로젝트 <span className="ml-1.5 text-[10px] bg-zinc-800 px-1.5 rounded-full text-zinc-400">3</span>
          </Link>
          <Link
            href="/saved"
            className={`text-sm font-medium h-full flex items-center transition-colors ${
              pathname === '/saved'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            저장됨 <span className="ml-1.5 text-[10px] bg-zinc-800 px-1.5 rounded-full text-zinc-400">12</span>
          </Link>
          <Link
            href="/settings"
            className={`text-sm font-medium h-full flex items-center transition-colors ${
              pathname === '/settings'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            설정
          </Link>
        </div>
      </div>
    </header>
  )
}
