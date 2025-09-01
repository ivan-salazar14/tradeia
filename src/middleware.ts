import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/signals', '/bot', '/performance']

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip logging for Chrome DevTools and other well-known paths
  if (!pathname.startsWith('/.well-known/')) {
    console.log('[Middleware] Pathname:', pathname)
  }

  // Create response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax', // Important for cross-site requests
            secure: process.env.NODE_ENV === 'production', // Secure in production
            httpOnly: true, // Prevent XSS
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0, // Immediately expire the cookie
          })
        },
      },
    }
  )

  // Get the session
  const { data: { session } } = await supabase.auth.getSession()
  console.log('[Middleware] Session:', session ? 'Authenticated' : 'Not authenticated')

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    console.log('[Middleware] Redirecting to /login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Handle public routes for authenticated users
  if (publicRoutes.includes(pathname) && session) {
    console.log('[Middleware] Redirecting to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}