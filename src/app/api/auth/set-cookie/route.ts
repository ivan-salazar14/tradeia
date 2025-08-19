import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { access_token } = await request.json()
  console.log('[SET-COOKIE] Token recibido:', access_token ? '*****' : 'undefined')
  
  if (!access_token) {
    console.warn('[SET-COOKIE] No se recibió access_token')
    return NextResponse.json({ error: "No token provided" }, { status: 400 })
  }

  const isProduction = process.env.NODE_ENV === "production"
  const cookieOptions = {
    path: "/",
    httpOnly: true, // More secure - JavaScript can't access it
    sameSite: isProduction ? 'lax' as const : 'lax' as const,
    secure: isProduction, // Only send over HTTPS in production
    maxAge: 60 * 60 * 24 * 7, // 7 días
  }

  const response = NextResponse.json({ success: true })
  
  // Set the cookie with secure options
  response.cookies.set({
    name: "sb-access-token",
    value: access_token,
    ...cookieOptions
  })
  
  // Also set a SameSite=None version for cross-site requests if needed
  response.cookies.set({
    name: "sb-access-token-cross",
    value: access_token,
    ...cookieOptions,
    sameSite: 'none' as const,
    secure: true
  })
  
  console.log('[SET-COOKIE] Cookies de autenticación configuradas correctamente')
  return response
}