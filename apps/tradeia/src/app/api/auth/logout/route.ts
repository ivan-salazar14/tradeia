import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase no está configurado correctamente en el servidor" },
        { status: 500 }
      )
    }
    const { error } = await supabaseAdmin.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: "Error al cerrar sesión" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Sesión cerrada exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 