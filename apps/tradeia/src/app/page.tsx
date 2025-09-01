"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Home() {
  console.log('🏠 Renderizando página principal')

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando Tradeia...</p>
        </div>
      </div>
    )
  }

  // Página de landing temporal mientras se cargan los datos
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tradeia
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Señales de Trading Profesionales
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
          <Button 
            onClick={() => router.push("/register")}
            variant="outline"
            className="w-full"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  )
}
