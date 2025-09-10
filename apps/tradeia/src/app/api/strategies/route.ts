import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

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

    // Verificar la sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener estrategias del usuario
    const { data: userStrategies, error: userStrategiesError } = await supabase
      .from('user_strategies')
      .select(`
        strategy_id,
        is_active,
        strategies (
          id,
          name,
          description,
          risk_level,
          timeframe,
          indicators,
          stop_loss,
          take_profit,
          max_positions,
          created_at
        )
      `)
      .eq('user_id', session.user.id);

    if (userStrategiesError) {
      console.error('Error fetching user strategies:', userStrategiesError);
      return NextResponse.json({ error: 'Error al obtener estrategias' }, { status: 500 });
    }

    // Si no hay estrategias del usuario, devolver estrategias por defecto
    if (!userStrategies || userStrategies.length === 0) {
      const mockStrategies = [
        {
          id: 'conservative',
          name: 'Conservative Strategy',
          description: 'Low-risk strategy with basic technical indicators',
          risk_level: 'Low',
          timeframe: '4h',
          indicators: ['SMA', 'RSI'],
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 'moderate',
          name: 'Moderate Strategy',
          description: 'Balanced risk strategy with multiple indicators',
          risk_level: 'Medium',
          timeframe: '1h',
          indicators: ['SMA', 'RSI', 'MACD'],
          created_at: new Date().toISOString(),
          is_active: false
        },
        {
          id: 'sqzmom_adx',
          name: 'ADX Squeeze Momentum',
          description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation',
          risk_level: 'Medium',
          timeframe: '4h',
          indicators: ['ADX', 'Squeeze Momentum'],
          created_at: new Date().toISOString(),
          is_active: false
        },
        {
          id: 'aggressive',
          name: 'Aggressive Strategy',
          description: 'High-risk strategy for experienced traders',
          risk_level: 'High',
          timeframe: '15m',
          indicators: ['RSI', 'MACD', 'Bollinger Bands'],
          created_at: new Date().toISOString(),
          is_active: false
        }
      ];

      return NextResponse.json({
        strategies: mockStrategies,
        current_strategy: { strategy_id: 'conservative' }
      });
    }

    // Formatear las estrategias del usuario
    const strategies = userStrategies.map(userStrategy => ({
      ...userStrategy.strategies,
      is_active: userStrategy.is_active
    }));

    // Encontrar la estrategia activa
    const currentStrategy = userStrategies.find(us => us.is_active);

    return NextResponse.json({
      strategies,
      current_strategy: currentStrategy ? { strategy_id: currentStrategy.strategy_id } : null
    });

  } catch (error) {
    console.error('Error in strategies API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authHeader = request.headers.get('authorization');

    let supabase;
    let session;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Handle Bearer token authentication
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      supabase = createServerClient(
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
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );

      // Get user from token
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }

      // Create a session-like object
      session = { user };
    } else {
      // Handle cookie-based authentication
      supabase = createServerClient(
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

      // Verificar la sesión
      const { data: { session: cookieSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !cookieSession) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }

      session = cookieSession;
    }

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validar datos requeridos
    if (!name || !description || !risk_level || !timeframe || !indicators || !Array.isArray(indicators)) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Crear la estrategia en la base de datos
    const { data: strategy, error: createError } = await supabase
      .from('strategies')
      .insert({
        name,
        description,
        risk_level,
        timeframe,
        indicators: JSON.stringify(indicators),
        stop_loss: stop_loss || 2,
        take_profit: take_profit || 4,
        max_positions: max_positions || 3,
        user_id: session.user.id
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating strategy:', createError);
      return NextResponse.json({ error: 'Error al crear estrategia' }, { status: 500 });
    }

    // Crear la relación usuario-estrategia
    const { error: userStrategyError } = await supabase
      .from('user_strategies')
      .insert({
        user_id: session.user.id,
        strategy_id: strategy.id,
        is_active: false // Nueva estrategia no activa por defecto
      });

    if (userStrategyError) {
      console.error('Error creating user strategy relation:', userStrategyError);
      // No devolver error aquí, la estrategia ya se creó
    }

    return NextResponse.json({
      message: 'Estrategia creada exitosamente',
      strategy: {
        ...strategy,
        indicators: JSON.parse(strategy.indicators),
        is_active: false
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}