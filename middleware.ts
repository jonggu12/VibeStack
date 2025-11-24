import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// =======================
// 🔒 로그인 필수 경로
// =======================
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',                     // 대시보드 전체
  '/onboarding(.*)',                    // 온보딩
  '/tools/(ai-chat|project-map)(.*)',   // Pro 기능 도구
  '/checkout(.*)',                       // 결제 페이지
  '/admin(.*)',                          // 관리자 페이지
]);

// =======================
// 🌐 로그인 필요 없는 공개 API
// =======================
const isPublicApi = createRouteMatcher([
  '/api/stripe/(.*)',                   // Stripe Webhook 등 공개 API
  '/api/toss/(.*)',                     // Toss Webhook 등 공개 API
  '/api/webhooks/(.*)',                 // Supabase 등 외부 Webhook
]);

// =======================
// 🌐 로그인 필요 없는 공개 페이지 (결제 결과)
// =======================
const isPublicCheckout = createRouteMatcher([
  '/success(.*)',                       // 결제 성공 페이지
  '/canceled(.*)',                      // 결제 취소 페이지
]);

// =======================
// 🔑 Clerk 미들웨어
// =======================
export default clerkMiddleware(async (auth, req) => {
  if (isPublicApi(req)) return;        // 공개 API는 보호하지 않음
  if (isPublicCheckout(req)) return;   // 결제 결과 페이지는 보호하지 않음

  if (isProtectedRoute(req)) {
    await auth.protect();              // 보호된 페이지 로그인 체크
  }
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
