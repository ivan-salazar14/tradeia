import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useState } from 'react';

const supabase = createBrowserSupabaseClient<Database>();

export const useSupabase = () => {
  return { supabase };
};
