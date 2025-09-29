import { getSupabaseClient, useSupabase } from './supabase/client';

export function createClient() {
  return getSupabaseClient();
}

export { getSupabaseClient, useSupabase };
