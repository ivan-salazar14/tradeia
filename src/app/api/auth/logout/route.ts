import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase no está configurado correctamente en el servidor" },
        { status: 500 }
      )
    }
    const { error } = await supabase.auth.signOut()

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