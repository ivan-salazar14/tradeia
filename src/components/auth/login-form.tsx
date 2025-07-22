"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Cookies from "js-cookie"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validación de campos requeridos
    if (!email || !password) {
      setError("Email y contraseña son requeridos")
      setIsLoading(false)
      return
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un email válido")
      setIsLoading(false)
      return
    }

    try {
      // Verificar que supabase no sea null antes de usarlo
      if (!supabase) {
        setError("Error de conexión con el servicio de autenticación.")
        setIsLoading(false)
        return
      }
      // Login directo con Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }
      // Guardar el access_token en una cookie para el middleware (vía API)
      if (data.session?.access_token) {
        console.log('[LOGIN] access_token recibido:', data.session.access_token)
        const setCookieRes = await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: data.session.access_token }),
          credentials: "include"
        })
        console.log('[LOGIN] Respuesta de /api/auth/set-cookie:', setCookieRes.status)
        const setCookieJson = await setCookieRes.json()
        console.log('[LOGIN] Body de respuesta de /api/auth/set-cookie:', setCookieJson)
      }
      // Login exitoso
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100 font-inter">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-100 font-inter">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 font-inter">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full font-inter"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </form>
    </div>
  )
} 