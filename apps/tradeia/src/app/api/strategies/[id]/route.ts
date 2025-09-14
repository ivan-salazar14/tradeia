import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

  const strategyId = params.id;
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
  { params }: { params: { id: string } }
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

  const strategyId = params.id;
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
    const validStrategies = ['conservative', 'moderate', 'aggressive'];
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