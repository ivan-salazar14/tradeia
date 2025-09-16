import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { normalizeExampleProvider } from '@/lib/signals/normalize';
import { UnifiedSignal } from '@/lib/signals/types';

interface PortfolioMetrics {
  total_position_size: number;
  total_risk_amount: number;
  remaining_balance: number;
  avg_reward_to_risk: number;
}

interface RiskParameters {
  initial_balance: number;
  risk_per_trade_pct: number;
}

interface MockStrategy {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  is_active: boolean;
}

function calculatePortfolioMetrics(signals: UnifiedSignal[], initialBalance: number, riskPerTrade: number): PortfolioMetrics {
  let totalPositionSize = 0;
  let totalRiskAmount = 0;
  let remainingBalance = initialBalance;
  let totalRewardToRisk = 0;
  let validSignalsCount = 0;

  for (const signal of signals) {
    // Skip signals without entry price or stop loss
    if (!signal.entry || !signal.stopLoss) continue;

    // Calculate position size based on risk
    const riskAmount = (remainingBalance * riskPerTrade) / 100;
    const riskPerUnit = Math.abs(signal.entry - signal.stopLoss);
    const positionSize = riskAmount / riskPerUnit;

    totalPositionSize += positionSize * signal.entry;
    totalRiskAmount += riskAmount;

    // Calculate reward to risk ratio
    if (signal.tp1) {
      const reward = Math.abs(signal.tp1 - signal.entry);
      const rewardToRisk = reward / riskPerUnit;
      totalRewardToRisk += rewardToRisk;
      validSignalsCount++;
    }

    // Update remaining balance
    remainingBalance -= riskAmount;
  }

  const avgRewardToRisk = validSignalsCount > 0 ? totalRewardToRisk / validSignalsCount : 0;

  return {
    total_position_size: totalPositionSize,
    total_risk_amount: totalRiskAmount,
    remaining_balance: Math.max(0, remainingBalance),
    avg_reward_to_risk: avgRewardToRisk
  };
}

const API_BASE = process.env.SIGNALS_API_BASE; // e.g., https://provider.example.com

// Mock strategies list for signals and backtest views
const mockStrategies: MockStrategy[] = [
  {
    id: 'conservative',
    name: 'Conservative Strategy',
    description: 'Low-risk strategy with basic technical indicators',
    risk_level: 'Low',
    timeframe: '4h',
    indicators: ['SMA', 'RSI'],
    is_active: true
  },
  {
    id: 'moderate',
    name: 'Moderate Strategy',
    description: 'Balanced risk strategy with multiple indicators',
    risk_level: 'Medium',
    timeframe: '1h',
    indicators: ['SMA', 'RSI', 'MACD'],
    is_active: false
  },
  {
    id: 'sqzmom_adx',
    name: 'ADX Squeeze Momentum',
    description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation',
    risk_level: 'Medium',
    timeframe: '4h',
    indicators: ['ADX', 'Squeeze Momentum'],
    is_active: false
  },
  {
    id: 'aggressive',
    name: 'Aggressive Strategy',
    description: 'High-risk strategy for experienced traders',
    risk_level: 'High',
    timeframe: '15m',
    indicators: ['RSI', 'MACD', 'Bollinger Bands'],
    is_active: false
  },
  {
    id: 'scalping',
    name: 'Scalping Strategy',
    description: 'Fast-paced strategy for quick profits',
    risk_level: 'High',
    timeframe: '5m',
    indicators: ['EMA', 'Stochastic'],
    is_active: false
  },
  {
    id: 'swing',
    name: 'Swing Trading',
    description: 'Medium-term strategy for trend following',
    risk_level: 'Medium',
    timeframe: '1d',
    indicators: ['Moving Average', 'Volume'],
    is_active: false
  }
];

// Simple in-memory circuit breaker (per server instance)
let failCount = 0;
let openUntil = 0; // epoch ms
const OPEN_THRESHOLD = 3; // failures
const OPEN_MS = 30_000; // 30s cooldown

export async function GET(req: NextRequest) {
  console.log('[SIGNALS API] ===== STARTING REQUEST =====');
  console.log('[SIGNALS API] Request URL:', req.url);
  console.log('[SIGNALS API] Request method:', req.method);
  console.log('[SIGNALS API] Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('[SIGNALS API] API_BASE value:', API_BASE);
  console.log('[SIGNALS API] API_BASE exists:', !!API_BASE);

  if (!API_BASE) {
    console.error('[SIGNALS API] SIGNALS_API_BASE environment variable is not configured');
    return NextResponse.json({
      error: 'SIGNALS_API_BASE is not configured',
      details: 'Please check your environment variables'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get('symbol') || '').toUpperCase();
  const timeframe = (searchParams.get('timeframe') || '4h').toLowerCase();
  const strategyIdParam = searchParams.get('strategy_id')?.trim() || '';
  const strategyIdsParam = searchParams.get('strategy_ids')?.split(',').map(id => id.trim()).filter(Boolean) || null;
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200); // Cap at 200, default 50
  const offset = parseInt(searchParams.get('offset') || '0');
  const initialBalance = parseFloat(searchParams.get('initial_balance') || '10000');
  const riskPerTrade = parseFloat(searchParams.get('risk_per_trade') || '1.0');
  const includeLiveSignals = searchParams.get('include_live_signals') === 'true';
  const forceFresh = searchParams.get('force_fresh') === 'true';
  const fields = searchParams.get('fields')?.split(',') || null; // Field selection

  // Check for Bearer token authentication
  const auth = req.headers.get('authorization');
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

  // Setup Supabase client for user strategy lookup
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

  // Get user's active strategies or use defaults
  let userStrategyIds: string[] = [];
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[SIGNALS] Session check result:', session ? 'User authenticated' : 'No session');

    if (session?.user) {
      console.log('[SIGNALS] User ID:', session.user.id);
      const { data: userStrategies, error: strategiesError } = await supabase
        .from('user_strategies')
        .select('strategy_id')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (strategiesError) {
        console.warn('[SIGNALS] Error fetching user strategies:', strategiesError);
      } else if (userStrategies && userStrategies.length > 0) {
        userStrategyIds = userStrategies.map(us => us.strategy_id);
        console.log('[SIGNALS] Found user strategies:', userStrategyIds);
      } else {
        console.log('[SIGNALS] No active strategies found for user');
      }
    } else {
      console.log('[SIGNALS] No authenticated user session');
    }
  } catch (error) {
    console.warn('[SIGNALS] Failed to fetch user strategies, using defaults:', error);
  }

  // Determine which strategies to use for filtering
  let activeStrategyIds: string[] = [];

  if (strategyIdsParam && strategyIdsParam.length > 0) {
    // Use explicitly provided strategy_ids
    activeStrategyIds = strategyIdsParam;
    console.log('[SIGNALS] Using explicitly provided strategy IDs:', activeStrategyIds);
  } else if (strategyIdParam) {
    // Use single strategy_id parameter
    activeStrategyIds = [strategyIdParam];
    console.log('[SIGNALS] Using single strategy ID:', activeStrategyIds);
  } else if (userStrategyIds.length > 0) {
    // Use user's active strategies
    activeStrategyIds = userStrategyIds;
    console.log('[SIGNALS] Using user active strategies:', activeStrategyIds);
  } else {
    // Default to moderate strategy
    activeStrategyIds = ['moderate'];
    console.log('[SIGNALS] No user strategies found, using default moderate strategy');
  }

  // Ensure we have at least one strategy for mock data generation
  if (activeStrategyIds.length === 0) {
    activeStrategyIds = ['moderate'];
    console.log('[SIGNALS] Forcing default moderate strategy for mock generation');
  }

  // Basic input validation
  if (symbol && !/^[A-Z0-9]+\/[A-Z0-9]+$/.test(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol format. Use BASE/QUOTE e.g., BTC/USDT' }, {
      status: 400,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }
  if (!/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i.test(timeframe)) {
    return NextResponse.json({ error: 'Invalid timeframe format.' }, {
      status: 400,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Circuit breaker check
  const now = Date.now();
  if (openUntil > now) {
    return NextResponse.json({ error: 'Upstream temporarily unavailable (circuit open). Try again later.' }, {
      status: 503,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  const qs = new URLSearchParams();
  if (symbol) qs.set('symbol', symbol);
  qs.set('timeframe', timeframe);

  // Send dates in simple format without timezone to avoid comparison issues
  if (startDate) {
    // Aggressively strip timezone info and extract just the date part
    let dateOnly = startDate.split('T')[0]; // Remove time part
    dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
    dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
    dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
    console.log('[SIGNALS] Sending start_date as date-only:', dateOnly, 'from:', startDate);
    qs.set('start_date', dateOnly);
  }
  if (endDate) {
    // Aggressively strip timezone info and extract just the date part
    let dateOnly = endDate.split('T')[0]; // Remove time part
    dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
    dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
    dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
    console.log('[SIGNALS] Sending end_date as date-only:', dateOnly, 'from:', endDate);
    qs.set('end_date', dateOnly);
  }

  qs.set('limit', limit.toString());
  qs.set('offset', offset.toString());
  if (includeLiveSignals) qs.set('include_live_signals', 'true');
  if (forceFresh) qs.set('force_fresh', 'true');

  try {
    // Use strategy_ids for database-level filtering
    let resp: Response;
    const qsSignals = new URLSearchParams(qs);

    // Add strategy_ids parameter for database filtering
    if (activeStrategyIds.length > 0) {
      qsSignals.set('strategy_ids', activeStrategyIds.join(','));
    }

    // Try to connect to external API
    try {
      // Always use POST to /strategies/signals/generate endpoint as per API specification
      const postUrl = `${API_BASE}/strategies/signals/generate?${qs.toString()}`;
      console.log('[SIGNALS] Generating signals from:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));

      resp = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'TradeIA-Backend/1.0',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(10000), // Increased timeout to 10 seconds
      });
    } catch (networkError) {
      console.warn('[SIGNALS] External API not available:', networkError);
      return NextResponse.json({
        error: 'Signals API is currently unavailable',
        details: 'Unable to connect to external signals provider'
      }, {
        status: 503,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    if (!resp.ok) {
      const text = await resp.text();
      failCount += 1;
      if (failCount >= OPEN_THRESHOLD) {
        openUntil = Date.now() + OPEN_MS;
      }
      console.warn('[SIGNALS] External API failed with status:', resp.status);
      console.warn('[SIGNALS] External API response text:', text);
      return NextResponse.json({
        error: 'Signals API returned an error',
        details: `External API responded with status ${resp.status}: ${text}`
      }, {
        status: resp.status,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    const data = await resp.json();
    console.log('[SIGNALS] External API response data:', JSON.stringify(data, null, 2));

    const normalizeOne = (p: any): UnifiedSignal => {
      const signal = normalizeExampleProvider(p);
      // Ensure strategyId is included in the normalized signal
      if (p.strategy_id) {
        signal.strategyId = p.strategy_id;
      }
      return signal;
    };

    // Unwrap common container shapes from upstream
    const pickArray = (d: any): any[] | null => {
      if (!d) return null;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d.signals)) return d.signals;
      if (Array.isArray(d.results)) return d.results;
      if (Array.isArray(d.items)) return d.items;
      if (d.data) return pickArray(d.data);
      return null;
    };

    const payloadArr = pickArray(data);
    const signals: UnifiedSignal[] = Array.isArray(payloadArr)
      ? payloadArr.map(normalizeOne)
      : [normalizeOne(data)];

    // basic quality checks: remove items missing required fields or invalid numbers
    // Also filter out signals with "No signal generated" reason
    const quality = signals.filter((s) => {
      if (!s.id || !s.symbol || !s.timeframe || !s.timestamp || !s.direction) return false;
      if (s.entry !== undefined && typeof s.entry !== 'number') return false;
      if (s.tp1 !== undefined && typeof s.tp1 !== 'number') return false;
      if (s.tp2 !== undefined && typeof s.tp2 !== 'number') return false;
      if (s.stopLoss !== undefined && typeof s.stopLoss !== 'number') return false;
      // Filter out signals that are not actual trading signals
      if (s.reason === 'No signal generated' || s.reason === 'no signal generated') return false;
      if (s.marketScenario === null && !s.entry) return false; // Signals without market scenario and entry are likely informational
      return true;
    });

    // Filter by active strategies at database level (already done via strategy_ids parameter)
    // Additional client-side filtering if needed
    let filtered = quality;
    if (activeStrategyIds.length > 0) {
      const activeSet = new Set(activeStrategyIds);
      filtered = quality.filter((s) => !s.strategyId || activeSet.has(s.strategyId));
    }

    // reset breaker on success
    failCount = 0;
    openUntil = 0;

    // Calculate portfolio metrics
    const portfolioMetrics = calculatePortfolioMetrics(filtered, initialBalance, riskPerTrade);

    // Prepare risk parameters
    const riskParameters: RiskParameters = {
      initial_balance: initialBalance,
      risk_per_trade_pct: riskPerTrade
    };

    // Apply pagination to filtered signals
    const totalSignals = filtered.length;
    const paginatedSignals = filtered.slice(offset, offset + limit);

    // Transform signals to match frontend expectations with field selection
    const transformedSignals = paginatedSignals.map(signal => {
      const baseSignal = {
        id: signal.id,
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        timestamp: signal.timestamp,
        execution_timestamp: signal.execution_timestamp,
        signal_age_hours: signal.signal_age_hours,
        signal_source: signal.signal_source,
        type: signal.type,
        direction: signal.direction,
        strategyId: signal.strategyId,
        entry: signal.entry,
        tp1: signal.tp1,
        tp2: signal.tp2,
        stopLoss: signal.stopLoss,
        source: signal.source,
        position_size: signal.entry ? (initialBalance * riskPerTrade / 100) / Math.abs(signal.entry - (signal.stopLoss || signal.entry)) * signal.entry : undefined,
        risk_amount: signal.entry ? (initialBalance * riskPerTrade / 100) : undefined,
        reward_to_risk: signal.entry && signal.tp1 && signal.stopLoss ? Math.abs(signal.tp1 - signal.entry) / Math.abs(signal.entry - signal.stopLoss) : undefined
      };

      // Apply field selection if specified
      if (fields && fields.length > 0) {
        const selectedSignal: any = {};
        fields.forEach(field => {
          if (baseSignal.hasOwnProperty(field.trim())) {
            selectedSignal[field.trim()] = (baseSignal as any)[field.trim()];
          }
        });
        return selectedSignal;
      }

      return baseSignal;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalSignals / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < totalSignals;
    const hasPrevPage = offset > 0;

    console.log('[SIGNALS API] ===== SENDING SUCCESS RESPONSE =====');
    console.log('[SIGNALS API] Response signals count:', transformedSignals.length);
    console.log('[SIGNALS API] Response headers:', {
      'Cache-Control': 'public, max-age=300'
    });

    return NextResponse.json({
      signals: transformedSignals,
      strategies: mockStrategies,
      portfolio_metrics: portfolioMetrics,
      risk_parameters: riskParameters,
      pagination: {
        total: totalSignals,
        limit,
        offset,
        current_page: currentPage,
        total_pages: totalPages,
        has_next: hasNextPage,
        has_prev: hasPrevPage
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Accept-Encoding': 'identity',
        'Content-Encoding': 'identity',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept-Encoding'
      }
    });
  } catch (err: any) {
    failCount += 1;
    if (failCount >= OPEN_THRESHOLD) {
      openUntil = Date.now() + OPEN_MS;
    }

    console.warn('[SIGNALS] Request failed with exception:', err?.message);

    return NextResponse.json({
      error: 'Signals API request failed',
      details: err?.message ?? 'Unknown error occurred while fetching signals'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  console.log('[SIGNALS API POST] ===== STARTING GENERATE SIGNALS REQUEST =====');
  console.log('[SIGNALS API POST] Request URL:', req.url);
  console.log('[SIGNALS API POST] Request method:', req.method);
  console.log('[SIGNALS API POST] Request headers:', Object.fromEntries(req.headers.entries()));
  console.log('[SIGNALS API POST] API_BASE value:', API_BASE);
  console.log('[SIGNALS API POST] API_BASE exists:', !!API_BASE);

  if (!API_BASE) {
    console.error('[SIGNALS API POST] SIGNALS_API_BASE environment variable is not configured');
    return NextResponse.json({
      error: 'SIGNALS_API_BASE is not configured',
      details: 'Please check your environment variables'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });
  }

  // Check for Bearer token authentication
  const auth = req.headers.get('authorization');
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

  try {
    const body = await req.json();
    const {
      symbol,
      timeframe = '4h',
      start_date,
      end_date,
      initial_balance = 10000,
      risk_per_trade = 1.0
    } = body;

    console.log('[SIGNALS API POST] Request body:', { symbol, timeframe, start_date, end_date, initial_balance, risk_per_trade });

    // Setup Supabase client for user strategy lookup
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

    // Get user's active strategies or use defaults
    let userStrategyIds: string[] = [];
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[SIGNALS POST] Session check result:', session ? 'User authenticated' : 'No session');

      if (session?.user) {
        console.log('[SIGNALS POST] User ID:', session.user.id);
        const { data: userStrategies, error: strategiesError } = await supabase
          .from('user_strategies')
          .select('strategy_id')
          .eq('user_id', session.user.id)
          .eq('is_active', true);

        if (strategiesError) {
          console.warn('[SIGNALS POST] Error fetching user strategies:', strategiesError);
        } else if (userStrategies && userStrategies.length > 0) {
          userStrategyIds = userStrategies.map(us => us.strategy_id);
          console.log('[SIGNALS POST] Found user strategies:', userStrategyIds);
        } else {
          console.log('[SIGNALS POST] No active strategies found for user');
        }
      } else {
        console.log('[SIGNALS POST] No authenticated user session');
      }
    } catch (error) {
      console.warn('[SIGNALS POST] Failed to fetch user strategies, using defaults:', error);
    }

    // Determine which strategies to use for filtering
    let activeStrategyIds: string[] = [];
    if (userStrategyIds.length > 0) {
      // Use user's active strategies
      activeStrategyIds = userStrategyIds;
      console.log('[SIGNALS POST] Using user active strategies:', activeStrategyIds);
    } else {
      // Default to moderate strategy
      activeStrategyIds = ['moderate'];
      console.log('[SIGNALS POST] No user strategies found, using default moderate strategy');
    }

    // Ensure we have at least one strategy for mock data generation
    if (activeStrategyIds.length === 0) {
      activeStrategyIds = ['moderate'];
      console.log('[SIGNALS POST] Forcing default moderate strategy for mock generation');
    }

    // Basic input validation
    if (symbol && !/^[A-Z0-9]+\/[A-Z0-9]+$/.test(symbol)) {
      return NextResponse.json({ error: 'Invalid symbol format. Use BASE/QUOTE e.g., BTC/USDT' }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }
    if (!/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i.test(timeframe)) {
      return NextResponse.json({ error: 'Invalid timeframe format.' }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    // Circuit breaker check
    const now = Date.now();
    if (openUntil > now) {
      return NextResponse.json({ error: 'Upstream temporarily unavailable (circuit open). Try again later.' }, {
        status: 503,
        headers: {
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      });
    }

    const qs = new URLSearchParams();
    if (symbol) qs.set('symbol', symbol);
    qs.set('timeframe', timeframe);

    // Send dates in simple format without timezone to avoid comparison issues
    if (start_date) {
      // Aggressively strip timezone info and extract just the date part
      let dateOnly = start_date.split('T')[0]; // Remove time part
      dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
      dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
      dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
      console.log('[SIGNALS POST] Sending start_date as date-only:', dateOnly, 'from:', start_date);
      qs.set('start_date', dateOnly);
    }
    if (end_date) {
      // Aggressively strip timezone info and extract just the date part
      let dateOnly = end_date.split('T')[0]; // Remove time part
      dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
      dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
      dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
      console.log('[SIGNALS POST] Sending end_date as date-only:', dateOnly, 'from:', end_date);
      qs.set('end_date', dateOnly);
    }

    try {
      // Try different possible endpoints for signals generation
      const possibleEndpoints = [
        `${API_BASE}/signals/generate`,
      ];

      let response: Response | null = null;
      let postUrl = '';

      for (const endpoint of possibleEndpoints) {
        postUrl = `${endpoint}?${qs.toString()}`;
        console.log('[SIGNALS POST] Trying endpoint:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));

        try {
          response = await fetch(postUrl, {
            method: 'POST',
            headers: {
              'Authorization': auth,
              'Content-Type': 'application/json',
              'Accept-Encoding': 'identity',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'User-Agent': 'TradeIA-Backend/1.0',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(5000), // 5 seconds timeout per attempt
          });

          // If we get a successful response (2xx), use this endpoint
          if (response.ok) {
            console.log('[SIGNALS POST] ✅ Found working endpoint:', endpoint);
            break;
          } else {
            console.log('[SIGNALS POST] ❌ Endpoint returned status:', response.status, 'trying next...');
          }
        } catch (endpointError) {
          const errorMessage = endpointError instanceof Error ? endpointError.message : String(endpointError);
          console.log('[SIGNALS POST] ❌ Endpoint failed:', endpoint, 'Error:', errorMessage);
          continue;
        }
      }

      // If no endpoint worked, return error
      if (!response || !response.ok) {
        console.error('[SIGNALS POST] ❌ All endpoints failed');
        return NextResponse.json({
          error: 'Signals generation API is currently unavailable',
          details: 'Unable to connect to external signals provider - all endpoints failed'
        }, {
          status: 503,
          headers: {
            'Accept-Encoding': 'identity'
          }
        });
      }

      const resp = response; // Use the working response

      if (!resp.ok) {
        const text = await resp.text();
        failCount += 1;
        if (failCount >= OPEN_THRESHOLD) {
          openUntil = Date.now() + OPEN_MS;
        }
        console.warn('[SIGNALS POST] External API failed with status:', resp.status);
        console.warn('[SIGNALS POST] External API response text:', text);
        console.warn('[SIGNALS POST] Request URL that failed:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));
        console.warn('[SIGNALS POST] Request body sent:', JSON.stringify({
          symbol,
          timeframe,
          start_date,
          end_date,
          initial_balance,
          risk_per_trade
        }, null, 2));

        return NextResponse.json({
          error: 'Signals generation API returned an error',
          details: `External API responded with status ${resp.status}: ${text}`,
          endpoint: postUrl.split('?')[0], // Show endpoint without query params
          request_data: {
            symbol,
            timeframe,
            start_date,
            end_date,
            initial_balance,
            risk_per_trade
          }
        }, {
          status: resp.status,
          headers: {
            'Accept-Encoding': 'identity'
          }
        });
      }

      const data = await resp.json();
      console.log('[SIGNALS POST] External API response data:', JSON.stringify(data, null, 2));

      const normalizeOne = (p: any): UnifiedSignal => {
        const signal = normalizeExampleProvider(p);
        // Ensure strategyId is included in the normalized signal
        if (p.strategy_id) {
          signal.strategyId = p.strategy_id;
        }
        return signal;
      };

      // Unwrap common container shapes from upstream
      const pickArray = (d: any): any[] | null => {
        if (!d) return null;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d.signals)) return d.signals;
        if (Array.isArray(d.results)) return d.results;
        if (Array.isArray(d.items)) return d.items;
        if (d.data) return pickArray(d.data);
        return null;
      };

      const payloadArr = pickArray(data);
      const signals: UnifiedSignal[] = Array.isArray(payloadArr)
        ? payloadArr.map(normalizeOne)
        : [normalizeOne(data)];

      // basic quality checks: remove items missing required fields or invalid numbers
      const quality = signals.filter((s) => {
        if (!s.id || !s.symbol || !s.timeframe || !s.timestamp || !s.direction) return false;
        if (s.entry !== undefined && typeof s.entry !== 'number') return false;
        if (s.tp1 !== undefined && typeof s.tp1 !== 'number') return false;
        if (s.tp2 !== undefined && typeof s.tp2 !== 'number') return false;
        if (s.stopLoss !== undefined && typeof s.stopLoss !== 'number') return false;
        // Filter out signals that are not actual trading signals
        if (s.reason === 'No signal generated' || s.reason === 'no signal generated') return false;
        if (s.marketScenario === null && !s.entry) return false;
        return true;
      });

      // Filter by active strategies at database level
      let filtered = quality;
      if (activeStrategyIds.length > 0) {
        const activeSet = new Set(activeStrategyIds);
        filtered = quality.filter((s) => !s.strategyId || activeSet.has(s.strategyId));
      }

      // reset breaker on success
      failCount = 0;
      openUntil = 0;

      // Calculate portfolio metrics
      const portfolioMetrics = calculatePortfolioMetrics(filtered, initial_balance, risk_per_trade);

      // Prepare risk parameters
      const riskParameters: RiskParameters = {
        initial_balance: initial_balance,
        risk_per_trade_pct: risk_per_trade
      };

      // Transform signals to match frontend expectations
      const transformedSignals = filtered.map(signal => ({
        id: signal.id,
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        timestamp: signal.timestamp,
        execution_timestamp: signal.execution_timestamp,
        signal_age_hours: signal.signal_age_hours,
        signal_source: signal.signal_source,
        type: signal.type,
        direction: signal.direction,
        strategyId: signal.strategyId,
        entry: signal.entry,
        tp1: signal.tp1,
        tp2: signal.tp2,
        stopLoss: signal.stopLoss,
        source: signal.source,
        position_size: signal.entry ? (initial_balance * risk_per_trade / 100) / Math.abs(signal.entry - (signal.stopLoss || signal.entry)) * signal.entry : undefined,
        risk_amount: signal.entry ? (initial_balance * risk_per_trade / 100) : undefined,
        reward_to_risk: signal.entry && signal.tp1 && signal.stopLoss ? Math.abs(signal.tp1 - signal.entry) / Math.abs(signal.entry - signal.stopLoss) : undefined
      }));

      console.log('[SIGNALS API POST] ===== SENDING SUCCESS RESPONSE =====');
      console.log('[SIGNALS API POST] Response signals count:', transformedSignals.length);
      console.log('[SIGNALS API POST] Response headers:', {
        'Cache-Control': 'public, max-age=300'
      });

      return NextResponse.json({
        signals: transformedSignals,
        strategies: mockStrategies,
        portfolio_metrics: portfolioMetrics,
        risk_parameters: riskParameters
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Accept-Encoding': 'identity',
          'Content-Encoding': 'identity',
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept-Encoding'
        }
      });
    } catch (networkError) {
      console.warn('[SIGNALS POST] External API not available:', networkError);
      failCount += 1;
      if (failCount >= OPEN_THRESHOLD) {
        openUntil = Date.now() + OPEN_MS;
      }

      // Try to provide mock signals as fallback
      console.log('[SIGNALS POST] Using mock signals as fallback');

      const mockSignals = [
        {
          id: 'mock-signal-1',
          symbol: symbol || 'BTC/USDT',
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0,
          signal_source: 'mock',
          type: 'entry' as const,
          direction: 'BUY' as const,
          strategyId: activeStrategyIds[0] || 'moderate',
          entry: 50000,
          tp1: 51000,
          tp2: 52000,
          stopLoss: 49000,
          source: { provider: 'mock_provider' },
          position_size: (initial_balance * risk_per_trade / 100) / Math.abs(50000 - 49000) * 50000,
          risk_amount: initial_balance * risk_per_trade / 100,
          reward_to_risk: Math.abs(51000 - 50000) / Math.abs(50000 - 49000)
        }
      ];

      const portfolioMetrics = calculatePortfolioMetrics(mockSignals, initial_balance, risk_per_trade);
      const riskParameters: RiskParameters = {
        initial_balance: initial_balance,
        risk_per_trade_pct: risk_per_trade
      };

      return NextResponse.json({
        signals: mockSignals,
        strategies: mockStrategies,
        portfolio_metrics: portfolioMetrics,
        risk_parameters: riskParameters,
        _fallback: true,
        _message: 'External API unavailable - showing mock signals'
      }, {
        headers: {
          'Accept-Encoding': 'identity',
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }
  } catch (err: any) {
    failCount += 1;
    if (failCount >= OPEN_THRESHOLD) {
      openUntil = Date.now() + OPEN_MS;
    }

    console.warn('[SIGNALS POST] Request failed with exception:', err?.message);

    return NextResponse.json({
      error: 'Signals generation request failed',
      details: err?.message ?? 'Unknown error occurred while generating signals'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity'
      }
    });
  }
}
