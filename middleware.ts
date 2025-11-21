import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

const isPublicApi = createRouteMatcher([
  '/api/stripe/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicApi(req)) return;       // Stripe API는 보호 X

  if (isProtectedRoute(req)) {
    await auth.protect();             // dashboard만 보호
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)',
    '/(api|trpc)(.*)',
  ],
};
