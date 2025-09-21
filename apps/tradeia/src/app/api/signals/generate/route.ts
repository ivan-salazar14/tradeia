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

// Route handler for POST /api/signals/generate
export async function POST(req: NextRequest) {
  console.log('[SIGNALS GENERATE] ===== STARTING GENERATE SIGNALS REQUEST =====');

  if (!API_BASE) {
    console.error('[SIGNALS GENERATE] SIGNALS_API_BASE environment variable is not configured');
    return NextResponse.json({
      error: 'SIGNALS_API_BASE is not configured',
      details: 'Please check your environment variables'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity'
      }
    });
  }

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
  const token = auth.substring(7); // Remove 'Bearer ' prefix
  if (!token || token.length < 10) {
    return NextResponse.json({ error: 'Invalid Bearer token' }, {
      status: 401,
      headers: {
        'Accept-Encoding': 'identity'
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
      risk_per_trade = 1.0,
      strategy_id
    } = body;

    console.log('[SIGNALS GENERATE] Request body:', { symbol, timeframe, start_date, end_date, initial_balance, risk_per_trade, strategy_id });

    // Determine strategy to use
    const strategyToUse = strategy_id || 'moderate';
    console.log('[SIGNALS GENERATE] Using strategy:', strategyToUse);

    // Available strategies
    const availableStrategies = ['conservative', 'moderate', 'aggressive', 'sqzmom_adx'];

    if (!availableStrategies.includes(strategyToUse)) {
      return NextResponse.json({
        error: 'Strategy not found',
        details: `Strategy '${strategyToUse}' is not available. Available strategies: ${availableStrategies.join(', ')}`
      }, {
        status: 404,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Basic input validation
    if (symbol && !/^[A-Z0-9]+\/[A-Z0-9]+$/.test(symbol)) {
      return NextResponse.json({ error: 'Invalid symbol format. Use BASE/QUOTE e.g., BTC/USDT' }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }
    if (!/^(\d+[mhdw]|1m|5m|15m|1h|4h|1d|1w)$/i.test(timeframe)) {
      return NextResponse.json({ error: 'Invalid timeframe format.' }, {
        status: 400,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Circuit breaker check
    const now = Date.now();
    if (openUntil > now) {
      return NextResponse.json({ error: 'Upstream temporarily unavailable (circuit open). Try again later.' }, {
        status: 503,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    const qs = new URLSearchParams();
    if (symbol) qs.set('symbol', symbol);
    qs.set('timeframe', timeframe);
    qs.set('strategy_id', strategyToUse);

    // Send dates in simple format without timezone to avoid comparison issues
    if (start_date) {
      // Aggressively strip timezone info and extract just the date part
      let dateOnly = start_date.split('T')[0]; // Remove time part
      dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
      dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
      dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
      console.log('[SIGNALS GENERATE] Sending start_date as date-only:', dateOnly, 'from:', start_date);
      qs.set('start_date', dateOnly);
    }
    if (end_date) {
      // Aggressively strip timezone info and extract just the date part
      let dateOnly = end_date.split('T')[0]; // Remove time part
      dateOnly = dateOnly.split('+')[0]; // Remove timezone offset
      dateOnly = dateOnly.split('Z')[0]; // Remove Z timezone
      dateOnly = dateOnly.split(' ')[0]; // Remove any spaces
      console.log('[SIGNALS GENERATE] Sending end_date as date-only:', dateOnly, 'from:', end_date);
      qs.set('end_date', dateOnly);
    }

    try {
      // Try different possible endpoints for signals generation
      const possibleEndpoints = [
        `${API_BASE}/strategies/signals/generate`,
        `${API_BASE}/signals/generate`
      ];

      let response: Response | null = null;
      let postUrl = '';

      for (const endpoint of possibleEndpoints) {
        postUrl = `${endpoint}?${qs.toString()}`;
        console.log('[SIGNALS GENERATE] Trying endpoint:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));

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
            signal: AbortSignal.timeout(10000), // 10 seconds timeout
          });

          // If we get a successful response (2xx), use this endpoint
          if (response.ok) {
            console.log('[SIGNALS GENERATE] ✅ Found working endpoint:', endpoint);
            break;
          } else {
            console.log('[SIGNALS GENERATE] ❌ Endpoint returned status:', response.status, 'trying next...');
          }
        } catch (endpointError) {
          const errorMessage = endpointError instanceof Error ? endpointError.message : String(endpointError);
          console.log('[SIGNALS GENERATE] ❌ Endpoint failed:', endpoint, 'Error:', errorMessage);
          continue;
        }
      }

      // If no endpoint worked, return error
      if (!response || !response.ok) {
        console.error('[SIGNALS GENERATE] ❌ All endpoints failed');
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
        console.warn('[SIGNALS GENERATE] External API failed with status:', resp.status);
        console.warn('[SIGNALS GENERATE] External API response text:', text);
        console.warn('[SIGNALS GENERATE] Request URL that failed:', postUrl.replace(/Authorization=[^&]*/, 'Authorization=***'));

        return NextResponse.json({
          error: 'Signals generation API returned an error',
          details: `External API responded with status ${resp.status}: ${text}`,
          endpoint: postUrl.split('?')[0], // Show endpoint without query params
        }, {
          status: resp.status,
          headers: {
            'Accept-Encoding': 'identity'
          }
        });
      }

      const data = await resp.json();
      console.log('[SIGNALS GENERATE] External API response data:', JSON.stringify(data, null, 2));

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

      // Filter by requested strategy
      let filtered = quality;
      if (strategyToUse) {
        const activeSet = new Set([strategyToUse]);
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

      console.log('[SIGNALS GENERATE] ===== SENDING SUCCESS RESPONSE =====');
      console.log('[SIGNALS GENERATE] Response signals count:', transformedSignals.length);

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
      console.warn('[SIGNALS GENERATE] External API not available:', networkError);
      failCount += 1;
      if (failCount >= OPEN_THRESHOLD) {
        openUntil = Date.now() + OPEN_MS;
      }

      // Provide mock signals as fallback
      console.log('[SIGNALS GENERATE] Using mock signals as fallback');

      const mockSignals = generateMockSignalsForStrategy(strategyToUse, symbol, timeframe, initial_balance, risk_per_trade);
      const portfolioMetrics = calculatePortfolioMetrics(mockSignals as UnifiedSignal[], initial_balance, risk_per_trade);
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
        _message: 'External API unavailable - showing mock signals',
        debug_info: {
          external_api_url: API_BASE,
          network_error: networkError instanceof Error ? networkError.message : String(networkError),
          requested_params: {
            symbol,
            timeframe,
            start_date,
            end_date,
            initial_balance,
            risk_per_trade,
            strategy_id: strategyToUse
          }
        }
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

    console.warn('[SIGNALS GENERATE] Request failed with exception:', err?.message);

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

function generateMockSignalsForStrategy(strategy: string, symbol: string, timeframe: string, initialBalance: number, riskPerTrade: number) {
  const baseSymbol = symbol || 'BTC/USDT';
  const signals = [];

  switch (strategy) {
    case 'conservative':
      signals.push({
        id: `generated-${strategy}-1`,
        symbol: baseSymbol,
        timeframe: timeframe,
        timestamp: new Date().toISOString(),
        execution_timestamp: new Date().toISOString(),
        signal_age_hours: 0.1,
        signal_source: 'generated_conservative',
        type: 'entry' as const,
        direction: 'BUY' as const,
        strategyId: strategy,
        entry: 50000,
        tp1: 50250,
        tp2: 50500,
        stopLoss: 49750,
        source: { provider: 'conservative_provider' },
        position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49750) * 50000,
        risk_amount: initialBalance * riskPerTrade / 100,
        reward_to_risk: Math.abs(50250 - 50000) / Math.abs(50000 - 49750)
      });
      break;

    case 'moderate':
      signals.push(
        {
          id: `generated-${strategy}-1`,
          symbol: baseSymbol,
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0.1,
          signal_source: 'generated_moderate',
          type: 'entry' as const,
          direction: 'BUY' as const,
          strategyId: strategy,
          entry: 50000,
          tp1: 51000,
          tp2: 52000,
          stopLoss: 49000,
          source: { provider: 'moderate_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49000) * 50000,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(51000 - 50000) / Math.abs(50000 - 49000)
        },
        {
          id: `generated-${strategy}-2`,
          symbol: baseSymbol === 'BTC/USDT' ? 'ETH/USDT' : baseSymbol,
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
          signal_age_hours: 1,
          signal_source: 'generated_moderate',
          type: 'entry' as const,
          direction: 'SELL' as const,
          strategyId: strategy,
          entry: 3000,
          tp1: 2900,
          tp2: 2800,
          stopLoss: 3100,
          source: { provider: 'moderate_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(3000 - 3100) * 3000,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(2900 - 3000) / Math.abs(3000 - 3100)
        }
      );
      break;

    case 'aggressive':
      signals.push(
        {
          id: `generated-${strategy}-1`,
          symbol: baseSymbol,
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0.1,
          signal_source: 'generated_aggressive',
          type: 'entry' as const,
          direction: 'BUY' as const,
          strategyId: strategy,
          entry: 50000,
          tp1: 53000,
          tp2: 55000,
          stopLoss: 48500,
          source: { provider: 'aggressive_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 48500) * 50000,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(53000 - 50000) / Math.abs(50000 - 48500)
        },
        {
          id: `generated-${strategy}-2`,
          symbol: baseSymbol === 'BTC/USDT' ? 'SOL/USDT' : baseSymbol,
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          execution_timestamp: new Date(Date.now() - 1800000).toISOString(),
          signal_age_hours: 0.5,
          signal_source: 'generated_aggressive',
          type: 'entry' as const,
          direction: 'SELL' as const,
          strategyId: strategy,
          entry: 150,
          tp1: 135,
          tp2: 125,
          stopLoss: 158,
          source: { provider: 'aggressive_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(150 - 158) * 150,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(135 - 150) / Math.abs(150 - 158)
        }
      );
      break;

    case 'sqzmom_adx':
      signals.push(
        {
          id: `generated-${strategy}-1`,
          symbol: baseSymbol,
          timeframe: timeframe,
          timestamp: new Date().toISOString(),
          execution_timestamp: new Date().toISOString(),
          signal_age_hours: 0.1,
          signal_source: 'generated_sqzmom_adx',
          type: 'entry' as const,
          direction: 'BUY' as const,
          strategyId: strategy,
          entry: 50000,
          tp1: 51500,
          tp2: 52500,
          stopLoss: 48800,
          source: { provider: 'sqzmom_adx_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 48800) * 50000,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(51500 - 50000) / Math.abs(50000 - 48800)
        },
        {
          id: `generated-${strategy}-2`,
          symbol: baseSymbol === 'BTC/USDT' ? 'ADA/USDT' : baseSymbol,
          timeframe: timeframe,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          execution_timestamp: new Date(Date.now() - 7200000).toISOString(),
          signal_age_hours: 2,
          signal_source: 'generated_sqzmom_adx',
          type: 'entry' as const,
          direction: 'SELL' as const,
          strategyId: strategy,
          entry: 0.5,
          tp1: 0.475,
          tp2: 0.455,
          stopLoss: 0.515,
          source: { provider: 'sqzmom_adx_provider' },
          position_size: (initialBalance * riskPerTrade / 100) / Math.abs(0.5 - 0.515) * 0.5,
          risk_amount: initialBalance * riskPerTrade / 100,
          reward_to_risk: Math.abs(0.475 - 0.5) / Math.abs(0.5 - 0.515)
        }
      );
      break;

    default:
      // Fallback to moderate
      signals.push({
        id: `generated-fallback-1`,
        symbol: baseSymbol,
        timeframe: timeframe,
        timestamp: new Date().toISOString(),
        execution_timestamp: new Date().toISOString(),
        signal_age_hours: 0.1,
        signal_source: 'generated_fallback',
        type: 'entry' as const,
        direction: 'BUY' as const,
        strategyId: 'moderate',
        entry: 50000,
        tp1: 51000,
        tp2: 52000,
        stopLoss: 49000,
        source: { provider: 'fallback_provider' },
        position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49000) * 50000,
        risk_amount: initialBalance * riskPerTrade / 100,
        reward_to_risk: Math.abs(51000 - 50000) / Math.abs(50000 - 49000)
      });
  }

  return signals;
}