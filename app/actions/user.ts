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
  banned: boolean
  ban_reason: string | null
  banned_at: string | null
  banned_by: string | null
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
    banned: data.banned || false,
    ban_reason: data.ban_reason || null,
    banned_at: data.banned_at || null,
    banned_by: data.banned_by || null,
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

/**
 * Toggle user ban status (Admin only)
 */
export async function toggleUserBan(
  userId: string,
  banReason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check admin permission and get admin user
    const admin = await requireAdmin()

    // Get current user status
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('banned')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' }
    }

    // Toggle ban status
    if (user.banned) {
      // Unban: Clear all ban-related fields
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          banned: false,
          ban_reason: null,
          banned_at: null,
          banned_by: null,
        })
        .eq('id', userId)

      if (updateError) {
        return { success: false, error: '정지 해제에 실패했습니다.' }
      }
    } else {
      // Ban: Set ban fields
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          banned: true,
          ban_reason: banReason || '관리자에 의해 정지됨',
          banned_at: new Date().toISOString(),
          banned_by: admin.id,
        })
        .eq('id', userId)

      if (updateError) {
        return { success: false, error: '계정 정지에 실패했습니다.' }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error toggling user ban:', error)
    return { success: false, error: '권한이 없습니다.' }
  }
}

/**
 * Toggle user role (Admin only)
 */
export async function toggleUserRole(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check admin permission
    await requireAdmin()

    // Get current user role
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' }
    }

    // Toggle role
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: '권한 변경에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error toggling user role:', error)
    return { success: false, error: '권한이 없습니다.' }
  }
}
