import { NextRequest, NextResponse } from 'next/server';
// Removed invalid RouteHandlerContext import
import { revokeToken } from '@/lib/tokens';
import { supabase } from '@/lib/supabase';

// DELETE /api/tokens/[tokenId] - Revoke a token
export async function DELETE(
  request: NextRequest,
  context: { params: { tokenId: string } }
) {
  try {
    const tokenId = context.params.tokenId;
    
    if (!tokenId) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }
    
    // Get the current user from the session
    const { data: { session }, error: sessionError } = await supabase?.auth.getSession() ?? { data: { session: null }, error: new Error('Supabase client is not initialized') };
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Revoke the token
    try {
      await revokeToken(tokenId, userId);
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to revoke token: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Token revoked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error revoking token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}