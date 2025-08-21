import { supabase } from './supabase';

/**
 * Generate a secure random API token using Web Crypto API
 * @returns A random token string
 */
export function generateToken(): string {
  // Use Web Crypto API instead of Node.js crypto module
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a token for secure storage using Web Crypto API
 * @param token The token to hash
 * @returns The hashed token
 */
export async function hashToken(token: string): Promise<string> {
  // Convert the token string to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  
  // Use Web Crypto API to hash the token
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new API token for a user
 * @param params Object containing token creation parameters
 * @param params.userId The user ID
 * @param params.description A description of the token's purpose
 * @param params.permissions Array of permissions (e.g., ['read', 'write'])
 * @param params.expiresInDays Number of days until the token expires
 * @returns The token and token data if successful, throws error otherwise
 */
export async function createApiToken(params: {
  userId: string;
  description?: string;
  permissions?: string[];
  expiresInDays?: number;
}) {
  const {
    userId,
    description = 'API Token',
    permissions = ['read'],
    expiresInDays = 90
  } = params;

  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    // Generate a new token
    const token = generateToken();
    const tokenHash = await hashToken(token);

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Insert the token into the database
    const { data, error } = await supabase
      .from('api_tokens')
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        description: description,
        permissions: permissions,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating API token:', error);
      throw new Error(`Failed to create API token: ${error.message}`);
    }

    return {
      token,
      id: data.id,
      description: data.description,
      permissions: data.permissions,
      createdAt: data.created_at,
      expiresAt: data.expires_at
    };
  } catch (error) {
    console.error('Error in createApiToken:', error);
    throw new Error(`Failed to create API token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate an API token
 * @param token The token to validate
 * @returns The token data if valid, null otherwise
 */
export async function validateToken(token: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const tokenHash = await hashToken(token);

    // Find the token in the database
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('revoked', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    // Update last used timestamp
    await supabase
      .from('api_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    // Return only the necessary data
    return {
      id: data.id,
      user_id: data.user_id,
      permissions: data.permissions
    };
  } catch (error) {
    console.error('Error in validateToken:', error);
    return null;
  }
}

/**
 * Revoke an API token
 * @param tokenId The ID of the token to revoke
 * @param userId The user ID (for authorization)
 * @returns void if successful, throws error otherwise
 */
export async function revokeToken(tokenId: string, userId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { error } = await supabase
      .from('api_tokens')
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
      })
      .eq('id', tokenId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to revoke token: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in revokeToken:', error);
    throw new Error(`Failed to revoke token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all active API tokens for a user
 * @param userId The user ID
 * @returns Array of formatted token records
 */
export async function listTokens(userId: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  try {
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('revoked', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error listing API tokens:', error);
      throw new Error(`Failed to list tokens: ${error.message}`);
    }

    // Format the token data for the client
    return (data || []).map(token => ({
      id: token.id,
      description: token.description,
      permissions: token.permissions,
      createdAt: token.created_at,
      expiresAt: token.expires_at,
      lastUsedAt: token.last_used_at
    }));
  } catch (error) {
    console.error('Error in listTokens:', error);
    throw new Error(`Failed to list tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}