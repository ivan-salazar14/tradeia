import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"

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
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase no está configurado correctamente en el servidor" },
        { status: 500 }
      )
    }
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
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
    // Buscar el id_uuid en la tabla users y actualizar los metadatos del usuario en Auth
    let id_uuid = null;
    if (data.user && data.user.email) {
      // 1. Verificar si el usuario existe en la tabla users
      let userRow, userError;
      ({ data: userRow, error: userError } = await supabaseAdmin
        .from('users')
        .select('id_uuid')
        .eq('email', data.user.email)
        .single());

      // 2. Si no existe, crearlo
      if (userError || !userRow) {
        const { data: newUser, error: insertError } = await (supabaseAdmin
          .from('users')
          .insert({ email: data.user.email, id_uuid: randomUUID() } as any)
          .select('id_uuid')
          .single() as any);
        if (insertError) {
          console.error("Error insertando usuario en tabla users:", insertError);
        }
        if (!insertError && newUser?.id_uuid) {
          userRow = newUser;
        }
      }

      // 3. Si existe o fue creado, actualizar los metadatos
      if (userRow?.id_uuid) {
        await supabaseAdmin.auth.updateUser({
          data: { id_uuid: userRow.id_uuid }
        });
        id_uuid = userRow.id_uuid;
      }
    }
    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: id_uuid ? { ...data.user, id_uuid } : data.user,
        session: data.session,
      },
      { status: 200 }
    )

    // Limpiar cookies antiguas antes de establecer las nuevas
    if (data.session) {
      // Limpiar cualquier cookie antigua que pueda existir
      response.cookies.set({
        name: "sb-access-token",
        value: '',
        path: "/",
        maxAge: 0
      });
      response.cookies.set({
        name: "sb-refresh-token",
        value: '',
        path: "/",
        maxAge: 0
      });

      // También limpiar cookies con nombres antiguos de proyectos si existen
      const oldProjectRefs = ['ztlxyfrznqerebeysxbx']; // Agregar otros project refs si es necesario
      oldProjectRefs.forEach(ref => {
        response.cookies.set({
          name: `sb-${ref}-auth-token`,
          value: '',
          path: "/",
          maxAge: 0
        });
        response.cookies.set({
          name: `sb-${ref}-refresh-token`,
          value: '',
          path: "/",
          maxAge: 0
        });
      });

      // Extraer el project reference de la URL de Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

      // Acceso token con nombre correcto para SSR
      response.cookies.set({
        name: `sb-${projectRef}-auth-token`,
        value: data.session.access_token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: data.session.expires_in || 3600,
      })
      // Refresh token con nombre correcto para SSR
      response.cookies.set({
        name: `sb-${projectRef}-refresh-token`,
        value: data.session.refresh_token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 días
      })

      // También mantener los nombres genéricos para compatibilidad con el cliente del navegador
      response.cookies.set({
        name: "sb-access-token",
        value: data.session.access_token,
        httpOnly: false, // No httpOnly para que el cliente pueda leerlo
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: data.session.expires_in || 3600,
      })
      // Refresh
      response.cookies.set({
        name: "sb-refresh-token",
        value: data.session.refresh_token,
        httpOnly: false, // No httpOnly para que el cliente pueda leerlo
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