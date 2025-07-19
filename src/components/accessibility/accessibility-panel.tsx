'use client'

import React, { useState } from 'react'
import { useAccessibility } from '@/contexts/accessibility-context'
import { Button } from '@/components/ui/button'

export function AccessibilityPanel() {
  const {
    isSeniorMode,
    toggleSeniorMode,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
  } = useAccessibility()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante de accesibilidad */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Configuración de accesibilidad"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </Button>

      {/* Panel de configuración */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración de Accesibilidad
            </h3>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              aria-label="Cerrar configuración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="space-y-4">
            {/* Modo Senior */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="senior-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modo Senior
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fuentes más grandes y navegación simplificada
                </p>
              </div>
              <Button
                id="senior-mode"
                onClick={toggleSeniorMode}
                variant={isSeniorMode ? "default" : "outline"}
                size="sm"
                aria-pressed={isSeniorMode}
              >
                {isSeniorMode ? "Activado" : "Desactivado"}
              </Button>
            </div>

            {/* Tamaño de fuente */}
            <div>
              <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamaño de Fuente
              </label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as 'normal' | 'large' | 'extra-large')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="extra-large">Muy Grande</option>
              </select>
            </div>

            {/* Alto Contraste */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alto Contraste
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mejora la visibilidad del texto
                </p>
              </div>
              <Button
                id="high-contrast"
                onClick={toggleHighContrast}
                variant={highContrast ? "default" : "outline"}
                size="sm"
                aria-pressed={highContrast}
              >
                {highContrast ? "Activado" : "Desactivado"}
              </Button>
            </div>

            {/* Reducción de Movimiento */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reducir Movimiento
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimiza animaciones y transiciones
                </p>
              </div>
              <Button
                id="reduced-motion"
                onClick={toggleReducedMotion}
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                aria-pressed={reducedMotion}
              >
                {reducedMotion ? "Activado" : "Desactivado"}
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Estas configuraciones se guardan automáticamente en tu navegador.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 