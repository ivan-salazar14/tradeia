import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/tokens';
import { supabase } from '@/lib/supabase';

/**
 * Webhook endpoint for receiving signals from external providers
 * This endpoint validates the API token and processes incoming signals
 */
export async function POST(request: NextRequest) {
  try {
    // Get the API token from the X-API-Key header
    const apiKey = request.headers.get('X-API-Key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API token is required' }, { status: 401 });
    }
    
    // Validate the token
    let tokenData;
    try {
      tokenData = await validateToken(apiKey);
      
      if (!tokenData) {
        return NextResponse.json({ error: 'Invalid or expired API token' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Error validating token' }, { status: 401 });
    }
    
    // Check if the token has the required permissions
    const permissions = tokenData.permissions || [];
    if (!permissions.includes('write')) {
      return NextResponse.json({ error: 'Token does not have write permission' }, { status: 403 });
    }
    
    // Parse the signal data
    const signalData = await request.json();
    
    // Validate required fields
    const requiredFields = ['symbol', 'type', 'entry', 'takeProfit', 'stopLoss'];
    for (const field of requiredFields) {
      if (!signalData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Add metadata to the signal
    const enrichedSignalData = {
      ...signalData,
      provider_id: tokenData.user_id,
      received_at: new Date().toISOString(),
      status: 'received'
    };
    
    // Store the signal in the database
    // Note: In a real implementation, you would have a signals table
    // This is a placeholder for the actual implementation
    const { data, error } = await supabase!
      .from('signals')
      .insert(enrichedSignalData)
      .select()
      .single();
    
    if (error) {
      console.error('Error storing signal:', error);
      return NextResponse.json(
        { error: 'Failed to store signal' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Signal received successfully',
      signalId: data.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}