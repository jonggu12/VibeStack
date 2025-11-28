/**
 * Route Configuration
 *
 * Centralized route patterns for middleware and access control.
 * This ensures consistency across authentication and authorization logic.
 */

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
