'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AccessibilityContextType {
  isSeniorMode: boolean
  toggleSeniorMode: () => void
  fontSize: 'normal' | 'large' | 'extra-large'
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void
  highContrast: boolean
  toggleHighContrast: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isSeniorMode, setIsSeniorMode] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Cargar preferencias desde localStorage
  useEffect(() => {
    const savedSeniorMode = localStorage.getItem('seniorMode') === 'true'
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'extra-large' || 'normal'
    const savedHighContrast = localStorage.getItem('highContrast') === 'true'
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true'

    setIsSeniorMode(savedSeniorMode)
    setFontSize(savedFontSize)
    setHighContrast(savedHighContrast)
    setReducedMotion(savedReducedMotion)
  }, [])

  // Guardar preferencias en localStorage
  useEffect(() => {
    localStorage.setItem('seniorMode', isSeniorMode.toString())
  }, [isSeniorMode])

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString())
  }, [highContrast])

  useEffect(() => {
    localStorage.setItem('reducedMotion', reducedMotion.toString())
  }, [reducedMotion])

  // Aplicar estilos de accesibilidad al documento
  useEffect(() => {
    const root = document.documentElement
    
    // Aplicar clases CSS según las preferencias
    if (isSeniorMode) {
      root.classList.add('senior-mode')
    } else {
      root.classList.remove('senior-mode')
    }

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Aplicar tamaño de fuente
    root.classList.remove('font-normal', 'font-large', 'font-extra-large')
    root.classList.add(`font-${fontSize}`)
  }, [isSeniorMode, fontSize, highContrast, reducedMotion])

  const toggleSeniorMode = () => {
    setIsSeniorMode(!isSeniorMode)
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
  }

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion)
  }

  const value = {
    isSeniorMode,
    toggleSeniorMode,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
} 