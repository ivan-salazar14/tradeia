import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Rutas que requieren autenticación (solo páginas, no APIs)
const protectedRoutes = ['/dashboard', '/profile', '/signals', '/bot', '/performance']

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/login', 
  '/register', 
  '/', 
  '/api/auth/callback', 
  '/_next',
  '/favicon.ico',
  '/api/health'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip logging for Chrome DevTools and other well-known paths
  if (!pathname.startsWith('/.well-known/')) {
    console.log('[Middleware] Pathname:', pathname)
  }

  // Skip middleware entirely for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Create response object
  const response = NextResponse.next({
    request:{
      headers: request.headers,
    },
})

  // Create Supabase server client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0
          })
        },
      },
    }
  )

  try {
    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => {
      // Check if the path matches the protected route exactly or starts with it
      return pathname === route || pathname.startsWith(`${route}/`);
    });
    
    if (isProtectedRoute) {
      // Skip API routes from protected route checks as they handle their own auth
      if (pathname.startsWith('/api/')) {
        return response;
      }
      
      // Get the session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('[Middleware] Error getting session:', error)
        // Instead of throwing, redirect to login with error
        const url = new URL('/login', request.url)
        url.searchParams.set('error', 'session_error')
        return NextResponse.redirect(url)
      }
      
      // If no session, redirect to login
      if (!session) {
        console.log('[Middleware] No session found, redirecting to login')
        const url = new URL('/login', request.url)
        // Only set redirectedFrom if it's not already a login redirect
        if (!pathname.startsWith('/login')) {
          url.searchParams.set('redirectedFrom', pathname)
        }
        return NextResponse.redirect(url)
      }
      
      console.log('[Middleware] User is authenticated:', session.user?.email)
      
      // If user is authenticated but tries to access login, redirect to dashboard
      if (pathname === '/login') {
        console.log('[Middleware] User is already authenticated, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('[Middleware] Error:', error)
    // In case of error, allow the request to continue but log it
    return response
  }
}

// Skip all static files and webpack hot updates
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json)$).*)',
  ],
}