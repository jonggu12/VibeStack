/**
 * Authentication Utilities
 *
 * Reusable authentication helpers for server-side code.
 * These utilities provide consistent auth checks across the application.
 */

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin as checkIsAdmin, type ClerkPublicMetadata } from './clerk'

/**
 * User type with typed metadata
 */
export type AuthenticatedUser = Awaited<ReturnType<typeof currentUser>> & {
  publicMetadata: ClerkPublicMetadata
}

/**
 * Require authentication for a route/action
 * Redirects to sign-in if user is not authenticated
 *
 * @param redirectUrl - Optional URL to redirect to after sign-in
 * @returns The authenticated user
 *
 * @example
 * const user = await requireAuth()
 * console.log(user.email)
 */
export async function requireAuth(redirectUrl?: string): Promise<AuthenticatedUser> {
  const user = await currentUser()

  if (!user) {
    const signInUrl = redirectUrl
      ? `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`
      : '/sign-in'

    redirect(signInUrl)
  }

  return user as AuthenticatedUser
}

/**
 * Require admin role for a route/action
 * Redirects to home if user is not an admin
 *
 * @returns The authenticated admin user
 *
 * @example
 * const adminUser = await requireAdmin()
 * console.log(adminUser.publicMetadata.role) // 'admin'
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await currentUser()

  if (!checkIsAdmin(user)) {
    redirect('/')
  }

  return user as AuthenticatedUser
}

/**
 * Get current user with typed metadata (optional)
 * Returns null if user is not authenticated
 *
 * @returns The current user or null
 *
 * @example
 * const user = await getOptionalUser()
 * if (user) {
 *   console.log(user.email)
 * }
 */
export async function getOptionalUser(): Promise<AuthenticatedUser | null> {
  const user = await currentUser()

  if (!user) {
    return null
  }

  return user as AuthenticatedUser
}

/**
 * Check if current user is authenticated
 *
 * @returns True if user is authenticated
 *
 * @example
 * if (await isAuthenticated()) {
 *   // User is logged in
 * }
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await currentUser()
  return !!user
}

/**
 * Check if current user is an admin
 *
 * @returns True if user is an admin
 *
 * @example
 * if (await isAdmin()) {
 *   // User is admin
 * }
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  return checkIsAdmin(user)
}

/**
 * Error type for auth failures in server actions
 */
export type AuthError = {
  success: false
  error: 'UNAUTHORIZED' | 'FORBIDDEN'
  message: string
}

/**
 * Success type for server actions
 */
export type AuthSuccess<T> = {
  success: true
  data: T
}

/**
 * Combined result type for server actions
 */
export type AuthResult<T> = AuthSuccess<T> | AuthError

/**
 * Require auth for server actions (non-redirecting)
 * Returns an error instead of redirecting
 *
 * @returns AuthResult with user data or error
 *
 * @example
 * export async function myServerAction() {
 *   const authResult = await requireAuthAction()
 *   if (!authResult.success) {
 *     return authResult // Return error to client
 *   }
 *   const user = authResult.data
 *   // Continue with action...
 * }
 */
export async function requireAuthAction(): Promise<AuthResult<AuthenticatedUser>> {
  const user = await currentUser()

  if (!user) {
    return {
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required',
    }
  }

  return {
    success: true,
    data: user as AuthenticatedUser,
  }
}

/**
 * Require admin for server actions (non-redirecting)
 * Returns an error instead of redirecting
 *
 * @returns AuthResult with admin user data or error
 *
 * @example
 * export async function adminServerAction() {
 *   const authResult = await requireAdminAction()
 *   if (!authResult.success) {
 *     return authResult
 *   }
 *   const adminUser = authResult.data
 *   // Continue with admin action...
 * }
 */
export async function requireAdminAction(): Promise<AuthResult<AuthenticatedUser>> {
  const user = await currentUser()

  if (!user) {
    return {
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required',
    }
  }

  if (!checkIsAdmin(user)) {
    return {
      success: false,
      error: 'FORBIDDEN',
      message: 'Admin access required',
    }
  }

  return {
    success: true,
    data: user as AuthenticatedUser,
  }
}
