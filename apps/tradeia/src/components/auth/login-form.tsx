"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectedFrom') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate required fields
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
      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error('No se pudo inicializar el cliente de autenticación')
      }
      
      console.log('[LoginForm] Attempting to sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        console.error('[LoginForm] Sign in error:', error)
        throw error
      }

      console.log('[LoginForm] Sign in successful, session:', data.session ? 'valid' : 'invalid')
      
      if (data.session) {
        // Small delay to ensure session is properly propagated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force a full page reload to ensure all auth state is properly set
        console.log('[LoginForm] Redirecting to:', redirectTo)
        window.location.href = redirectTo;
      } else {
        throw new Error('No se pudo iniciar sesión. Por favor, intente nuevamente.')
      }
    } catch (error) {
      console.error('[LoginForm] Login error:', error)
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full font-inter"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  )
}