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

    // Obtener todas las estrategias disponibles
    const { data: strategies, error: strategiesError } = await supabase
      .from('strategies')
      .select('*')
      .order('created_at', { ascending: false });

    if (strategiesError) {
      console.error('Error fetching strategies:', strategiesError);
      return NextResponse.json({ error: 'Error al obtener estrategias' }, { status: 500 });
    }

    // Obtener la estrategia actual del usuario
    const { data: userStrategy, error: userStrategyError } = await supabase
      .from('user_strategies')
      .select('strategy_id, is_active')
      .eq('user_id', session.user.id)
      .single();

    if (userStrategyError && userStrategyError.code !== 'PGRST116') {
      console.error('Error fetching user strategy:', userStrategyError);
      return NextResponse.json({ error: 'Error al obtener estrategia del usuario' }, { status: 500 });
    }

    return NextResponse.json({
      strategies: strategies || [],
      current_strategy: userStrategy || null
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validar datos requeridos
    if (!name || !description || !risk_level || !timeframe || !indicators || !Array.isArray(indicators)) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Crear nueva estrategia
    const { data: newStrategy, error: createError } = await supabase
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
        created_by: session.user.id
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating strategy:', createError);
      return NextResponse.json({ error: 'Error al crear estrategia' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Estrategia creada exitosamente',
      strategy: newStrategy
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}