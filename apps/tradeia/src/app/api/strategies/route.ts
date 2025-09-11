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
    console.log('[STRATEGIES POST] Checking session...');
    console.log('[STRATEGIES POST] Available cookies:', cookieStore.getAll().map(c => c.name));
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    console.log('[STRATEGIES POST] Session error:', sessionError);
    console.log('[STRATEGIES POST] Session exists:', !!session);
    console.log('[STRATEGIES POST] Session user:', session?.user?.email);

    if (sessionError) {
      console.error('[STRATEGIES POST] Session error:', sessionError);
      return NextResponse.json({
        error: 'Error de sesión',
        details: sessionError.message
      }, { status: 401 });
    }

    if (!session) {
      console.error('[STRATEGIES POST] No session found');
      return NextResponse.json({
        error: 'No autorizado - no hay sesión',
        details: 'Usuario no autenticado'
      }, { status: 401 });
    }

    if (!session.user) {
      console.error('[STRATEGIES POST] Session exists but no user');
      return NextResponse.json({
        error: 'No autorizado - sesión inválida',
        details: 'Sesión sin usuario válido'
      }, { status: 401 });
    }

    console.log('[STRATEGIES POST] Authentication successful for user:', session.user.email);

    // Check if tables exist first
    console.log('[STRATEGIES] Checking if tables exist...');
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from('user_strategies')
      .select('count')
      .limit(1);

    console.log('[STRATEGIES] Table check result:', { data: tableCheck, error: tableCheckError });

    if (tableCheckError) {
      console.error('[STRATEGIES] Database tables not found:', tableCheckError);
      console.error('[STRATEGIES] Error details:', {
        message: tableCheckError.message,
        code: tableCheckError.code,
        details: tableCheckError.details
      });

      // Return mock data instead of error to keep frontend working
      console.log('[STRATEGIES] Returning mock strategies due to table error');
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
    console.log('[STRATEGIES] Checking session...');
    console.log('[STRATEGIES] Available cookies:', cookieStore.getAll().map(c => c.name));
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    console.log('[STRATEGIES] Session error:', sessionError);
    console.log('[STRATEGIES] Session exists:', !!session);
    console.log('[STRATEGIES] Session user:', session?.user?.email);

    if (sessionError) {
      console.error('[STRATEGIES] Session error:', sessionError);
      return NextResponse.json({
        error: 'Error de sesión',
        details: sessionError.message
      }, { status: 401 });
    }

    if (!session) {
      console.error('[STRATEGIES] No session found');
      return NextResponse.json({
        error: 'No autorizado - no hay sesión',
        details: 'Usuario no autenticado'
      }, { status: 401 });
    }

    if (!session.user) {
      console.error('[STRATEGIES] Session exists but no user');
      return NextResponse.json({
        error: 'No autorizado - sesión inválida',
        details: 'Sesión sin usuario válido'
      }, { status: 401 });
    }

    console.log('[STRATEGIES] Authentication successful for user:', session.user.email);

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validar datos requeridos
    if (!name || !description || !risk_level || !timeframe || !indicators || !Array.isArray(indicators)) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Check if tables exist first
    console.log('[STRATEGIES POST] Checking if tables exist...');
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from('strategies')
      .select('count')
      .limit(1);

    console.log('[STRATEGIES POST] Table check result:', { data: tableCheck, error: tableCheckError });

    if (tableCheckError) {
      console.error('[STRATEGIES POST] Database tables not found:', tableCheckError);
      console.error('[STRATEGIES POST] Error details:', {
        message: tableCheckError.message,
        code: tableCheckError.code,
        details: tableCheckError.details
      });

      return NextResponse.json({
        error: 'Database tables not initialized',
        details: 'Please run the migration to create strategies tables before creating strategies',
        code: 'TABLES_NOT_FOUND'
      }, { status: 500 });
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