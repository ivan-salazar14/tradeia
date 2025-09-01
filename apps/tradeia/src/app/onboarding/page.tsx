"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const EXPERIENCE_LEVELS = [
  { value: "novice", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzado" },
]

const TRADING_GOALS = [
  { value: "short-term", label: "Ganancias a corto plazo" },
  { value: "long-term", label: "Inversión a largo plazo" },
  { value: "learning", label: "Aprender sobre trading" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [experienceLevel, setExperienceLevel] = useState<string>("")
  const [tradingGoals, setTradingGoals] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleNext = () => {
    if (step === 1 && !experienceLevel) {
      setError("Selecciona tu nivel de experiencia.")
      return
    }
    if (step === 2 && !tradingGoals) {
      setError("Selecciona tus objetivos de trading.")
      return
    }
    setError("")
    setStep(step + 1)
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id_uuid || "",
        },
        body: JSON.stringify({
          experience_level: experienceLevel,
          trading_goals: tradingGoals,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al guardar el onboarding.")
        setLoading(false)
        return
      }
      setStep(3)
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (e) {
      setError("Error de conexión. Intenta de nuevo.")
    }
    setLoading(false)
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">¿Cuál es tu nivel de experiencia en trading?</h2>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <label key={level.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="experience"
                    value={level.value}
                    checked={experienceLevel === level.value}
                    onChange={() => setExperienceLevel(level.value)}
                    className="accent-blue-600"
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold mb-4">¿Cuáles son tus objetivos de trading?</h2>
            <div className="space-y-2">
              {TRADING_GOALS.map((goal) => (
                <label key={goal.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="goals"
                    value={goal.value}
                    checked={tradingGoals === goal.value}
                    onChange={() => setTradingGoals(goal.value)}
                    className="accent-blue-600"
                  />
                  <span>{goal.label}</span>
                </label>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 text-green-700">¡Onboarding completo!</h2>
            <p className="text-gray-600">Redirigiendo al dashboard...</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Onboarding</h1>
        {renderStep()}
        {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        <div className="mt-8 flex justify-between">
          {step > 1 && step < 3 && (
            <Button onClick={handleBack} variant="outline">Anterior</Button>
          )}
          {step === 1 && (
            <Button onClick={handleNext} disabled={loading}>Siguiente</Button>
          )}
          {step === 2 && (
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Guardando..." : "Finalizar"}</Button>
          )}
          {step === 3 && (
            <Button onClick={() => router.push("/dashboard")}>Ir al Dashboard</Button>
          )}
        </div>
        {step < 3 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={handleSkip}>Saltar Onboarding</Button>
          </div>
        )}
      </div>
    </div>
  )
} 