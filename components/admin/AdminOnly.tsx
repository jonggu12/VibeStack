'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Client component that only renders children if user is admin
 *
 * Usage:
 * <AdminOnly>
 *   <button>Delete All</button>
 * </AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return

      try {
        const response = await fetch('/api/auth/check-admin')
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }

    if (isLoaded) {
      checkAdmin()
    }
  }, [user, isLoaded])

  if (!isLoaded) {
    return null // Loading
  }

  if (!isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
