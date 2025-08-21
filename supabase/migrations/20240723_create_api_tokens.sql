-- Create API tokens table
CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at TIMESTAMPTZ
);

-- Create index for faster token lookups
CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash);

-- Add RLS policies
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own tokens
CREATE POLICY "Users can view their own tokens" 
  ON api_tokens FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own tokens
CREATE POLICY "Users can insert their own tokens" 
  ON api_tokens FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own tokens
CREATE POLICY "Users can update their own tokens" 
  ON api_tokens FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own tokens
CREATE POLICY "Users can delete their own tokens" 
  ON api_tokens FOR DELETE 
  USING (auth.uid() = user_id);