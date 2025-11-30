'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileCode,
  MessageSquare,
  Settings,
  ExternalLink,
} from 'lucide-react'

const navigation = [
  {
    title: 'Overview',
    items: [
      { name: '대시보드', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: '사용자 관리', href: '/admin/users', icon: Users },
      { name: '결제 및 구독', href: '/admin/billing', icon: CreditCard },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: '콘텐츠 관리', href: '/admin/content', icon: FileCode },
      { name: '피드백 / 댓글', href: '/admin/feedback', icon: MessageSquare },
    ],
  },
  {
    title: 'System',
    items: [
      { name: '설정', href: '/admin/settings', icon: Settings },
      { name: '서비스로 이동', href: '/', icon: ExternalLink },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 fixed h-full z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 gap-3">
        <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-bold text-sm">
          V
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-2">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
          <div>
            <p className="text-sm font-bold text-white">Admin</p>
            <p className="text-xs text-zinc-500">Super User</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
