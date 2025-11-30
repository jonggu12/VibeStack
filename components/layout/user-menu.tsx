'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Sparkles,
  User,
  LogOut,
  Loader2,
} from 'lucide-react'

export function UserMenu() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    )
  }

  // If no user, return null
  if (!user) {
    return null
  }

  // Get user's initials for fallback
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="사용자 메뉴"
        >
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">
              {user.fullName || '사용자'}
            </p>
            <p className="text-xs leading-none text-zinc-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-800" />

        {/* Navigation Items */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>대시보드</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/projects" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>내 프로젝트</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/ai-chat" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI 채팅</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-800" />

        {/* Account Settings */}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white">
            <User className="mr-2 h-4 w-4" />
            <span>계정 관리</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-800" />

        {/* Sign Out */}
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-950/50 focus:bg-red-950/50 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
