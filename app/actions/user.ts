'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export type UserRole = 'user' | 'admin'

export interface CurrentUser {
  id: string
  email: string
  name: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
}

/**
 * Get current authenticated user with role
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // Get Clerk user ID
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    return null
  }

  // Get user from database (use admin client to bypass RLS)
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (error || !data) {
    console.error('Error fetching current user:', error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as UserRole,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

/**
 * Require admin role (throws error if not admin)
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized: User not authenticated')
  }

  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin role required')
  }

  return user
}
