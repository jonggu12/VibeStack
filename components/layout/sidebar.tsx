import Link from 'next/link'
import {
  Home,
  BookOpen,
  GraduationCap,
  Code2,
  FolderOpen,
  Settings,
  Search
} from 'lucide-react'

export function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Docs', href: '/docs', icon: BookOpen },
    { name: 'Tutorials', href: '/tutorials', icon: GraduationCap },
    { name: 'Snippets', href: '/snippets', icon: Code2 },
    { name: 'Library', href: '/library', icon: FolderOpen },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
