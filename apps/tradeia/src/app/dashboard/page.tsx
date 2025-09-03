"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-singleton"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[DASHBOARD] loading:", loading, "user:", user)
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      // Force redirect even if signOut fails
      router.push("/login")
    }
  }

  if (loading) {
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

      {/* Onboarding banner removed - no forced redirects */}

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
        <p className="text-gray-600 mb-6">Bienvenido a su panel de control. Aquí encontrará un resumen del rendimiento de sus bots, las señales activas y el estado general de su cuenta. Use esta vista para obtener una instantánea rápida de su actividad de trading.</p>

        {/* Onboarding section removed - no forced onboarding */}

        {/* Dashboard Stats */}
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

        {/* Charts Section */}
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

        {/* Welcome Cards */}
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
              Recursos Útiles
            </h3>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push('/dashboard/signals')}>
                Explorar Señales
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/support')}>
                Centro de Ayuda
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}