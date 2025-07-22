"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User as SupabaseUser, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface UserWithUUID extends SupabaseUser {
  id_uuid?: string | null;
}

interface AuthContextType {
  user: UserWithUUID | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithUUID | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      console.warn("[AuthContext] Supabase no está configurado. El contexto de autenticación funcionará en modo desconectado.")
      setSession(null)
      setUser(null)
      setLoading(false)
      return
    }
    // Obtener sesión inicial
    const getInitialSession = async () => {
      if (!supabase) {
        console.warn("[AuthContext] Supabase no está configurado. El contexto de autenticación funcionará en modo desconectado.")
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
      }
      setSession(session)
      if (session?.user) {
        // Buscar id_uuid en los metadatos del usuario o en la sesión
        const id_uuid = (session.user.user_metadata && session.user.user_metadata.id_uuid) || null;
        setUser({ ...session.user, id_uuid });
      } else {
        setUser(null);
      }
      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session?.user) {
          const id_uuid = (session.user.user_metadata && session.user.user_metadata.id_uuid) || null;
          setUser({ ...session.user, id_uuid });
        } else {
          setUser(null);
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (!supabase) {
      console.warn("[AuthContext] Supabase no está configurado. No se puede cerrar sesión.")
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 