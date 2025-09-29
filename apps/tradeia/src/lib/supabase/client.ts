import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '../../types/supabase'

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') return null
  if (clientInstance) return clientInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx'
  const authTokenKey = `sb-${projectRef}-auth-token`
  const refreshTokenKey = `sb-${projectRef}-refresh-token`

  clientInstance = createBrowserClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
        storage: {
          getItem: (key: string) => {
            if (typeof document === 'undefined') return null
            try {
              const cookies = document.cookie.split('; ')
              const cookie = cookies.find(row => row.startsWith(`${key}=`))
              return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
            } catch (error) {
              console.error('[Supabase] Error reading cookie:', error)
              return null
            }
          },
          setItem: (key: string, value: string) => {
            if (typeof document === 'undefined') return
            try {
              if (key === authTokenKey) {
                document.cookie = `${key}=${encodeURIComponent(value)}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; samesite=lax; ${process.env.NODE_ENV === 'production' ? 'secure;' : ''}`
              } else if (key === refreshTokenKey) {
                document.cookie = `${key}=${encodeURIComponent(value)}; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; samesite=lax; ${process.env.NODE_ENV === 'production' ? 'secure;' : ''}`
              }
            } catch (error) {
              console.error('[Supabase] Error setting cookie:', error)
            }
          },
          removeItem: (key: string) => {
            if (typeof document === 'undefined') return
            try {
              document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            } catch (error) {
              console.error('[Supabase] Error removing cookie:', error)
            }
          }
        }
      }
    }
  )
  return clientInstance
}

export const useSupabase = () => ({ supabase: getSupabaseClient() })

export const getSession = async () => {
  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const signOut = async () => {
  const supabase = getSupabaseClient()
  if (!supabase) return

  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}