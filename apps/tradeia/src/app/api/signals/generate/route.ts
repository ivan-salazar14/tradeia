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
    let strategyId = body.strategy_id || 'moderate';
    console.log('[SIGNALS GENERATE] Strategy:', strategyId);

    // Define basic strategies that don't require permission checks
    const basicStrategies = ['conservative', 'moderate', 'aggressive','squeeze_momentum', 'breakout_momentum', 'advanced_ta', 'RangeDetection', 'range_detection'];
    const isBasicStrategy = basicStrategies.includes(strategyId);

    let hasAccess = false;
    let strategyError = null;
    let userStrategy = null;

    if (isBasicStrategy) {
      // Basic strategies are always accessible
      hasAccess = true;
      console.log('[SIGNALS GENERATE] Basic strategy access granted:', strategyId);
    } else {
      // Premium strategies require database permission check
      // First get the strategy UUID from the strategies table
      const { data: strategyRecord, error: strategyLookupError } = await supabase
        .from('strategies')
        .select('id')
        .eq('name', strategyId)
        .single();

      if (strategyLookupError || !strategyRecord) {
        strategyError = {
          message: `Strategy '${strategyId}' not found`,
          code: 'STRATEGY_NOT_FOUND',
          details: 'The requested strategy does not exist in the system'
        };
      } else {
        // Check if user has access to this premium strategy
        const { data: userStrategyData, error: userStrategyError } = await supabase
          .from('user_strategies')
          .select('strategy_id')
          .eq('user_id', user.id)
          .eq('strategy_id', strategyRecord.id)
          .eq('is_active', true)
          .single();

        hasAccess = !userStrategyError && !!userStrategyData;
        strategyError = userStrategyError;
        userStrategy = userStrategyData;
      }
    }

    console.log('[SIGNALS GENERATE] Strategy access validation result:', {
      userId: user.id,
      requestedStrategy: strategyId,
      isBasicStrategy,
      hasAccess,
      strategyError: strategyError ? {
        message: strategyError.message,
        code: strategyError.code,
        details: strategyError.details
      } : null,
      userStrategy: userStrategy
    });

    if (!hasAccess) {
      console.warn('[SIGNALS GENERATE] User does not have access to strategy:', strategyId, '- Error details:', strategyError);
      // Default to moderate strategy for premium strategies without access
      strategyId = 'moderate';
      console.log('[SIGNALS GENERATE] Defaulting to moderate strategy');
    } else {
      console.log('[SIGNALS GENERATE] User has access to strategy:', strategyId);
    }

    // Call external signals API for generation
    const apiUrl = `${process.env.SIGNALS_API_BASE}/signals/generate`;

    const requestBody = {
      symbol: body.symbol || 'BTC/USDT',
      timeframe: body.timeframe || '4h',
      start_date: body.start_date || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00',
      end_date: body.end_date || new Date().toISOString().split('T')[0] + 'T23:59:59',
      strategy_id: strategyId,
      initial_balance: body.initial_balance || 10000,
      risk_per_trade: body.risk_per_trade || 1.0,
      // Pool-specific parameters
      ...(body.protection_close_pct !== undefined && { protection_close_pct: body.protection_close_pct }),
      ...(body.hedge_coverage_pct !== undefined && { hedge_coverage_pct: body.hedge_coverage_pct })
    };

    console.log('[SIGNALS GENERATE] Calling external API:', apiUrl);
    console.log('[SIGNALS GENERATE] Request body:', requestBody);

    let data;
    try {
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
        console.error(`[SIGNALS GENERATE] External API error: ${response.status} - ${response.statusText}`);
        throw new Error(`External signals generation API returned ${response.status}: ${response.statusText}`);
      }

      data = await response.json();
      console.log('[SIGNALS GENERATE] External API response:', data);
    } catch (apiError) {
      console.log('[SIGNALS GENERATE] External API unavailable, falling back to mock data');
      
      // Handle multiple symbols - convert to array if string with commas
      let symbolsList: string[] = [];
      if (Array.isArray(body.symbol)) {
        symbolsList = body.symbol;
      } else if (typeof body.symbol === 'string' && body.symbol.includes(',')) {
        symbolsList = body.symbol.split(',').map((s: string) => s.trim());
      } else if (typeof body.symbol === 'string') {
        symbolsList = [body.symbol];
      } else {
        symbolsList = ['BTC/USDT'];
      }
      
      console.log('[SIGNALS GENERATE] Processing symbols:', symbolsList);
      
      // Check if requesting RangeDetection strategy - return specific mock data
      if (strategyId === 'RangeDetection' || strategyId === 'range_detection') {
        // Generate mock signals for each symbol
        const mockSignals = symbolsList.map((sym, index) => {
          // Different mock data for each symbol
          const mockData: Record<string, { entry: number; tp1: number; stopLoss: number; range_min: number; range_max: number; confidence: 'high' | 'medium' | 'low' }> = {
            'BTC/USDT': { entry: 60000, tp1: 61250, stopLoss: 58750, range_min: 58750, range_max: 61250, confidence: 'high' },
            'ETH/USDT': { entry: 3450, tp1: 3520, stopLoss: 3380, range_min: 3380, range_max: 3520, confidence: 'medium' },
            'LINK/USDT': { entry: 14.5, tp1: 15.2, stopLoss: 13.8, range_min: 13.8, range_max: 15.2, confidence: 'low' },
            'XRP/USDT': { entry: 0.62, tp1: 0.65, stopLoss: 0.59, range_min: 0.59, range_max: 0.65, confidence: 'high' },
            'LTC/USDT': { entry: 85, tp1: 88, stopLoss: 82, range_min: 82, range_max: 88, confidence: 'medium' },
            'SOL/USDT': { entry: 145, tp1: 152, stopLoss: 138, range_min: 138, range_max: 152, confidence: 'high' },
          };
          
          const data = mockData[sym] || { entry: 100 + index * 10, tp1: 105 + index * 10, stopLoss: 95 + index * 10, range_min: 95 + index * 10, range_max: 105 + index * 10, confidence: 'medium' as const };
          
          return {
            id: `generated-${Date.now()}-${index}`,
            symbol: sym,
            timeframe: requestBody.timeframe,
            timestamp: new Date().toISOString(),
            execution_timestamp: new Date().toISOString(),
            signal_age_hours: 0.1,
            signal_source: 'mock_generation',
            type: 'entry',
            direction: 'LONG',
            strategyId: 'RangeDetection',
            reason: `RANGO DETECTADO (${data.confidence.toUpperCase()}) — Pool: [${data.range_min} – ${data.range_max}] | ADX=18.5 < 23.0`,
            entry: data.entry,
            tp1: data.tp1,
            tp2: data.tp1 * 1.02,
            stopLoss: data.stopLoss,
            marketScenario: 'lateral',
            // Range Detection specific fields
            range_min: data.range_min,
            range_max: data.range_max,
            confidence: data.confidence,
            hedge_short: {
              entry_price: data.entry,
              stop_price: data.range_max,
              target_price: data.range_min,
              size_suggestion: '~10-20% del valor total del pool',
              risk_pct: 2.08,
              reward_pct: 2.08,
              rationale: `Short Market @ ${data.entry} | Stop Market @ ${data.range_max} (techo del rango) | Target @ ${data.range_min} (piso del rango)`
            },
            protection: requestBody.protection_close_pct ? {
              trigger_price: data.range_min,
              close_pct: requestBody.protection_close_pct,
              remaining_pct: 1 - requestBody.protection_close_pct,
              rationale: `Protección parcial: cerrar ${requestBody.protection_close_pct * 100}% al tocar ${data.range_min} (piso del rango)`
            } : undefined,
            source: { provider: 'mock_provider' },
            position_size: 1000,
            risk_amount: 100,
            reward_to_risk: 2.0
          };
        });
        
        data = {
          signals: mockSignals,
          portfolio_metrics: {
            total_position_size: 1000 * mockSignals.length,
            total_risk_amount: 100 * mockSignals.length,
            remaining_balance: Number(requestBody.initial_balance) - (100 * mockSignals.length),
            avg_reward_to_risk: 2.0
          },
          risk_parameters: {
            initial_balance: Number(requestBody.initial_balance),
            risk_per_trade_pct: Number(requestBody.risk_per_trade)
          },
          strategies: [
            {
              id: 'RangeDetection',
              name: 'Range Detection (Pool Liquidity)',
              description: 'Detects lateral ranges and generates signals for liquidity pools with hedge protection'
            }
          ]
        };
      } else {
        // Return standard mock data for other strategies - handle multiple symbols
        const mockSignals = symbolsList.map((sym, index) => ({
          id: `generated-${Date.now()}-${index}`,
          symbol: sym,
          timeframe: requestBody.timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0.1,
          signal_source: 'mock_generation',
          type: 'BUY',
          direction: 'LONG',
          strategyId: requestBody.strategy_id,
          entry: 45000 + index * 100,
          tp1: 46000 + index * 100,
          tp2: 47000 + index * 100,
          stopLoss: 44000 + index * 100,
          source: { provider: 'mock_provider' },
          position_size: 1000,
          risk_amount: 100,
          reward_to_risk: 2.0
        }));

        data = {
          signals: mockSignals,
          portfolio_metrics: {
            total_position_size: 1000 * mockSignals.length,
            total_risk_amount: 100 * mockSignals.length,
            remaining_balance: Number(requestBody.initial_balance) - (100 * mockSignals.length),
            avg_reward_to_risk: 2.0
          },
          risk_parameters: {
            initial_balance: Number(requestBody.initial_balance),
            risk_per_trade_pct: Number(requestBody.risk_per_trade)
          },
          strategies: [
            {
              id: requestBody.strategy_id,
              name: `${requestBody.strategy_id.charAt(0).toUpperCase() + requestBody.strategy_id.slice(1)} Strategy`,
              description: `Mock generated signals for ${requestBody.strategy_id} strategy`
            }
          ]
        };
      }
    }

    // Use the response from external API or mock data
    let transformedSignals = data.signals || [];
    
    // Calculate confidence for RangeDetection signals based on ADX or other metrics
    if (strategyId === 'RangeDetection' || strategyId === 'range_detection') {
      transformedSignals = transformedSignals.map((signal: any) => {
        // If confidence is already provided, use it
        if (signal.confidence && ['high', 'medium', 'low'].includes(signal.confidence.toLowerCase())) {
          return signal;
        }
        
        // Calculate confidence based on ADX in reason or other indicators
        let calculatedConfidence: 'high' | 'medium' | 'low' = 'medium';
        
        // Try to extract ADX from reason string (e.g., "ADX=18.5 < 23.0")
        const adxMatch = signal.reason?.match(/ADX[=<>]\s*(\d+\.?\d*)/i);
        if (adxMatch && adxMatch[1]) {
          const adx = parseFloat(adxMatch[1]);
          if (adx >= 25) {
            calculatedConfidence = 'high';
          } else if (adx >= 18) {
            calculatedConfidence = 'medium';
          } else {
            calculatedConfidence = 'low';
          }
        }
        
        // Also check if "HIGH", "MEDIUM", or "LOW" is in the reason
        if (signal.reason?.toUpperCase().includes('(HIGH)')) {
          calculatedConfidence = 'high';
        } else if (signal.reason?.toUpperCase().includes('(MEDIUM)')) {
          calculatedConfidence = 'medium';
        } else if (signal.reason?.toUpperCase().includes('(LOW)')) {
          calculatedConfidence = 'low';
        }
        
        return {
          ...signal,
          confidence: calculatedConfidence
        };
      });
    }
    
    const portfolioMetrics = data.portfolio_metrics;
    const riskParameters = data.risk_parameters;

    console.log('[SIGNALS GENERATE] ===== SENDING RESPONSE =====');

    return NextResponse.json({
      signals: transformedSignals,
      strategies: data.strategies,
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