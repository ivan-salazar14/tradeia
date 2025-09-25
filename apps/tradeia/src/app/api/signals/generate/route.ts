import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log('[SIGNALS GENERATE] ===== STARTING SIGNAL GENERATION =====');


  // Check for Bearer token authentication
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header. Use Bearer token.' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Extract token from Bearer header
  const token = auth.substring(7); // Remove 'Bearer ' prefix
  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Invalid Bearer token' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Setup Supabase client for authentication
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );

  // Authenticate user with token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity'
      }
    });
  }

  try {
    const body = await request.json();
    console.log('[SIGNALS GENERATE] Request body:', body);
    // Get strategy from request
    const strategyId = body.strategy_id || 'moderate';
    console.log('[SIGNALS GENERATE] Strategy:', strategyId);

    // Validate strategy exists and user has access
    const { data: userStrategy, error: strategyError } = await supabase
      .from('user_strategies')
      .select('strategy_id')
      .eq('user_id', user.id)
      .eq('strategy_id', strategyId)
      .eq('is_active', true)
      .single();

    if (strategyError || !userStrategy) {
      console.warn('[SIGNALS GENERATE] User does not have access to strategy:', strategyId);
      // Default to moderate strategy
    }

    // Generate mock signals (in production, this would use actual trading algorithms)
    const generatedSignals = [
      {
        symbol: body.symbol || 'BTC/USDT',
        timeframe: body.timeframe || '4h',
        timestamp: new Date().toISOString(),
        execution_timestamp: new Date().toISOString(),
        signal_age_hours: 0.1,
        signal_source: 'generated',
        type: 'entry',
        direction: 'BUY',
        strategy_id: strategyId,
        entry: 50000 + Math.random() * 1000, // Random price around 50k
        tp1: 51000 + Math.random() * 1000,
        tp2: 52000 + Math.random() * 1000,
        stop_loss: 49000 + Math.random() * 1000,
        source: { provider: 'internal_generator' },
        position_size: 1000,
        risk_amount: 100,
        reward_to_risk: 2.0
      },
      {
        symbol: body.symbol || 'ETH/USDT',
        timeframe: body.timeframe || '4h',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
        signal_age_hours: 1.0,
        signal_source: 'generated',
        type: 'entry',
        direction: 'SELL',
        strategy_id: strategyId,
        entry: 3000 + Math.random() * 200,
        tp1: 2900 + Math.random() * 200,
        tp2: 2800 + Math.random() * 200,
        stop_loss: 3100 + Math.random() * 200,
        source: { provider: 'internal_generator' },
        position_size: 2000,
        risk_amount: 60,
        reward_to_risk: 1.8
      }
    ];

    // Skip database storage for now - return mock response directly
    // TODO: Re-enable database storage once schema is updated
    console.log('[SIGNALS GENERATE] Skipping database storage - returning mock response');

    // Calculate portfolio metrics
    const portfolioMetrics = {
      total_position_size: generatedSignals.reduce((sum, signal) => sum + (signal.position_size || 0), 0),
      total_risk_amount: generatedSignals.reduce((sum, signal) => sum + (signal.risk_amount || 0), 0),
      remaining_balance: 10000 - generatedSignals.reduce((sum, signal) => sum + (signal.risk_amount || 0), 0),
      avg_reward_to_risk: generatedSignals.reduce((sum, signal) => sum + (signal.reward_to_risk || 0), 0) / generatedSignals.length
    };

    const riskParameters = {
      initial_balance: body.initial_balance || 10000,
      risk_per_trade_pct: body.risk_per_trade || 1.0
    };

    // Transform signals for response (use generated signals directly)
    const transformedSignals = generatedSignals.map((signal, index) => ({
      id: `generated-${Date.now()}-${index}`,
      symbol: signal.symbol,
      timeframe: signal.timeframe,
      timestamp: signal.timestamp,
      execution_timestamp: signal.execution_timestamp,
      signal_age_hours: signal.signal_age_hours,
      signal_source: signal.signal_source,
      type: signal.type,
      direction: signal.direction,
      strategyId: signal.strategy_id,
      entry: signal.entry,
      tp1: signal.tp1,
      tp2: signal.tp2,
      stopLoss: signal.stop_loss,
      source: signal.source,
      position_size: signal.position_size,
      risk_amount: signal.risk_amount,
      reward_to_risk: signal.reward_to_risk
    }));

    console.log('[SIGNALS GENERATE] ===== SENDING RESPONSE =====');

    return NextResponse.json({
      signals: transformedSignals,
      strategies: [
        {
          id: strategyId,
          name: `${strategyId.charAt(0).toUpperCase() + strategyId.slice(1)} Strategy`,
          description: `Generated signals for ${strategyId} strategy`
        }
      ],
      portfolio_metrics: portfolioMetrics,
      risk_parameters: riskParameters,
      _message: `Successfully generated signals for ${strategyId} strategy`,
      _mock: true
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('[SIGNALS GENERATE] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}