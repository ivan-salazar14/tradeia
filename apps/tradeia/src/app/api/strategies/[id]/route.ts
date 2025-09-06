import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const strategyId = context.params.id;
    
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

    // Obtener la estrategia específica
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .single();

    if (strategyError) {
      if (strategyError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Estrategia no encontrada' }, { status: 404 });
      }
      console.error('Error fetching strategy:', strategyError);
      return NextResponse.json({ error: 'Error al obtener estrategia' }, { status: 500 });
    }

    // Obtener señales recientes para esta estrategia
    const { data: signals, error: signalsError } = await supabase
      .from('signals')
      .select('*')
      .eq('strategy_id', strategyId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (signalsError) {
      console.error('Error fetching signals:', signalsError);
    }

    // Obtener métricas de performance
    const { data: performance, error: performanceError } = await supabase
      .from('strategy_performance')
      .select('*')
      .eq('strategy_id', strategyId)
      .single();

    if (performanceError && performanceError.code !== 'PGRST116') {
      console.error('Error fetching performance:', performanceError);
    }

    // Verificar si el usuario tiene esta estrategia activa
    const { data: userStrategy, error: userStrategyError } = await supabase
      .from('user_strategies')
      .select('is_active')
      .eq('user_id', session.user.id)
      .eq('strategy_id', strategyId)
      .single();

    const isActive = userStrategy?.is_active || false;

    return NextResponse.json({
      strategy: {
        ...strategy,
        indicators: typeof strategy.indicators === 'string' 
          ? JSON.parse(strategy.indicators) 
          : strategy.indicators,
        is_active: isActive
      },
      recent_signals: signals || [],
      performance: performance || {
        win_rate: 0,
        total_trades: 0,
        profit_loss: 0,
        sharpe_ratio: 0,
        max_drawdown: 0,
        avg_trade_duration: 0
      }
    });

  } catch (error) {
    console.error('Error in strategy details API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const strategyId = context.params.id;
    
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

    // Verificar que la estrategia existe y pertenece al usuario
    const { data: existingStrategy, error: fetchError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .eq('created_by', session.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Estrategia no encontrada o no tienes permisos para editarla' }, { status: 404 });
      }
      console.error('Error fetching strategy for update:', fetchError);
      return NextResponse.json({ error: 'Error al obtener estrategia' }, { status: 500 });
    }

    // Actualizar la estrategia
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (risk_level !== undefined) updateData.risk_level = risk_level;
    if (timeframe !== undefined) updateData.timeframe = timeframe;
    if (indicators !== undefined) updateData.indicators = JSON.stringify(indicators);
    if (stop_loss !== undefined) updateData.stop_loss = stop_loss;
    if (take_profit !== undefined) updateData.take_profit = take_profit;
    if (max_positions !== undefined) updateData.max_positions = max_positions;

    const { data: updatedStrategy, error: updateError } = await supabase
      .from('strategies')
      .update(updateData)
      .eq('id', strategyId)
      .eq('created_by', session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating strategy:', updateError);
      return NextResponse.json({ error: 'Error al actualizar estrategia' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Estrategia actualizada exitosamente',
      strategy: {
        ...updatedStrategy,
        indicators: typeof updatedStrategy.indicators === 'string' 
          ? JSON.parse(updatedStrategy.indicators) 
          : updatedStrategy.indicators
      }
    });

  } catch (error) {
    console.error('Error in update strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const strategyId = context.params.id;
    
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

    // Verificar que la estrategia existe y pertenece al usuario
    const { data: existingStrategy, error: fetchError } = await supabase
      .from('strategies')
      .select('id')
      .eq('id', strategyId)
      .eq('created_by', session.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Estrategia no encontrada o no tienes permisos para eliminarla' }, { status: 404 });
      }
      console.error('Error fetching strategy for deletion:', fetchError);
      return NextResponse.json({ error: 'Error al obtener estrategia' }, { status: 500 });
    }

    // Eliminar la estrategia
    const { error: deleteError } = await supabase
      .from('strategies')
      .delete()
      .eq('id', strategyId)
      .eq('created_by', session.user.id);

    if (deleteError) {
      console.error('Error deleting strategy:', deleteError);
      return NextResponse.json({ error: 'Error al eliminar estrategia' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Estrategia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error in delete strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}