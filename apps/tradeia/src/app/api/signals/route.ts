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
    }, { status: 500 });
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

  const auth = req.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
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
    if (session?.user) {
      const { data: userStrategies } = await supabase
        .from('user_strategies')
        .select('strategy_id')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (userStrategies && userStrategies.length > 0) {
        userStrategyIds = userStrategies.map(us => us.strategy_id);
      }
    }
  } catch (error) {
    console.warn('[SIGNALS] Failed to fetch user strategies, using defaults:', error);
  }

  // Determine which strategies to use for filtering
  let activeStrategyIds: string[] = [];

  if (strategyIdsParam && strategyIdsParam.length > 0) {
    // Use explicitly provided strategy_ids
    activeStrategyIds = strategyIdsParam;
  } else if (strategyIdParam) {
    // Use single strategy_id parameter
    activeStrategyIds = [strategyIdParam];
  } else if (userStrategyIds.length > 0) {
    // Use user's active strategies
    activeStrategyIds = userStrategyIds;
  } else {
    // Default to moderate strategy
    activeStrategyIds = ['moderate'];
  }

  console.log('[SIGNALS] Using strategy IDs for filtering:', activeStrategyIds);

  // Basic input validation
  if (symbol && !/^[A-Z0-9]+\/[A-Z0-9]+$/.test(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol format. Use BASE/QUOTE e.g., BTC/USDT' }, { status: 400 });
  }
  if (!/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i.test(timeframe)) {
    return NextResponse.json({ error: 'Invalid timeframe format.' }, { status: 400 });
  }

  // Circuit breaker check
  const now = Date.now();
  if (openUntil > now) {
    return NextResponse.json({ error: 'Upstream temporarily unavailable (circuit open). Try again later.' }, { status: 503 });
  }

  const qs = new URLSearchParams();
  if (symbol) qs.set('symbol', symbol);
  qs.set('timeframe', timeframe);
  if (startDate) qs.set('start_date', startDate);
  if (endDate) qs.set('end_date', endDate);
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

    // Try to connect to external API, but fallback to mock data if not available
    try {
      // Always use POST to /strategies/signals/generate endpoint as per API specification
      const postUrl = `${API_BASE}/strategies/signals/generate?${qs.toString()}`;
      console.log('[SIGNALS] Generating signals from:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));

      resp = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
    } catch (networkError) {
      console.warn('[SIGNALS] External API not available, using mock data:', networkError);
      // Return mock signals data when external API is not available
      const mockSignals: UnifiedSignal[] = [
        {
          id: 'mock-signal-1',
          symbol: symbol || 'BTC/USDT',
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 2.5,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'BUY',
          strategyId: activeStrategyIds[0] || 'moderate',
          entry: 45000 + Math.random() * 5000,
          tp1: 47000 + Math.random() * 3000,
          tp2: 49000 + Math.random() * 2000,
          stopLoss: 43000 + Math.random() * 2000,
          source: { provider: 'mock_provider' },
          marketScenario: 'bullish_trend'
        },
        {
          id: 'mock-signal-2',
          symbol: symbol || 'ETH/USDT',
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
          signal_age_hours: 1.0,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'SELL',
          strategyId: activeStrategyIds[1] || activeStrategyIds[0] || 'moderate',
          entry: 2800 + Math.random() * 200,
          tp1: 2600 + Math.random() * 100,
          tp2: 2400 + Math.random() * 100,
          stopLoss: 3000 + Math.random() * 100,
          source: { provider: 'mock_provider' },
          marketScenario: 'bearish_correction'
        }
      ];

      const portfolioMetrics = calculatePortfolioMetrics(mockSignals, initialBalance, riskPerTrade);
      const riskParameters: RiskParameters = {
        initial_balance: initialBalance,
        risk_per_trade_pct: riskPerTrade
      };

      // Apply pagination to mock signals
      const totalSignals = mockSignals.length;
      const paginatedMockSignals = mockSignals.slice(offset, offset + limit);
      const totalPages = Math.ceil(totalSignals / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const hasNextPage = offset + limit < totalSignals;
      const hasPrevPage = offset > 0;

      console.log('[SIGNALS API] ===== SENDING MOCK RESPONSE (NETWORK ERROR) =====');
      console.log('[SIGNALS API] Mock signals count:', paginatedMockSignals.length);
      console.log('[SIGNALS API] Response headers:', {
        'Cache-Control': 'public, max-age=300'
      });

      return NextResponse.json({
        signals: paginatedMockSignals,
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
        },
        _mock: true,
        _message: 'External signals API not available, showing mock data'
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300'
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
      console.warn('[SIGNALS] External API failed, using mock data fallback');
      // Return mock signals data instead of error
      const mockSignals: UnifiedSignal[] = [
        {
          id: 'mock-signal-1',
          symbol: symbol || 'BTC/USDT',
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 2.5,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'BUY',
          strategyId: 'conservative', // Use mock strategy IDs that match frontend
          entry: 45000 + Math.random() * 5000,
          tp1: 47000 + Math.random() * 3000,
          tp2: 49000 + Math.random() * 2000,
          stopLoss: 43000 + Math.random() * 2000,
          source: { provider: 'mock_provider' },
          marketScenario: 'bullish_trend'
        },
        {
          id: 'mock-signal-2',
          symbol: symbol || 'ETH/USDT',
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
          signal_age_hours: 1.0,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'SELL',
          strategyId: 'moderate', // Use mock strategy IDs that match frontend
          entry: 2800 + Math.random() * 200,
          tp1: 2600 + Math.random() * 100,
          tp2: 2400 + Math.random() * 100,
          stopLoss: 3000 + Math.random() * 100,
          source: { provider: 'mock_provider' },
          marketScenario: 'bearish_correction'
        },
        {
          id: 'mock-signal-3',
          symbol: symbol || 'ADA/USDT',
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          execution_timestamp: new Date(Date.now() - 7200000).toISOString(),
          signal_age_hours: 2.0,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'BUY',
          strategyId: 'sqzmom_adx', // Use mock strategy IDs that match frontend
          entry: 0.45 + Math.random() * 0.1,
          tp1: 0.48 + Math.random() * 0.05,
          tp2: 0.51 + Math.random() * 0.05,
          stopLoss: 0.42 + Math.random() * 0.03,
          source: { provider: 'mock_provider' },
          marketScenario: 'sideways_consolidation'
        },
        {
          id: 'mock-signal-4',
          symbol: symbol || 'SOL/USDT',
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          execution_timestamp: new Date(Date.now() - 10800000).toISOString(),
          signal_age_hours: 3.0,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'SELL',
          strategyId: 'aggressive', // Use mock strategy IDs that match frontend
          entry: 140 + Math.random() * 20,
          tp1: 130 + Math.random() * 10,
          tp2: 120 + Math.random() * 10,
          stopLoss: 150 + Math.random() * 5,
          source: { provider: 'mock_provider' },
          marketScenario: 'overbought_condition'
        },
        {
          id: 'mock-signal-5',
          symbol: symbol || 'DOT/USDT',
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          execution_timestamp: new Date(Date.now() - 14400000).toISOString(),
          signal_age_hours: 4.0,
          signal_source: 'mock_strategy',
          type: 'entry',
          direction: 'BUY',
          strategyId: 'scalping', // Use mock strategy IDs that match frontend
          entry: 5.2 + Math.random() * 0.8,
          tp1: 5.4 + Math.random() * 0.3,
          tp2: 5.6 + Math.random() * 0.3,
          stopLoss: 5.0 + Math.random() * 0.2,
          source: { provider: 'mock_provider' },
          marketScenario: 'breakout_up'
        }
      ];

      const portfolioMetrics = calculatePortfolioMetrics(mockSignals, initialBalance, riskPerTrade);
      const riskParameters: RiskParameters = {
        initial_balance: initialBalance,
        risk_per_trade_pct: riskPerTrade
      };

      // Apply pagination to mock signals
      const totalSignals = mockSignals.length;
      const paginatedMockSignals = mockSignals.slice(offset, offset + limit);
      const totalPages = Math.ceil(totalSignals / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const hasNextPage = offset + limit < totalSignals;
      const hasPrevPage = offset > 0;

      return NextResponse.json({
        signals: paginatedMockSignals,
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
        },
        _mock: true // Indicate this is mock data
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300'
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
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (err: any) {
    failCount += 1;
    if (failCount >= OPEN_THRESHOLD) {
      openUntil = Date.now() + OPEN_MS;
    }

    console.warn('[SIGNALS] Request failed with exception, using mock data fallback:', err?.message);

    // Return mock signals data on any exception
    const mockSignals: UnifiedSignal[] = [
      {
        id: 'mock-signal-exception-1',
        symbol: symbol || 'BTC/USDT',
        timeframe: timeframe,
        timestamp: new Date().toISOString(),
        execution_timestamp: new Date().toISOString(),
        signal_age_hours: 1.5,
        signal_source: 'mock_strategy_fallback',
        type: 'entry',
        direction: 'BUY',
        strategyId: 'conservative', // Use mock strategy IDs that match frontend
        entry: 46000 + Math.random() * 4000,
        tp1: 48000 + Math.random() * 2000,
        tp2: 50000 + Math.random() * 2000,
        stopLoss: 44000 + Math.random() * 2000,
        source: { provider: 'mock_provider_fallback' },
        marketScenario: 'sideways_consolidation'
      },
      {
        id: 'mock-signal-exception-2',
        symbol: symbol || 'ETH/USDT',
        timeframe: timeframe,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
        signal_age_hours: 1.0,
        signal_source: 'mock_strategy_fallback',
        type: 'entry',
        direction: 'SELL',
        strategyId: 'moderate', // Use mock strategy IDs that match frontend
        entry: 2800 + Math.random() * 200,
        tp1: 2600 + Math.random() * 100,
        tp2: 2400 + Math.random() * 100,
        stopLoss: 3000 + Math.random() * 100,
        source: { provider: 'mock_provider_fallback' },
        marketScenario: 'bearish_correction'
      }
    ];

    const portfolioMetrics = calculatePortfolioMetrics(mockSignals, initialBalance, riskPerTrade);
    const riskParameters: RiskParameters = {
      initial_balance: initialBalance,
      risk_per_trade_pct: riskPerTrade
    };

    // Apply pagination to exception mock signals
    const totalSignals = mockSignals.length;
    const paginatedMockSignals = mockSignals.slice(offset, offset + limit);
    const totalPages = Math.ceil(totalSignals / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < totalSignals;
    const hasPrevPage = offset > 0;

    console.log('[SIGNALS API] ===== SENDING EXCEPTION FALLBACK RESPONSE =====');
    console.log('[SIGNALS API] Exception mock signals count:', paginatedMockSignals.length);
    console.log('[SIGNALS API] Exception error:', err?.message ?? String(err));
    console.log('[SIGNALS API] Response headers:', {
      'Cache-Control': 'public, max-age=300'
    });

    return NextResponse.json({
      signals: paginatedMockSignals,
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
      },
      _mock: true,
      _error: err?.message ?? String(err)
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}
