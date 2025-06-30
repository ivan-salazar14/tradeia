import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistance, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Función para combinar clases de Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

// Función para obtener tiempo relativo
export function getRelativeTime(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { 
    addSuffix: true, 
    locale: es 
  })
}

// Función para formatear números como moneda
export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Función para formatear números con separadores
export function formatNumber(num: number) {
  return new Intl.NumberFormat('es-ES').format(num)
}

// Función para generar ID único
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Función para capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
} 