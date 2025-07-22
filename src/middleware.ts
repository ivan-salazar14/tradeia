import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from "next/headers";

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/signals', '/bot', '/performance']

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('[Middleware] Pathname:', pathname)

  // Crear cliente de Supabase para middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Variables de entorno de Supabase no definidas. Permitiendo acceso...')
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Obtener el token de la cookie
  const token = request.cookies.get('sb-access-token')?.value
  console.log('[Middleware] Token:', token)

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  console.log('[Middleware] isProtectedRoute:', isProtectedRoute, 'isPublicRoute:', isPublicRoute)

  // Permitir acceso directo a rutas públicas
  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!token) {
      console.log('[Middleware] No token, redirigiendo a login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      console.log('[Middleware] Resultado de getUser:', { user, error })
      if (error || !user) {
        console.log('[Middleware] Token inválido, redirigiendo a login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        const response = NextResponse.redirect(loginUrl)
        if (error?.status === 403 || error?.code === 'bad_jwt') {
          response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' })
        }
        return response
      }
    } catch (error: any) {
      console.error('[Middleware] Error al verificar token:', error)
      if (error?.status === 403 || error?.code === 'bad_jwt') {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        const response = NextResponse.redirect(loginUrl)
        response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' })
        return response
      }
      // Permitir acceso si hay error de conexión con Supabase
      return NextResponse.next()
    }
  }

  // Si el usuario está autenticado y trata de acceder a login, redirect to dashboard
  if (pathname === '/login' && token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      console.log('[Middleware] Intento de acceso a /login con token:', { user, error })
      if (user && !error) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Si el token es inválido, limpiar la cookie y permitir acceso a login
      if (error?.status === 403 || error?.code === 'bad_jwt') {
        const response = NextResponse.next()
        response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' })
        return response
      }
    } catch (error: any) {
      if (error?.status === 403 || error?.code === 'bad_jwt') {
        const response = NextResponse.next()
        response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' })
        return response
      }
      // Permitir acceso a login si hay otro error
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 