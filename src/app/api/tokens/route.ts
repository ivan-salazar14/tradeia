import { NextRequest, NextResponse } from 'next/server';
import { createApiToken, listTokens } from '@/lib/tokens';
import { supabase } from '@/lib/supabase';

// GET /api/tokens - List all tokens for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const { data: { session }, error: sessionError } = await supabase?.auth.getSession() ?? { data: { session: null }, error: new Error('Supabase client is null') };
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    try {
      const tokens = await listTokens(userId);
      return NextResponse.json(tokens, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to list tokens: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error listing tokens:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tokens - Create a new token
export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const { data: { session }, error: sessionError } = await supabase?.auth.getSession() ?? { data: { session: null }, error: new Error('Supabase client is null') };
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { permissions, description, expiresInDays } = await request.json();
    
    // Validate permissions
    if (permissions && !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Permissions must be an array' },
        { status: 400 }
      );
    }
    
    // Create the token
    try {
      const tokenResult = await createApiToken({
        userId,
        description,
        permissions: permissions || ['read'],
        expiresInDays: expiresInDays || 90
      });
      
      return NextResponse.json({
        id: tokenResult.id,
        token: tokenResult.token, // Only time the raw token is returned
        description: tokenResult.description,
        permissions: tokenResult.permissions,
        createdAt: tokenResult.createdAt,
        expiresAt: tokenResult.expiresAt
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to create token: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}