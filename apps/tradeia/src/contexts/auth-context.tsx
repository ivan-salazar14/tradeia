"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User as SupabaseUser, Session } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export interface UserWithUUID extends SupabaseUser {
  id_uuid?: string | null;
}

interface AuthContextType {
  user: UserWithUUID | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithUUID | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<ReturnType<typeof getSupabaseClient> | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle auth state changes
  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log(`[AuthContext] Auth state changed:`, event);
    
    try {
      // Only update state if the session has actually changed
      if (JSON.stringify(session) !== JSON.stringify(newSession)) {
        setSession(newSession);
        setUser(newSession?.user as UserWithUUID ?? null);
      }
      
      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        console.log('[AuthContext] User signed in:', newSession?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('[AuthContext] User signed out');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('[AuthContext] Error in auth state change handler:', error);
      setLoading(false);
    }
  };

  // Initialize Supabase client on mount
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initSupabase = async () => {
      if (!isMounted) return;

      try {
        console.log('[AuthContext] Initializing Supabase client...');
        const client = getSupabaseClient();

        if (!client) {
          throw new Error('Failed to initialize Supabase client');
        }

        console.log('[AuthContext] Supabase client initialized');
        setSupabase(client);

        // Initialize auth state
        await initializeAuth(client);

      } catch (error) {
        console.error('[AuthContext] Error initializing Supabase:', error);
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    const initializeAuth = async (client: any) => {
      try {
        console.log('[AuthContext] Initializing auth state...');
        const { data: { session }, error } = await client.auth.getSession();
        
        if (error) throw error;
        
        console.log('[AuthContext] Initial session:', session ? 'found' : 'not found');
        await handleAuthStateChange('INITIAL_SESSION', session);
        
        // Set up auth state change listener
        const { data: { subscription } } = client.auth.onAuthStateChange(
          (event: string, newSession: Session | null) => {
            if (isMounted && typeof event === 'string') {
              handleAuthStateChange(event, newSession);
            }
          }
        );
        
        return () => {
          subscription?.unsubscribe();
        };
        
      } catch (error) {
        console.error('[AuthContext] Error initializing auth state:', error);
        throw error;
      }
    };

    initSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (!supabase) return;
    
    let mounted = true;

    const handleAuthStateChange = async (event: string, newSession: Session | null) => {
      if (!mounted) return;
      
      try {
        console.log(`[AuthContext] Auth state changed:`, event);
        
        // Only update state if the session has actually changed
        if (JSON.stringify(session) !== JSON.stringify(newSession)) {
          setSession(newSession);
          setUser(newSession?.user as UserWithUUID ?? null);
        }
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('[AuthContext] User signed in:', newSession?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] User signed out');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('[AuthContext] Error in auth state change handler:', error);
        setLoading(false);
      }
    };

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        console.log('[AuthContext] Initial session:', initialSession ? 'found' : 'not found');
        await handleAuthStateChange('INITIAL_SESSION', initialSession);
        
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (typeof event === 'string') {
              handleAuthStateChange(event, newSession);
            }
          }
        );
        
        return () => {
          console.log('[AuthContext] Cleaning up auth listener');
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        setLoading(false);
      }
    };
    
    const cleanup = initializeAuth();
    
    return () => {
      console.log('[AuthContext] Unmounting auth context');
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [supabase]);

  // Sign out function
  const signOut = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Determine the context value based on current state
  const contextValue: AuthContextType = (() => {
    if (!isInitialized || hasError) {
      return {
        user: null,
        session: null,
        loading: !hasError,
        signOut: async () => {}
      };
    }

    return {
      user,
      session,
      loading,
      signOut
    };
  })();

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}