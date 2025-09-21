import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[SIGNALS GENERATE] ===== STARTING REQUEST =====');

  try {
    const body = await request.json();
    console.log('[SIGNALS GENERATE] Request body:', body);

    // Simple mock response for now
    const mockResponse = {
      signals: [
        {
          id: 'generated-signal-1',
          symbol: body.symbol || 'BTC/USDT',
          timeframe: body.timeframe || '4h',
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0.1,
          signal_source: 'generated',
          type: 'entry',
          direction: 'BUY',
          strategyId: body.strategy_id || 'moderate',
          entry: 50000,
          tp1: 51000,
          tp2: 52000,
          stopLoss: 49000,
          source: { provider: 'generated_provider' },
          position_size: 1000,
          risk_amount: 100,
          reward_to_risk: 2.0
        }
      ],
      strategies: [
        {
          id: body.strategy_id || 'moderate',
          name: 'Generated Strategy',
          description: 'Generated signals'
        }
      ],
      portfolio_metrics: {
        total_position_size: 1000,
        total_risk_amount: 100,
        remaining_balance: 9900,
        avg_reward_to_risk: 2.0
      },
      risk_parameters: {
        initial_balance: body.initial_balance || 10000,
        risk_per_trade_pct: body.risk_per_trade || 1.0
      },
      _message: `Generated signals for strategy: ${body.strategy_id || 'moderate'}`
    };

    console.log('[SIGNALS GENERATE] ===== SENDING RESPONSE =====');

    return NextResponse.json(mockResponse, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('[SIGNALS GENERATE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}