import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Extraer el project reference de la URL de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // Try project-specific cookie first, then fallback to generic
            if (name === `sb-${projectRef}-auth-token`) {
              return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
            }
            if (name === `sb-${projectRef}-refresh-token`) {
              return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
            }
            // Fallback for other cookies
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch {
              // The `remove` method was called from a Server Component.
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

      // Return mock comparison data when database is not available
      console.log('[STRATEGIES COMPARISON] Database error, returning mock comparison data');
      const mockStrategies = [
        {
          id: 'conservative',
          name: 'Conservative Strategy',
          description: 'Low-risk strategy with basic indicators',
          risk_level: 'Low',
          timeframe: '4h',
          indicators: ['SMA', 'RSI'],
          stop_loss: 2,
          take_profit: 4,
          max_positions: 3,
          performance: {
            win_rate: 65,
            total_trades: 120,
            profit_loss: 8.5,
            sharpe_ratio: 1.2,
            max_drawdown: -3.2,
            avg_trade_duration: 18.5
          }
        },
        {
          id: 'moderate',
          name: 'Moderate Strategy',
          description: 'Balanced risk strategy',
          risk_level: 'Medium',
          timeframe: '1h',
          indicators: ['SMA', 'RSI', 'MACD'],
          stop_loss: 2.5,
          take_profit: 5,
          max_positions: 5,
          performance: {
            win_rate: 58,
            total_trades: 95,
            profit_loss: 12.3,
            sharpe_ratio: 1.5,
            max_drawdown: -4.1,
            avg_trade_duration: 12.2
          }
        }
      ];

      const totalStrategies = mockStrategies.length;
      const avgWinRate = mockStrategies.reduce((sum, s) => sum + s.performance.win_rate, 0) / totalStrategies;
      const avgProfitLoss = mockStrategies.reduce((sum, s) => sum + s.performance.profit_loss, 0) / totalStrategies;
      const bestPerformer = mockStrategies.reduce((best, current) =>
        current.performance.profit_loss > best.performance.profit_loss ? current : best
      );

      return NextResponse.json({
        strategies: mockStrategies,
        summary: {
          total_strategies: totalStrategies,
          average_win_rate: Math.round(avgWinRate * 100) / 100,
          average_profit_loss: Math.round(avgProfitLoss * 100) / 100,
          best_performer: {
            name: bestPerformer.name,
            profit_loss: bestPerformer.performance.profit_loss
          }
        },
        _mock: true
      });
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