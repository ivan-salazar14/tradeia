"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
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
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white border-b-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-700 ml-4">Panel de Control</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">🔔</span>
          <div className="font-semibold">{user.email}</div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Onboarding Banner Reminder */}
      {onboardingComplete === false && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center justify-between">
          <span>¡Completa tu onboarding para personalizar tu experiencia!</span>
          <Button size="sm" variant="outline" onClick={() => router.push('/onboarding')}>
            Ir al Onboarding
          </Button>
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
        <p className="text-gray-600 mb-6">Bienvenido a su panel de control. Aquí encontrará un resumen del rendimiento de sus bots, las señales activas y el estado general de su cuenta. Use esta vista para obtener una instantánea rápida de su actividad de trading.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card">
            <h3 className="text-gray-500 text-sm font-medium">Rendimiento (30d)</h3>
            <p className="text-3xl font-semibold text-green-600">+12.5%</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-500 text-sm font-medium">Saldo de Cuenta</h3>
            <p className="text-3xl font-semibold">$15,780.50</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-500 text-sm font-medium">P/L Abierto</h3>
            <p className="text-3xl font-semibold text-red-500">-$210.15</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-500 text-sm font-medium">Señales Activas</h3>
            <p className="text-3xl font-semibold">4</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 stat-card">
            <h3 className="font-semibold mb-4">Rendimiento de la Cartera</h3>
            <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
              <span className="text-gray-400">[Gráfico de líneas aquí]</span>
            </div>
          </div>
          <div className="stat-card">
            <h3 className="font-semibold mb-4">Distribución de Activos</h3>
            <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
              <span className="text-gray-400">[Gráfico de dona aquí]</span>
            </div>
          </div>
        </div>

        {/* Welcome Card for new users */}
        {onboardingComplete === true && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Bienvenido a Tradeia!
              </h2>
              <p className="text-gray-600">
                Tu plataforma de señales de trading está lista. Próximamente podrás suscribirte a paquetes de señales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Estadísticas
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Señales Activas:</span>
                  <span className="font-medium text-gray-900">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Suscripciones:</span>
                  <span className="font-medium text-gray-900">1</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => router.push('/dashboard/signals')}>
                  Explorar Señales
                </Button>
                <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/analysis')}>
                  Ver Performance
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 