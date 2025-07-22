import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables de entorno de Supabase no configuradas. El cliente se exportará vacío.')
}

console.log('🔄 Iniciando conexión con Supabase...')

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos para las tablas de la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          id_uuid: string
          email: string
          created_at: string
          updated_at: string
          onboarding_complete: boolean
          experience_level: string | null
          trading_goals: string | null
        }
        Insert: {
          id?: string
          id_uuid?: string
          email: string
          created_at?: string
          updated_at?: string
          onboarding_complete?: boolean
          experience_level?: string | null
          trading_goals?: string | null
        }
        Update: {
          id?: string
          id_uuid?: string
          email?: string
          created_at?: string
          updated_at?: string
          onboarding_complete?: boolean
          experience_level?: string | null
          trading_goals?: string | null
        }
      }
      // Agrega más tablas según necesites
    }
  }
} 