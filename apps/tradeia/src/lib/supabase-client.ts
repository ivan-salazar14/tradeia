import { getSupabaseClient } from '@/lib/supabase-singleton';
import { Database } from '@/types/supabase';
import { useState } from 'react';

export function createClient() {
  return getSupabaseClient();
}

export const useSupabase = () => {
  const [supabase] = useState(() => getSupabaseClient());
  return { supabase };
};
