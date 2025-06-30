import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/signals', '/bot', '/performance']

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Crear cliente de Supabase para middleware
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Obtener el token de la cookie
  const token = request.cookies.get('sb-access-token')?.value

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  if (isProtectedRoute) {
    if (!token) {
      // Si no hay token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verificar si el token es válido
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error || !user) {
        // Token inválido, redirect to login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // Error al verificar token, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Si el usuario está autenticado y trata de acceder a login, redirect to dashboard
  if (pathname === '/login' && token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (user && !error) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Si hay error al verificar, permitir acceso a login
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