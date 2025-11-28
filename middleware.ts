import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes"

// =======================
// 🔑 Route Matchers (Centralized Configuration)
// =======================
const isProtectedRoute = createRouteMatcher([...PROTECTED_ROUTES])
const isPublicRoute = createRouteMatcher([...PUBLIC_ROUTES])

// =======================
// 🔑 Clerk Middleware
// =======================
export default clerkMiddleware(async (auth, req) => {
  // Public routes: no authentication required
  if (isPublicRoute(req)) {
    return
  }

  // Protected routes: require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // All other routes are public by default
});

// =======================
// 🌍 미들웨어 적용 범위
// =======================
export const config = {
  matcher: [
    // 정적 파일과 _next 경로 제외, 나머지 페이지와 API 적용
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)',
    '/(api|trpc)(.*)',
  ],
};
