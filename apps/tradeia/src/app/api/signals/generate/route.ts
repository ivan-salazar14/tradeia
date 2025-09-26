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

    console.log('[SIGNALS GENERATE] Strategy access validation result:', {
      userId: user.id,
      requestedStrategy: strategyId,
      hasAccess: !strategyError && !!userStrategy,
      strategyError: strategyError ? {
        message: strategyError.message,
        code: strategyError.code,
        details: strategyError.details
      } : null,
      userStrategy: userStrategy
    });

    if (strategyError || !userStrategy) {
      console.warn('[SIGNALS GENERATE] User does not have access to strategy:', strategyId, '- Error details:', strategyError);
      // Default to moderate strategy
    } else {
      console.log('[SIGNALS GENERATE] User has access to strategy:', strategyId);
    }

    // Call external signals API for generation
    const apiUrl = `${process.env.SIGNALS_API_BASE}/signals/generate`;

    const requestBody = {
      symbol: body.symbol || 'BTC/USDT',
      timeframe: body.timeframe || '4h',
      strategy_id: strategyId,
      initial_balance: body.initial_balance || 10000,
      risk_per_trade: body.risk_per_trade || 1.0
    };

    console.log('[SIGNALS GENERATE] Calling external API:', apiUrl);
    console.log('[SIGNALS GENERATE] Request body:', requestBody);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`External signals generation API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[SIGNALS GENERATE] External API response:', data);

    // Use the response from external API directly
    const transformedSignals = data.signals || [];
    const portfolioMetrics = data.portfolio_metrics || {
      total_position_size: 0,
      total_risk_amount: 0,
      remaining_balance: body.initial_balance || 10000,
      avg_reward_to_risk: 0
    };
    const riskParameters = data.risk_parameters || {
      initial_balance: body.initial_balance || 10000,
      risk_per_trade_pct: body.risk_per_trade || 1.0
    };

    console.log('[SIGNALS GENERATE] ===== SENDING RESPONSE =====');

    return NextResponse.json({
      signals: transformedSignals,
      strategies: data.strategies || [
        {
          id: strategyId,
          name: `${strategyId.charAt(0).toUpperCase() + strategyId.slice(1)} Strategy`,
          description: `Generated signals for ${strategyId} strategy`
        }
      ],
      portfolio_metrics: portfolioMetrics,
      risk_parameters: riskParameters
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