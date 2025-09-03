import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    // Try to get user ID from x-user-id header (simpler approach)
    const userId = request.headers.get('x-user-id')
    const token = request.cookies.get("sb-access-token")?.value;

    if (userId) {
      console.log('[ONBOARDING] Using x-user-id header:', userId)

      // Initialize Supabase client with service role for admin operations
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
           global: { headers: { Authorization: `Bearer ${token}` } }
        }
      )

      // Use the provided user ID directly
      const user = { id: userId }

      // Try to get user data
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("onboarding_complete, experience_level, trading_goals")
        .eq("id_uuid", user.id)
        .single()

      // If user doesn't exist, return default values
      if (fetchError?.code === 'PGRST116' || !userData) {
        return NextResponse.json({
          onboarding_complete: false,
          experience_level: null,
          trading_goals: null,
        })
      }

      return NextResponse.json(userData)
    }

    // Fallback to Authorization header method
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.split(' ')[1]

    if (!accessToken) {
      console.error('[ONBOARDING] No autorizado: No se encontró el token de acceso ni x-user-id')
      return NextResponse.json(
        { error: 'No autorizado: Se requiere autenticación' },
        { status: 401 }
      )
    }

    // Initialize Supabase with the provided access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        },
        auth: {
          persistSession: false
        }
      }
    )

    // Create a separate client for database operations with service role
    const dbSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Get the user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      console.error('[ONBOARDING] Error al verificar el usuario:', userError?.message)
      return NextResponse.json(
        {
          error: 'No se pudo verificar el usuario',
          details: userError?.message
        },
        { status: 401 }
      )
    }

    // Try to get user data
    const { data: userData, error: fetchError } = await dbSupabase
      .from("users")
      .select("onboarding_complete, experience_level, trading_goals")
      .eq("id_uuid", user.id)
      .single()

    // If user doesn't exist, return default values
    if (fetchError?.code === 'PGRST116' || !userData) {
      return NextResponse.json({
        onboarding_complete: false,
        experience_level: null,
        trading_goals: null,
      })
    }

    return NextResponse.json(userData)

  } catch (error) {
    console.error('[ONBOARDING] Error inesperado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to get user ID from x-user-id header first
    const userId = request.headers.get('x-user-id')
    let user = null

    if (userId) {
      console.log('[ONBOARDING] Using x-user-id header for POST:', userId)
      user = { id: userId }
    } else {
      // Fallback to Authorization header method
      const authHeader = request.headers.get('authorization')
      const accessToken = authHeader?.split(' ')[1]

      if (!accessToken) {
        return NextResponse.json(
          { error: 'No autorizado: Se requiere autenticación' },
          { status: 401 }
        )
      }

      // Initialize Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          },
          auth: {
            persistSession: false
          }
        }
      )

      // Get the authenticated user
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(accessToken)

      if (userError || !authUser) {
        console.error('[ONBOARDING] Error al verificar el usuario:', userError?.message)
        return NextResponse.json(
          { error: 'No se pudo verificar el usuario' },
          { status: 401 }
        )
      }

      user = authUser
    }

    // Initialize Supabase for database operations with service role
    const dbSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )
    
    // Parse request body
    const { experience_level, trading_goals } = await request.json()
    
    // Update user data
    const { error } = await dbSupabase
      .from("users")
      .upsert({
        id_uuid: user.id,
        email: user.email,
        onboarding_complete: true,
        experience_level,
        trading_goals,
        updated_at: new Date().toISOString()
      })
      .eq('id_uuid', user.id)
    
    if (error) {
      console.error('[ONBOARDING] Error al actualizar usuario:', error)
      return NextResponse.json(
        { error: 'Error al guardar los datos' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('[ONBOARDING] Error inesperado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 