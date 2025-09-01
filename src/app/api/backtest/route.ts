import { createClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type BacktestParams = {
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  strategy: string;
  initial_balance: string;
  risk_per_trade: string;
};

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const params: BacktestParams = await request.json();

    // Validate required parameters
    const requiredParams = ['symbol', 'timeframe', 'start_date', 'end_date', 'strategy'];
    const missingParams = requiredParams.filter(param => !params[param as keyof BacktestParams]);

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }

    // Call the backtest service
    const response = await fetch(
      `${process.env.SIGNALS_API_BASE}/backtest/run`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(params)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Backtest service error: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Backtest error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred during backtest' },
      { status: 500 }
    );
  }
}
