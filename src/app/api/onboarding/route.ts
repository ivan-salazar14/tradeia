import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Helper to get user from session (to be replaced with real auth/session logic)
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  // TODO: Replace with real session extraction
  const userId = request.headers.get("x-user-id")
  return userId
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId || !supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const { data, error } = await supabase
    .from("users")
    .select("onboarding_complete, experience_level, trading_goals")
    .eq("id", userId)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request)
  if (!userId || !supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const body = await request.json()
  const { experience_level, trading_goals } = body
  const { error } = await supabase
    .from("users")
    .update({
      onboarding_complete: true,
      experience_level,
      trading_goals,
    })
    .eq("id", userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 