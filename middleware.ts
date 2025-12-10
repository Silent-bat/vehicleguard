import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // API routes should always pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Check if user has a session token
  const sessionToken = request.cookies.get("better-auth.session_token")?.value

  // If trying to access protected route without session, redirect to unauthorized page
  if (!isPublicRoute && !sessionToken) {
    // Allow access to unauthorized page
    if (pathname === "/unauthorized") {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }



  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
