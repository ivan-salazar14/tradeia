import { User } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface User {
    user_metadata?: {
      email: string;
      subscription_plan: string;
      active_strategies: string[];
    };
  }
}

export interface JWTPayload {
  sub: string;                // User ID
  email: string;              // User email
  subscription_plan: string;  // User's subscription plan
  active_strategies: string[]; // User's active strategies
  exp: number;                // Expiration timestamp
}
