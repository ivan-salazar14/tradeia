import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables de entorno de Supabase no configuradas')
}

console.log('🔄 Iniciando conexión con Supabase...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verificar la conexión
const { data, error } = await supabase.from('users').select('count').single()
if (error) {
  console.error('❌ Error conectando con Supabase:', error.message)
  throw error
}
console.log('✅ Conexión con Supabase establecida exitosamente')

// Tipos para las tablas de la base de datos
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Agrega más tablas según necesites
    }
  }
} 