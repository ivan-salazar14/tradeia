import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables de entorno de Supabase no configuradas. El cliente se exportará vacío.')
}

console.log('🔄 Iniciando conexión con Supabase...')

// Create a single supabase client for browser use
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? {
          getItem: (key: string) => {
            if (key === 'supabase.auth.token') {
              const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';
              const cookieName = `sb-${projectRef}-auth-token`;
              const value = document.cookie
                .split('; ')
                .find(row => row.startsWith(`${cookieName}=`))
                ?.split('=')[1];
              return value || null;
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            if (key === 'supabase.auth.token') {
              const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';
              const cookieName = `sb-${projectRef}-auth-token`;
              document.cookie = `${cookieName}=${value}; path=/; max-age=31536000; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
            }
          },
          removeItem: (key: string) => {
            if (key === 'supabase.auth.token') {
              const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';
              const cookieName = `sb-${projectRef}-auth-token`;
              document.cookie = `${cookieName}=; path=/; max-age=0`;
            }
          },
        } : undefined,
      }
    })
  : null

// Explicación de los cambios:
// La función createClient ahora utiliza la opción "storage" para definir cómo se almacenan los tokens de autenticación.
// En lugar de utilizar el almacenamiento local por defecto, usa cookies para almacenar los tokens.
// Esto permite que los tokens se compartan entre las pestañas del navegador y se refresquen automáticamente.
// La función "getItem" busca el token en una cookie con el nombre "sb-{projectRef}-auth-token", donde projectRef es la parte del nombre de dominio de la URL de Supabase.
// La función "setItem" almacena el token en una cookie con el mismo nombre.
// La función "removeItem" elimina el token de la cookie.

// Helper function to get the Supabase client with the current session
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.')
  }
  return supabase
}

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