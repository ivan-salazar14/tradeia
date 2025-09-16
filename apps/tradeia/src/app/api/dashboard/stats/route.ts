import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface DashboardStats {
  summary: {
    total_signals: number;
    timeframe: string;
    date_range: {
      start: string;
      end: string;
    };
  };
  performance_metrics: {
    buy_percentage: number;
    sell_percentage: number;
    total_buy_signals: number;
    total_sell_signals: number;
  };
  strategy_breakdown: Array<{
    strategy_id: string;
    strategy_name: string;
    signal_count: number;
    percentage: number;
  }>;
  timeframe_breakdown: Array<{
    timeframe: string;
    signal_count: number;
    percentage: number;
  }>;
  symbol_breakdown: Array<{
    symbol: string;
    signal_count: number;
    percentage: number;
  }>;
  recent_activity: Array<{
    id: string;
    symbol: string;
    direction: string;
    timestamp: string;
    strategy_id: string;
  }>;
  signal_quality: {
    avg_signal_age_hours: number;
    signals_last_24h: number;
    signals_last_7d: number;
    signals_last_30d: number;
  };
}

export async function GET(req: NextRequest) {
  console.log('[DASHBOARD STATS] ===== STARTING DASHBOARD STATS REQUEST =====');

  try {
    // Check for Bearer token authentication
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header. Use Bearer token.' }, {
        status: 401,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Extract token from Bearer header
    const token = auth.substring(7);
    if (!token || token.length < 10) {
      return NextResponse.json({ error: 'Invalid Bearer token' }, {
        status: 401,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || '4h';
    const strategyId = searchParams.get('strategy_id');
    const symbol = searchParams.get('symbol');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Default date range to last 30 days if not specified
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const actualStartDate = startDate || defaultStartDate.toISOString().split('T')[0];
    const actualEndDate = endDate || defaultEndDate.toISOString().split('T')[0];

    console.log('[DASHBOARD STATS] Parameters:', {
      timeframe,
      strategyId,
      symbol,
      startDate: actualStartDate,
      endDate: actualEndDate
    });

    // Setup Supabase client
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

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'User not authenticated' }, {
        status: 401,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Build query for signals
    let query = supabase
      .from('signals')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('timestamp', `${actualStartDate}T00:00:00Z`)
      .lte('timestamp', `${actualEndDate}T23:59:59Z`);

    // Apply filters
    if (strategyId) {
      query = query.eq('strategy_id', strategyId);
    }
    if (symbol) {
      query = query.eq('symbol', symbol);
    }
    if (timeframe) {
      query = query.eq('timeframe', timeframe);
    }

    // Execute query
    const { data: signals, error } = await query.limit(1000); // Limit for performance

    if (error) {
      console.error('[DASHBOARD STATS] Database error:', error);
      return NextResponse.json({
        error: 'Failed to fetch signals data',
        details: error.message
      }, {
        status: 500,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    console.log('[DASHBOARD STATS] Retrieved signals count:', signals?.length || 0);

    // Calculate statistics
    const totalSignals = signals?.length || 0;
    const buySignals = signals?.filter(s => s.direction === 'BUY').length || 0;
    const sellSignals = signals?.filter(s => s.direction === 'SELL').length || 0;

    const buyPercentage = totalSignals > 0 ? (buySignals / totalSignals) * 100 : 0;
    const sellPercentage = totalSignals > 0 ? (sellSignals / totalSignals) * 100 : 0;

    // Strategy breakdown
    const strategyMap = new Map<string, number>();
    signals?.forEach(signal => {
      const count = strategyMap.get(signal.strategy_id) || 0;
      strategyMap.set(signal.strategy_id, count + 1);
    });

    const strategyBreakdown = Array.from(strategyMap.entries()).map(([strategyId, count]) => ({
      strategy_id: strategyId,
      strategy_name: strategyId, // Could be enhanced to get actual names
      signal_count: count,
      percentage: totalSignals > 0 ? (count / totalSignals) * 100 : 0
    }));

    // Timeframe breakdown
    const timeframeMap = new Map<string, number>();
    signals?.forEach(signal => {
      const count = timeframeMap.get(signal.timeframe) || 0;
      timeframeMap.set(signal.timeframe, count + 1);
    });

    const timeframeBreakdown = Array.from(timeframeMap.entries()).map(([tf, count]) => ({
      timeframe: tf,
      signal_count: count,
      percentage: totalSignals > 0 ? (count / totalSignals) * 100 : 0
    }));

    // Symbol breakdown
    const symbolMap = new Map<string, number>();
    signals?.forEach(signal => {
      const count = symbolMap.get(signal.symbol) || 0;
      symbolMap.set(signal.symbol, count + 1);
    });

    const symbolBreakdown = Array.from(symbolMap.entries()).map(([sym, count]) => ({
      symbol: sym,
      signal_count: count,
      percentage: totalSignals > 0 ? (count / totalSignals) * 100 : 0
    }));

    // Recent activity (last 10 signals)
    const recentActivity = signals
      ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(signal => ({
        id: signal.id,
        symbol: signal.symbol,
        direction: signal.direction,
        timestamp: signal.timestamp,
        strategy_id: signal.strategy_id
      })) || [];

    // Signal quality metrics
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const signalsLast24h = signals?.filter(s => new Date(s.timestamp) >= last24h).length || 0;
    const signalsLast7d = signals?.filter(s => new Date(s.timestamp) >= last7d).length || 0;
    const signalsLast30d = signals?.filter(s => new Date(s.timestamp) >= last30d).length || 0;

    const avgSignalAgeHours = signals?.length
      ? signals.reduce((sum, s) => sum + (s.signal_age_hours || 0), 0) / signals.length
      : 0;

    const dashboardStats: DashboardStats = {
      summary: {
        total_signals: totalSignals,
        timeframe,
        date_range: {
          start: actualStartDate,
          end: actualEndDate
        }
      },
      performance_metrics: {
        buy_percentage: Math.round(buyPercentage * 10) / 10,
        sell_percentage: Math.round(sellPercentage * 10) / 10,
        total_buy_signals: buySignals,
        total_sell_signals: sellSignals
      },
      strategy_breakdown: strategyBreakdown,
      timeframe_breakdown: timeframeBreakdown,
      symbol_breakdown: symbolBreakdown,
      recent_activity: recentActivity,
      signal_quality: {
        avg_signal_age_hours: Math.round(avgSignalAgeHours * 10) / 10,
        signals_last_24h: signalsLast24h,
        signals_last_7d: signalsLast7d,
        signals_last_30d: signalsLast30d
      }
    };

    console.log('[DASHBOARD STATS] ===== SENDING SUCCESS RESPONSE =====');
    console.log('[DASHBOARD STATS] Stats calculated for', totalSignals, 'signals');

    return NextResponse.json(dashboardStats, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Accept-Encoding': 'identity',
        'Content-Encoding': 'identity',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept-Encoding'
      }
    });

  } catch (err: any) {
    console.error('[DASHBOARD STATS] ===== ERROR =====');
    console.error('[DASHBOARD STATS] Error:', err?.message);

    return NextResponse.json({
      error: 'Dashboard stats request failed',
      details: err?.message ?? 'Unknown error occurred while fetching dashboard statistics'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity',
        'Content-Encoding': 'identity',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept-Encoding'
      }
    });
  }
}