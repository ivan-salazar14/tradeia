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

    // Obtener todas las estrategias con sus métricas de performance
    const { data: strategies, error: strategiesError } = await supabase
      .from('strategies')
      .select(`
        *,
        strategy_performance (*)
      `)
      .order('created_at', { ascending: false });

    if (strategiesError) {
      console.error('Error fetching strategies for comparison:', strategiesError);
      return NextResponse.json({ error: 'Error al obtener estrategias' }, { status: 500 });
    }

    // Formatear los datos para la comparación
    const comparison = strategies.map(strategy => ({
      id: strategy.id,
      name: strategy.name,
      description: strategy.description,
      risk_level: strategy.risk_level,
      timeframe: strategy.timeframe,
      indicators: typeof strategy.indicators === 'string' 
        ? JSON.parse(strategy.indicators) 
        : strategy.indicators,
      stop_loss: strategy.stop_loss,
      take_profit: strategy.take_profit,
      max_positions: strategy.max_positions,
      performance: strategy.strategy_performance || {
        win_rate: 0,
        total_trades: 0,
        profit_loss: 0,
        sharpe_ratio: 0,
        max_drawdown: 0,
        avg_trade_duration: 0
      }
    }));

    // Calcular estadísticas generales
    const totalStrategies = comparison.length;
    const avgWinRate = comparison.reduce((sum, s) => sum + (s.performance.win_rate || 0), 0) / totalStrategies;
    const avgProfitLoss = comparison.reduce((sum, s) => sum + (s.performance.profit_loss || 0), 0) / totalStrategies;
    const bestPerformer = comparison.reduce((best, current) => 
      (current.performance.profit_loss || 0) > (best.performance.profit_loss || 0) ? current : best
    );

    return NextResponse.json({
      strategies: comparison,
      summary: {
        total_strategies: totalStrategies,
        average_win_rate: Math.round(avgWinRate * 100) / 100,
        average_profit_loss: Math.round(avgProfitLoss * 100) / 100,
        best_performer: {
          name: bestPerformer.name,
          profit_loss: bestPerformer.performance.profit_loss
        }
      }
    });

  } catch (error) {
    console.error('Error in strategies comparison API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}