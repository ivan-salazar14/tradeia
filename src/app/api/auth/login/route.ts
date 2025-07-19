import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validación de campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    // Autenticación con Supabase
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado correctamente en el servidor" },
        { status: 500 }
      )
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      )
    }

    // Login exitoso: establecer cookies de sesión
    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    )

    // Establecer cookies de acceso y refresh token
    if (data.session) {
      // Acceso
      response.cookies.set({
        name: "sb-access-token",
        value: data.session.access_token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: data.session.expires_in || 3600,
      })
      // Refresh
      response.cookies.set({
        name: "sb-refresh-token",
        value: data.session.refresh_token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      })
    }
    return response
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 