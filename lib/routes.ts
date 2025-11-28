/**
 * Route Configuration
 *
 * Centralized route patterns for middleware and access control.
 * This ensures consistency across authentication and authorization logic.
 */

/**
 * Application Routes (exact paths)
 * Use these instead of hardcoded strings for type safety and refactorability
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  ABOUT: '/about',

  // Auth routes
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',

  // Protected routes
  DASHBOARD: '/dashboard',
  ONBOARDING: '/onboarding',

  // Content routes
  DOCS: '/docs',
  TUTORIALS: '/tutorials',
  SNIPPETS: '/snippets',
  LIBRARY: '/library',
  SEARCH: '/search',

  // Settings routes
  SETTINGS: '/settings',
  SETTINGS_BILLING: '/settings/billing',
  SETTINGS_SUBSCRIPTION: '/settings/subscription',
  SETTINGS_TEAM: '/settings/team',

  // Tools routes
  AI_CHAT: '/tools/ai-chat',
  PROJECT_MAP: '/tools/project-map',
  ERROR_CLINIC: '/error-clinic',

  // Admin routes
  ADMIN_CONTENT: '/admin/content',

  // Checkout routes
  CHECKOUT: '/checkout',
  SUCCESS: '/success',
  CANCELED: '/canceled',
} as const

/**
 * API Routes
 */
export const API_ROUTES = {
  // Auth webhooks
  CLERK_WEBHOOK: '/api/auth/webhook',

  // Payment webhooks
  STRIPE_WEBHOOK: '/api/stripe/webhook',
  TOSS_WEBHOOK: '/api/toss/webhook',

  // Checkout
  STRIPE_CHECKOUT: '/api/stripe/checkout',
  TOSS_CHECKOUT: '/api/toss/checkout',
} as const

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard(.*)',                     // Dashboard pages
  '/onboarding(.*)',                    // Onboarding flow
  '/tools/(ai-chat|project-map)(.*)',   // Pro feature tools
  '/checkout(.*)',                      // Checkout pages
  '/admin(.*)',                         // Admin pages
] as const

/**
 * Public API routes (no authentication required)
 * These are typically webhook endpoints or public APIs
 */
export const PUBLIC_API_ROUTES = [
  '/api/stripe/(.*)',                   // Stripe webhooks
  '/api/toss/(.*)',                     // Toss Payments webhooks
  '/api/auth/webhook(.*)',              // Clerk webhook
  '/api/webhooks/(.*)',                 // Other webhooks (Supabase, etc.)
] as const

/**
 * Public page routes (no authentication required)
 */
export const PUBLIC_PAGE_ROUTES = [
  '/sign-in(.*)',                       // Sign in page
  '/sign-up(.*)',                       // Sign up page
  '/success(.*)',                       // Payment success page
  '/canceled(.*)',                      // Payment canceled page
  '/error(.*)',                         // Error pages
] as const

/**
 * All public routes combined
 */
export const PUBLIC_ROUTES = [
  ...PUBLIC_API_ROUTES,
  ...PUBLIC_PAGE_ROUTES,
] as const

/**
 * Admin-only routes (require admin role)
 */
export const ADMIN_ROUTES = [
  '/admin(.*)',
] as const

/**
 * Route access levels
 */
export type RouteAccessLevel = 'public' | 'protected' | 'admin'

/**
 * Determine route access level based on pathname
 */
export function getRouteAccessLevel(pathname: string): RouteAccessLevel {
  // Check admin routes first (most restrictive)
  for (const pattern of ADMIN_ROUTES) {
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(pathname)) {
      return 'admin'
    }
  }

  // Check public routes
  for (const pattern of PUBLIC_ROUTES) {
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(pathname)) {
      return 'public'
    }
  }

  // Check protected routes
  for (const pattern of PROTECTED_ROUTES) {
    const regex = new RegExp(`^${pattern}$`)
    if (regex.test(pathname)) {
      return 'protected'
    }
  }

  // Default: public
  return 'public'
}
