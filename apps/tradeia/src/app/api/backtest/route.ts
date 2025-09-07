import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type BacktestParams = {
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  strategy_id: string;
  initial_balance: string;
  risk_per_trade: string;
};

export async function POST(request: Request) {
  console.log('[BACKTEST] ===== STARTING BACKTEST REQUEST =====');

  try {
    console.log('[BACKTEST] Verifying authentication...');

    // Verify authentication
    const cookieStore = await cookies();
    console.log('[BACKTEST] Available cookies:', cookieStore.getAll().map(c => c.name));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    console.log('[BACKTEST] Getting session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[BACKTEST] Session error:', sessionError);
      return NextResponse.json(
        { error: 'Session error', details: sessionError.message },
        { status: 401 }
      );
    }

    if (!session) {
      console.error('[BACKTEST] No session found');
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    if (!session.access_token) {
      console.error('[BACKTEST] Session found but no access token');
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    console.log('[BACKTEST] Session verified successfully, access token present');

    // Get request body
    const params: BacktestParams = await request.json();
    console.log('[BACKTEST] Request params:', params);

    // Validate required parameters (symbol can be empty for all symbols)
    const requiredParams = ['timeframe', 'start_date', 'end_date', 'strategy_id'];
    const missingParams = requiredParams.filter(param => !params[param as keyof BacktestParams]);

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }

    // Call the backtest service
    const apiUrl = `${process.env.SIGNALS_API_BASE}/backtest/run`;
    console.log('[BACKTEST] Calling external API:', apiUrl);
    console.log('[BACKTEST] Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token.substring(0, 20)}...` // Log partial token for security
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(params)
    });

    console.log('[BACKTEST] External API response status:', response.status);
    console.log('[BACKTEST] External API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.text();
      console.error('[BACKTEST] External API error response:', error);
      throw new Error(`Backtest service error (${response.status}): ${error}`);
    }

    const data = await response.json();
    console.log('[BACKTEST] External API success response:', data);
    console.log('[BACKTEST] ===== BACKTEST REQUEST COMPLETED =====');

    return NextResponse.json(data);

  } catch (error) {
    console.error('[BACKTEST] ===== BACKTEST ERROR =====');
    console.error('[BACKTEST] Error type:', typeof error);
    console.error('[BACKTEST] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[BACKTEST] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[BACKTEST] Environment variables check:');
    console.log('[BACKTEST] SIGNALS_API_BASE:', process.env.SIGNALS_API_BASE ? 'Set' : 'NOT SET');
    console.log('[BACKTEST] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'NOT SET');
    console.log('[BACKTEST] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'NOT SET');

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred during backtest',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
