import { getSupabaseClient } from '@/lib/supabase-client'

// Create a type for the auth state
export type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  error: string | null
}

// Get the current session from the server
export const getServerSession = async () => {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get the current user from the server
export const getCurrentUser = async () => {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign out
export const signOut = async () => {
  const supabase = getSupabaseClient()

  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const supabase = getSupabaseClient()

  if (!supabase) {
    console.error('Failed to initialize Supabase client for auth subscription')
    return { data: { subscription: null } }
  }

  return supabase.auth.onAuthStateChange(callback)
}
