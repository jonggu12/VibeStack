import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// =======================
// 🔑 Route Matchers (Centralized Configuration)
// =======================
const isProtectedRoute = createRouteMatcher([...PROTECTED_ROUTES])
const isPublicRoute = createRouteMatcher([...PUBLIC_ROUTES])

// Banned 사용자가 접근 가능한 경로
const BANNED_ALLOWED_PATHS = [
  '/banned',
  '/', // 홈 페이지 (정지 안내만 표시)
  '/profile',
  '/support',
  '/purchases',
  '/settings',
  '/sign-out',
  '/api/auth', // Clerk webhooks
]

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

  // Check if user is banned (after authentication)
  const { userId } = await auth()

  if (userId) {
    const currentPath = req.nextUrl.pathname

    // 이미 허용된 경로에 있으면 통과
    const isAllowedPath = BANNED_ALLOWED_PATHS.some(path =>
      currentPath.startsWith(path)
    )

    if (!isAllowedPath) {
      // DB에서 사용자 상태 확인
      try {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('banned')
          .eq('clerk_user_id', userId)
          .single()

        // 정지된 사용자는 /banned 페이지로 리다이렉트
        if (user?.banned) {
          const bannedUrl = new URL('/banned', req.url)
          return NextResponse.redirect(bannedUrl)
        }
      } catch (error) {
        console.error('Error checking ban status:', error)
        // 에러 발생 시 계속 진행 (서비스 중단 방지)
      }
    }
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
