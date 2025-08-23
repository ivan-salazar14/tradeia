-- Add subscription_plan and active_strategies to users table
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS active_strategies TEXT[] DEFAULT '{}';

-- Create or replace the function that generates the JWT claims
CREATE OR REPLACE FUNCTION public.get_user_jwt_claims()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  claims jsonb;
BEGIN
  -- Get the current user's data
  SELECT 
    id::text as sub,
    email,
    subscription_plan,
    active_strategies,
    extract(epoch from (now() + interval '1 day'))::integer as exp
  INTO user_record
  FROM auth.users
  WHERE id = auth.uid();

  -- Build the claims object
  claims := jsonb_build_object(
    'sub', user_record.sub,
    'email', user_record.email,
    'subscription_plan', COALESCE(user_record.subscription_plan, 'free'),
    'active_strategies', COALESCE(user_record.active_strategies, '{}'::text[]),
    'exp', user_record.exp
  );

  RETURN claims;
END;
$$;

 -- Note: Supabase access tokens are issued by GoTrue. You cannot inject custom top-level JWT claims via PostgREST GUCs.
 -- If you need custom fields in the token, store them in auth.users.raw_user_meta_data (user_metadata) so they appear in the JWT,
 -- or issue an application-specific JWT from your backend.
