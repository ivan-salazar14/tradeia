import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Cap at 100, default 20
  const offset = parseInt(searchParams.get('offset') || '0');

  console.log('[STRATEGIES API] ===== RETURNING MOCK STRATEGIES WITH AUTHENTICATION =====');
  console.log('[STRATEGIES API] User authenticated:', session.user?.email);

  // Return strategies in the format expected by the API documentation
  const mockStrategies = {
    conservative: {
      name: 'Conservative Strategy',
      description: 'Low-risk strategy with strict entry conditions',
      risk_level: 'conservative'
    },
    moderate: {
      name: 'Moderate Strategy',
      description: 'Balanced risk-reward strategy',
      risk_level: 'moderate'
    },
    aggressive: {
      name: 'Aggressive Strategy',
      description: 'High-risk strategy for maximum returns',
      risk_level: 'aggressive'
    },
    sqzmom_adx: {
      name: 'Squeeze Momentum ADX',
      description: 'Advanced strategy using squeeze momentum and ADX indicators',
      risk_level: 'moderate'
    },
    scenario_based: {
      name: 'Scenario Based Strategy',
      description: 'Dynamic strategy that adapts to market conditions',
      risk_level: 'moderate'
    },
    onda_3_5_alcista: {
      name: 'Onda 3/5 Alcista',
      description: 'Detecta oportunidades de compra en tendencias alcistas fuertes',
      risk_level: 'moderate'
    },
    onda_c_bajista: {
      name: 'Onda C Bajista',
      description: 'Detecta oportunidades de venta en tendencias bajistas fuertes',
      risk_level: 'moderate'
    },
    ruptura_rango: {
      name: 'Ruptura de Rango',
      description: 'Detecta rupturas de consolidación con momentum confirmado',
      risk_level: 'moderate'
    },
    reversion_patron: {
      name: 'Reversión por Patrón',
      description: 'Detecta patrones de reversión con confirmación técnica',
      risk_level: 'moderate'
    },
    gestion_riesgo: {
      name: 'Gestión de Riesgo',
      description: 'Gestión avanzada de riesgo con trailing stops dinámicos',
      risk_level: 'conservative'
    }
  };

  return NextResponse.json({
    strategies: mockStrategies,
    current_strategy: 'moderate'
  }, {
    headers: {
      'Cache-Control': 'private, max-age=600',
      'Accept-Encoding': 'identity' // Disable gzip compression
    }
  });
}

export async function POST(request: NextRequest) {
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

  console.log('[STRATEGIES API POST] ===== RETURNING MOCK RESPONSE WITH AUTHENTICATION =====');
  console.log('[STRATEGIES API POST] User authenticated:', session.user?.email);

  try {
    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Return mock success response without any authentication or database operations
    const mockStrategy = {
      id: `mock-${Date.now()}`,
      name: name || 'Mock Strategy',
      description: description || 'Mock strategy description',
      risk_level: risk_level || 'Medium',
      timeframe: timeframe || '4h',
      indicators: indicators || ['SMA', 'RSI'],
      stop_loss: stop_loss || 2,
      take_profit: take_profit || 4,
      max_positions: max_positions || 3,
      created_at: new Date().toISOString(),
      is_active: false
    };

    return NextResponse.json({
      message: 'Estrategia creada exitosamente (mock)',
      strategy: mockStrategy,
      _mock: true
    }, {
      status: 201,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });

  } catch (error) {
    console.error('Error in mock create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}