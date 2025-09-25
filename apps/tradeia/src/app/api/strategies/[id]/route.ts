import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Setup Supabase client for session validation
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (name === `sb-${projectRef}-auth-token`) {
            return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
          }
          if (name === `sb-${projectRef}-refresh-token`) {
            return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore in server context
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
            // Ignore in server context
          }
        },
      },
    }
  );

  // Validate user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Usuario no autenticado' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  const strategyId = (await params).id;
  console.log(`[STRATEGIES API] ===== GETTING STRATEGY DETAILS FOR: ${strategyId} =====`);
  console.log('[STRATEGIES API] User authenticated:', session.user?.email);

  // Mock strategy details based on the API documentation
  const strategyDetails: Record<string, any> = {
    conservative: {
      id: 'conservative',
      name: 'Conservative Strategy',
      description: 'Low-risk strategy with strict entry conditions',
      risk_level: 'conservative',
      timeframe: '4h',
      indicators: ['SMA', 'RSI'],
      is_active: true,
      created_at: new Date().toISOString(),
      stop_loss: 2,
      take_profit: 4,
      max_positions: 3,
      criteria: 'RSI < 30, ADX > 25, SQZMOM > 1780, strict trend confirmation'
    },
    moderate: {
      id: 'moderate',
      name: 'Moderate Strategy',
      description: 'Balanced risk-reward strategy',
      risk_level: 'moderate',
      timeframe: '1h',
      indicators: ['SMA', 'RSI', 'MACD'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 2.5,
      take_profit: 5,
      max_positions: 4,
      criteria: 'RSI < 35, ADX > 22, SQZMOM > 1750, moderate trend confirmation'
    },
    aggressive: {
      id: 'aggressive',
      name: 'Aggressive Strategy',
      description: 'High-risk strategy for maximum returns',
      risk_level: 'aggressive',
      timeframe: '15m',
      indicators: ['RSI', 'MACD', 'Bollinger Bands'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 1.5,
      take_profit: 3,
      max_positions: 5,
      criteria: 'RSI < 40, ADX > 20, SQZMOM > 1700, flexible trend confirmation'
    },
    sqzmom_adx: {
      id: 'sqzmom_adx',
      name: 'Squeeze Momentum ADX',
      description: 'Advanced strategy using squeeze momentum and ADX indicators',
      risk_level: 'moderate',
      timeframe: '1h',
      indicators: ['SQZMOM', 'ADX', 'RSI'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 2.0,
      take_profit: 4.5,
      max_positions: 4,
      criteria: 'SQZMOM > 1750, ADX > 25, RSI between 30-70, momentum confirmation'
    },
    scenario_based: {
      id: 'scenario_based',
      name: 'Scenario Based Strategy',
      description: 'Dynamic strategy that adapts to market conditions',
      risk_level: 'moderate',
      timeframe: '4h',
      indicators: ['SMA', 'RSI', 'MACD', 'ADX'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 2.5,
      take_profit: 5.0,
      max_positions: 5,
      criteria: 'Adaptive criteria based on market volatility and trend strength'
    },
    onda_3_5_alcista: {
      id: 'onda_3_5_alcista',
      name: 'Onda 3/5 Alcista',
      description: 'Detecta oportunidades de compra en tendencias alcistas fuertes',
      risk_level: 'moderate',
      timeframe: '4h',
      indicators: ['Elliott Wave', 'RSI', 'MACD'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 2.0,
      take_profit: 6.0,
      max_positions: 3,
      criteria: 'Wave 3/5 pattern, RSI > 50, MACD positive, strong uptrend confirmation'
    },
    onda_c_bajista: {
      id: 'onda_c_bajista',
      name: 'Onda C Bajista',
      description: 'Detecta oportunidades de venta en tendencias bajistas fuertes',
      risk_level: 'moderate',
      timeframe: '4h',
      indicators: ['Elliott Wave', 'RSI', 'MACD'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 2.0,
      take_profit: 6.0,
      max_positions: 3,
      criteria: 'Wave C pattern, RSI < 50, MACD negative, strong downtrend confirmation'
    },
    ruptura_rango: {
      id: 'ruptura_rango',
      name: 'Ruptura de Rango',
      description: 'Detecta rupturas de consolidación con momentum confirmado',
      risk_level: 'moderate',
      timeframe: '1h',
      indicators: ['Bollinger Bands', 'Volume', 'RSI'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 1.5,
      take_profit: 4.0,
      max_positions: 4,
      criteria: 'Price breakout from range, volume confirmation, RSI divergence'
    },
    reversion_patron: {
      id: 'reversion_patron',
      name: 'Reversión por Patrón',
      description: 'Detecta patrones de reversión con confirmación técnica',
      risk_level: 'moderate',
      timeframe: '4h',
      indicators: ['Chart Patterns', 'RSI', 'Fibonacci'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 1.0,
      take_profit: 3.0,
      max_positions: 5,
      criteria: 'Reversal patterns (head & shoulders, double top/bottom), RSI oversold/overbought'
    },
    gestion_riesgo: {
      id: 'gestion_riesgo',
      name: 'Gestión de Riesgo',
      description: 'Gestión avanzada de riesgo con trailing stops dinámicos',
      risk_level: 'conservative',
      timeframe: '1h',
      indicators: ['ATR', 'Trailing Stop', 'Risk Management'],
      is_active: false,
      created_at: new Date().toISOString(),
      stop_loss: 1.0,
      take_profit: 2.0,
      max_positions: 2,
      criteria: 'Dynamic trailing stops, position sizing based on volatility, strict risk limits'
    }
  };

  const strategy = strategyDetails[strategyId];

  if (!strategy) {
    return NextResponse.json({
      error: `Strategy '${strategyId}' not found`
    }, {
      status: 404,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  return NextResponse.json({
    strategy: strategy
  }, {
    headers: {
      'Cache-Control': 'private, max-age=600',
      'Accept-Encoding': 'identity' // Disable gzip compression
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  // Setup Supabase client for session validation
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (name === `sb-${projectRef}-auth-token`) {
            return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
          }
          if (name === `sb-${projectRef}-refresh-token`) {
            return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
          }
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore in server context
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
            // Ignore in server context
          }
        },
      },
    }
  );

  // Validate user session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Usuario no autenticado' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  const strategyId = (await params).id;
  console.log(`[STRATEGIES UPDATE API] ===== UPDATING STRATEGY: ${strategyId} =====`);
  console.log('[STRATEGIES UPDATE API] User authenticated:', session.user?.email);

  try {
    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({
        error: 'Name and description are required'
      }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    // Validate strategy exists
    const validStrategies = ['conservative', 'moderate', 'aggressive', 'sqzmom_adx', 'scenario_based', 'onda_3_5_alcista', 'onda_c_bajista', 'ruptura_rango', 'reversion_patron', 'gestion_riesgo'];
    if (!validStrategies.includes(strategyId)) {
      return NextResponse.json({
        error: `Strategy '${strategyId}' not found`
      }, {
        status: 404,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    // Mock update response
    const updatedStrategy = {
      id: strategyId,
      name: name || 'Updated Strategy',
      description: description || 'Updated description',
      risk_level: risk_level || 'moderate',
      timeframe: timeframe || '4h',
      indicators: indicators || ['SMA', 'RSI'],
      is_active: true,
      created_at: new Date().toISOString(),
      stop_loss: stop_loss || 2,
      take_profit: take_profit || 4,
      max_positions: max_positions || 3
    };

    return NextResponse.json({
      message: `Strategy '${strategyId}' updated successfully`,
      strategy: updatedStrategy
    }, {
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });

  } catch (error) {
    console.error('[STRATEGIES UPDATE API] Error:', error);
    return NextResponse.json({
      error: 'Invalid JSON in request body'
    }, {
      status: 400,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }
}