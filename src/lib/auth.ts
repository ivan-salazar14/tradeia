import { supabase } from './supabase';
import { JWTPayload } from '@/types/jwt';

export const getSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  const meta = session?.user?.user_metadata;
console.log(meta?.subscription_plan, meta?.active_strategies);

  return session;
};

export const getJWTClaims = async (): Promise<JWTPayload | null> => {
  const session = await getSession();
  if (!session) return null;
  
  // Get the JWT token
  const token = session.access_token;
  if (!token) return null;
  
  try {
    // Decode the JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Example usage:
// const claims = await getJWTClaims();
// if (claims) {
//   console.log('User subscription plan:', claims.subscription_plan);
//   console.log('Active strategies:', claims.active_strategies);
// }
