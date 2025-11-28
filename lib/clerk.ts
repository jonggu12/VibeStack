/**
 * Clerk Authentication Configuration
 *
 * Centralized configuration for Clerk components used across the application.
 * This ensures consistent styling and behavior for all auth-related UI.
 */

import { Theme } from '@clerk/types'
import { ROUTES } from './routes'

/**
 * Shared appearance configuration for Clerk components
 * Matches the VibeStack design system
 */
export const clerkAppearance = {
  elements: {
    // Base styles
    formButtonPrimary:
      'bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors',

    // Card styles
    card: 'shadow-lg border border-gray-200',

    // Header styles
    headerTitle: 'text-2xl font-bold text-gray-900',
    headerSubtitle: 'text-gray-600',

    // Form field styles
    formFieldLabel: 'text-sm font-medium text-gray-700',
    formFieldInput:
      'border-gray-300 focus:border-blue-500 focus:ring-blue-500',

    // Footer styles
    footerActionLink: 'text-blue-600 hover:text-blue-700',

    // Avatar styles (for UserButton)
    avatarBox: 'w-10 h-10',

    // Social button styles
    socialButtonsBlockButton:
      'border border-gray-300 hover:bg-gray-50 text-gray-700',
  },
  layout: {
    socialButtonsPlacement: 'bottom' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
}

/**
 * SignIn component configuration
 */
export const signInConfig = {
  appearance: clerkAppearance,
  routing: 'path' as const,
  path: ROUTES.SIGN_IN,
  signUpUrl: ROUTES.SIGN_UP,
  redirectUrl: ROUTES.DASHBOARD,
  afterSignInUrl: ROUTES.DASHBOARD,
  afterSignUpUrl: ROUTES.ONBOARDING,
}

/**
 * SignUp component configuration
 */
export const signUpConfig = {
  appearance: clerkAppearance,
  routing: 'path' as const,
  path: ROUTES.SIGN_UP,
  signInUrl: ROUTES.SIGN_IN,
  redirectUrl: ROUTES.ONBOARDING,
  afterSignInUrl: ROUTES.DASHBOARD,
  afterSignUpUrl: ROUTES.ONBOARDING,
}

/**
 * UserButton component configuration
 */
export const userButtonConfig = {
  appearance: clerkAppearance,
  afterSignOutUrl: ROUTES.HOME,
  showName: false,
  // Custom menu items can be added here
  userProfileMode: 'modal' as const,
  userProfileUrl: undefined,
}

/**
 * SignInButton configuration (for marketing pages)
 */
export const signInButtonConfig = {
  mode: 'modal' as const,
  redirectUrl: ROUTES.DASHBOARD,
  afterSignInUrl: ROUTES.DASHBOARD,
  afterSignUpUrl: ROUTES.ONBOARDING,
}

/**
 * Admin role check helper
 * Used to verify if a user has admin access
 */
export function isAdmin(user: { publicMetadata?: { role?: string } } | null): boolean {
  return user?.publicMetadata?.role === 'admin'
}

/**
 * Public metadata type definition
 * Extend this as needed for additional metadata fields
 */
export type ClerkPublicMetadata = {
  role?: 'admin' | 'user'
  onboarding_completed?: boolean
}

/**
 * Theme configuration
 * Can be 'light', 'dark', or undefined for system default
 */
export const clerkTheme: Theme | undefined = undefined
