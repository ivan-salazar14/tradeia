import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js";

// Helper to get user from session (real auth/session logic)
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("sb-access-token")?.value;
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Cliente con contexto de usuario autenticado
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  const userId = await getUserIdFromRequest(request)
  console.log("[ONBOARDING] userId extraído:", userId)
  if (!userId || userId === "null") {
    console.log("[ONBOARDING] No autorizado o supabase no inicializado")
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  console.log("userId extraído:", userId, typeof userId);
  const { data, error } = await supabase
    .from("users")
    .select("onboarding_complete, experience_level, trading_goals")
    .eq("id_uuid", userId);
  console.log("data obtenida:", data);
  if (error) {
    console.log("[ONBOARDING] Error en consulta supabase:", error);
    if (error.code === 'PGRST116') {
      // Intentar crear el usuario solo si no existe
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ id_uuid: userId, onboarding_complete: false, experience_level: "novice", trading_goals: "learning" }]);
      if (insertError) {
        // Si el error es por clave duplicada, simplemente retorna datos vacíos
        if (insertError.code === '23505') { // 23505 = duplicate key value violates unique constraint
          return NextResponse.json({
            onboarding_complete: false,
            experience_level: null,
            trading_goals: null,
          });
        }
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      // Retornar datos vacíos o el nuevo usuario
      return NextResponse.json({
        onboarding_complete: false,
        experience_level: null,
        trading_goals: null,
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("[ONBOARDING] Datos obtenidos:", data)
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;
  const userId = await getUserIdFromRequest(request)
  if (!userId || userId === "null") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  const body = await request.json()
  const { experience_level, trading_goals } = body
  const { data, error } = await supabase
    .from("users")
    .upsert([{
      id_uuid: userId,
      onboarding_complete: true,
      experience_level,
      trading_goals,
    }], { onConflict: 'id_uuid' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 