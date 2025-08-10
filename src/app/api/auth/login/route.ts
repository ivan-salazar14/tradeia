import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createApiToken } from "@/lib/tokens"

export async function POST(request: NextRequest) {
  try {
    const { email, password, generateToken, tokenPermissions, tokenDescription } = await request.json()

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
    // Buscar el id_uuid en la tabla users y actualizar los metadatos del usuario en Auth
    let id_uuid = null;
    if (data.user && data.user.email) {
      // 1. Verificar si el usuario existe en la tabla users
      let userRow, userError;
      ({ data: userRow, error: userError } = await supabase
        .from('users')
        .select('id_uuid')
        .eq('email', data.user.email)
        .single());

      // 2. Si no existe, crearlo
      if (userError || !userRow) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ email: data.user.email }])
          .select('id_uuid')
          .single();
        if (insertError) {
          console.error("Error insertando usuario en tabla users:", insertError);
        }
        if (!insertError && newUser?.id_uuid) {
          userRow = newUser;
        }
      }

      // 3. Si existe o fue creado, actualizar los metadatos
      if (userRow?.id_uuid) {
        await supabase.auth.updateUser({
          data: { id_uuid: userRow.id_uuid }
        });
        id_uuid = userRow.id_uuid;
      }
    }
    
    // Generate API token if requested
    let apiToken = null;
    if (generateToken && data.user) {
      const permissions = Array.isArray(tokenPermissions) ? tokenPermissions : ['read'];
      const description = tokenDescription || 'Token generated during login';
      
      const tokenResult = await createApiToken({
        userId: data.user.id,
        description,
        permissions
      });
      
      if (tokenResult) {
        apiToken = {
          token: tokenResult.token,
          id: tokenResult.id,
          permissions: tokenResult.permissions,
          expiresAt: tokenResult.expiresAt
        };
      }
    }
    
    const response = NextResponse.json(
      {
        message: "Login exitoso",
        user: id_uuid ? { ...data.user, id_uuid } : data.user,
        session: data.session,
        apiToken: apiToken
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