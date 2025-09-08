
-- Create the table to store user API keys
CREATE TABLE public.user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    exchange TEXT NOT NULL,
    api_key TEXT NOT NULL, -- Encrypted
    api_secret TEXT NOT NULL, -- Encrypted
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow users to manage their own API keys"
ON public.user_api_keys
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on row update
CREATE TRIGGER update_user_api_keys_updated_at
BEFORE UPDATE ON public.user_api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments to the table and columns
COMMENT ON TABLE public.user_api_keys IS 'Stores API keys for users to connect to exchanges.';
COMMENT ON COLUMN public.user_api_keys.api_key IS 'Encrypted API key.';
COMMENT ON COLUMN public.user_api_keys.api_secret IS 'Encrypted API secret.';
