import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { access_token } = await request.json()
  console.log('[SET-COOKIE] Token recibido:', access_token)
  if (!access_token) {
    console.warn('[SET-COOKIE] No se recibió access_token')
    return NextResponse.json({ error: "No token provided" }, { status: 400 })
  }
  const response = NextResponse.json({ success: true })
  response.cookies.set("sb-access-token", access_token, {
    path: "/",
    httpOnly: false, // El middleware puede leerla
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
  console.log('[SET-COOKIE] Cookie sb-access-token seteada:', response.cookies.get('sb-access-token'))
  return response
} 