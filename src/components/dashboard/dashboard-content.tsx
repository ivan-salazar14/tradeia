"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function DashboardContent() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null)
  const [onboardingLoading, setOnboardingLoading] = useState(true)

  useEffect(() => {
    console.log("[DASHBOARD] loading:", loading, "user:", user)
    if (!loading && user) {
      // Fetch onboarding status for the current user
      const fetchOnboarding = async () => {
        setOnboardingLoading(true)
        try {
          console.log("[DASHBOARD] Llamando a /api/onboarding con user.id_uuid:", user.id_uuid)
          const res = await fetch("/api/onboarding", {
            headers: { "x-user-id": user.id_uuid || "" },
          })
          console.log("[DASHBOARD] Respuesta recibida de /api/onboarding:", res.status)
          if (res.ok) {
            const data = await res.json()
            console.log("[DASHBOARD] Datos de onboarding:", data)
            setOnboardingComplete(!!data.onboarding_complete)
          } else {
            setOnboardingComplete(false)
          }
        } catch (e) {
          console.log("[DASHBOARD] Error en fetch onboarding:", e)
          setOnboardingComplete(false)
        }
        setOnboardingLoading(false)
      }
      fetchOnboarding()
    }
  }, [user, loading])

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  if (loading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-inter">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                Bienvenido, {user.email}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Onboarding Banner Reminder */}
      {onboardingComplete === false && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center justify-between font-inter">
          <span>¡Completa tu onboarding para personalizar tu experiencia!</span>
          <Button size="sm" variant="outline" onClick={() => router.push('/onboarding')}>Ir al Onboarding</Button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 font-inter">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-inter">
              ¡Bienvenido a Tradeia!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-inter">
              Tu plataforma de señales de trading está lista. Próximamente podrás suscribirte a paquetes de señales.
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 font-inter">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-inter">
              Estadísticas
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-inter">Señales Activas:</span>
                <span className="font-medium text-gray-900 dark:text-white font-inter">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-inter">Suscripciones:</span>
                <span className="font-medium text-gray-900 dark:text-white font-inter">0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 font-inter">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-inter">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Button className="w-full font-inter" disabled>
                Explorar Señales
              </Button>
              <Button className="w-full font-inter" variant="outline" disabled>
                Ver Performance
              </Button>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-inter">
              Próximamente disponible
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 