import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notificationService } from '@/lib/services/NotificationService';

// This endpoint runs as a background listener for database notifications
// It should be called periodically or run as a background service

export async function GET(request: NextRequest) {
  console.log('[NotificationListener] Starting notification listener...');

  try {
    // Create a Supabase client for listening to database notifications
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[NotificationListener] Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    // Create admin client for database notifications
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Set up listener for new signal notifications
    const channel = supabaseAdmin
      .channel('new_signal_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signals'
        },
        async (payload) => {
          console.log('[NotificationListener] New signal detected:', payload);

          try {
            // Extract signal data from the payload
            const signalData = {
              signal_id: payload.new.id,
              symbol: payload.new.symbol,
              signal_direction: payload.new.signal_direction,
              strategy_id: payload.new.strategy_id,
              timestamp: payload.new.timestamp
            };

            // Process the notification
            await notificationService.processNewSignal(signalData);

          } catch (error) {
            console.error('[NotificationListener] Error processing signal notification:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('[NotificationListener] Subscription status:', status);
      });

    // Keep the connection alive for a short time to listen for events
    // In production, this would run as a persistent background service
    setTimeout(() => {
      console.log('[NotificationListener] Listener timeout reached, unsubscribing...');
      supabaseAdmin.removeChannel(channel);
    }, 30000); // 30 seconds

    return NextResponse.json({
      message: 'Notification listener started',
      status: 'listening',
      timeout: 30000
    });

  } catch (error) {
    console.error('[NotificationListener] Error starting listener:', error);
    return NextResponse.json(
      {
        error: 'Failed to start notification listener',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Alternative POST endpoint for manual triggering (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signalData } = body;

    if (!signalData) {
      return NextResponse.json(
        { error: 'signalData is required' },
        { status: 400 }
      );
    }

    console.log('[NotificationListener] Manual trigger for signal:', signalData);

    await notificationService.processNewSignal(signalData);

    return NextResponse.json({
      message: 'Notification processed manually',
      signalData
    });

  } catch (error) {
    console.error('[NotificationListener] Error in manual trigger:', error);
    return NextResponse.json(
      {
        error: 'Failed to process manual notification',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}