"use client"

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

// Check if we're on the client side
export const isClient = typeof window !== 'undefined'

// Supabase client is now created synchronously

// Cookie configuration for Supabase auth
const cookieOptions = {
  name: 'sb-access-token',
  refreshName: 'sb-refresh-token',
  lifetime: 60 * 60 * 24 * 7, // 7 days
  domain: '',
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  get expires() {
    const date = new Date();
    date.setTime(date.getTime() + (this.lifetime * 1000));
    return date.toUTCString();
  }
};

export function getSupabaseClient() {
  // If we're on the server or already have an instance, return it
  if (!isClient) {
    console.warn('[Supabase] getSupabaseClient called on server side');
    return null;
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Client is created synchronously now

  // Create a new client synchronously
  try {
    console.log('[Supabase] Creating new client instance');
    const client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: 'pkce',
          storageKey: 'sb-access-token',
          storage: {
            getItem: (key: string): string | null => {
              if (typeof document === 'undefined') return null;
              try {
                const cookies = document.cookie.split('; ');
                const cookie = cookies.find(row => row.startsWith(`${key}=`));
                return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
              } catch (error) {
                console.error('[Supabase] Error reading cookie:', error);
                return null;
              }
            },
            setItem: (key: string, value: string): void => {
              if (typeof document === 'undefined') return;
              try {
                // Handle both access and refresh tokens
                if (key === 'sb-access-token') {
                  document.cookie = `${key}=${encodeURIComponent(value)};
                    expires=${cookieOptions.expires};
                    path=${cookieOptions.path};
                    ${cookieOptions.sameSite ? `samesite=${cookieOptions.sameSite};` : ''}
                    ${cookieOptions.secure ? 'secure;' : ''}`;
                } else if (key === 'sb-refresh-token') {
                  document.cookie = `${key}=${encodeURIComponent(value)};
                    expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()};
                    path=${cookieOptions.path};
                    ${cookieOptions.sameSite ? `samesite=${cookieOptions.sameSite};` : ''}
                    ${cookieOptions.secure ? 'secure;' : ''}`;
                }
              } catch (error) {
                console.error('[Supabase] Error setting cookie:', error);
              }
            },
            removeItem: (key: string): void => {
              if (typeof document === 'undefined') return;
              try {
                document.cookie = `${key}=; path=${cookieOptions.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
              } catch (error) {
                console.error('[Supabase] Error removing cookie:', error);
              }
            }
          }
        },
        cookies: {
          get(name: string) {
            try {
              const cookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith(`${name}=`));
              return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
            } catch (error) {
              console.error('[Supabase] Error reading cookie:', error);
              return null;
            }
          },
          set(name: string, value: string, options: any) {
            try {
              let maxAge = 60 * 60 * 24 * 7; // 7 days for access token
              if (name === 'sb-refresh-token') {
                maxAge = 60 * 60 * 24 * 30; // 30 days for refresh token
              }
              document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax; ${process.env.NODE_ENV === 'production' ? 'secure' : ''}`;
            } catch (error) {
              console.error('[Supabase] Error setting cookie:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              document.cookie = `${name}=; path=/; max-age=0`;
            } catch (error) {
              console.error('[Supabase] Error removing cookie:', error);
            }
          }
        }
      }
    );

    // Set the instance
    supabaseInstance = client;
    console.log('[Supabase] Client created successfully');
    return client;
  } catch (error) {
    console.error('[Supabase] Failed to create client:', error);
    return null;
  }
}

export const getSession = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Only create the instance on the client side
let supabase: ReturnType<typeof createBrowserClient<Database>> | null = null;
if (isClient) {
  supabase = getSupabaseClient();
}

export { supabase };