import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../tokens';

/**
 * Middleware to validate API tokens for protected routes
 * @param request The incoming request
 * @returns NextResponse or null if the request should continue
 */
export async function validateApiToken(request: NextRequest) {
  // Skip validation for non-API routes or routes that don't require token auth
  if (!request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/webhook/')) {
    return null;
  }
  
  // Check for token in Authorization header or X-API-Key header
  const authHeader = request.headers.get('Authorization');
  const apiKeyHeader = request.headers.get('X-API-Key');
  
  let token: string | null = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (apiKeyHeader) {
    token = apiKeyHeader;
  }
  
  if (!token) {
    return NextResponse.json({ error: 'API token is required' }, { status: 401 });
  }
  
  // Validate the token
  let tokenData;
  try {
    tokenData = await validateToken(token);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid or expired API token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Error validating token: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 401 }
    );
  }
  
  // Add the token data to the request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-Token-User-ID', tokenData.user_id);
  requestHeaders.set('X-Token-Permissions', JSON.stringify(tokenData.permissions));
  
  // Continue with the modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}