import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/list-machine']

// Routes that redirect authenticated users away (login, register)
const AUTH_ROUTES = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for access token in cookies (set by auth flow)
  // Note: localStorage is not accessible in middleware — we use a cookie set at login
  const hasToken = request.cookies.has('pw_auth_token')

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !hasToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match protected and auth routes only
    '/dashboard/:path*',
    '/list-machine/:path*',
    '/auth/login',
    '/auth/register',
  ],
}
