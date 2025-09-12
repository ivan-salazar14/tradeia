import { NextRequest, NextResponse } from 'next/server';
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

// Simple in-memory circuit breaker (per server instance)
let failCount = 0;
let openUntil = 0; // epoch ms
const OPEN_THRESHOLD = 3; // failures
const OPEN_MS = 30_000; // 30s cooldown

export async function GET(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json({ error: 'SIGNALS_API_BASE is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get('symbol') || '').toUpperCase();
  const timeframe = (searchParams.get('timeframe') || '4h').toLowerCase();
  const strategyIdParam = searchParams.get('strategy_id')?.trim() || '';
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
    // If client provided explicit strategies, fetch stored signals filtered by strategy_id.
    // Else, generate signals using user's current strategy (external server resolves it).
    const activeHeader = req.headers.get('x-active-strategies');
    let resp: Response;
    if (activeHeader || strategyIdParam) {
      const parts = activeHeader
        ? activeHeader.split(',').map(s => s.trim()).filter(Boolean)
        : strategyIdParam
          ? [strategyIdParam]
          : [];
      const qsSignals = new URLSearchParams(qs);
      // only restrict upstream when exactly one strategy is chosen
      if (parts.length === 1) qsSignals.set('strategy_id', parts[0]);
      const getUrl = `${API_BASE}/signals?${qsSignals.toString()}`;
      resp = await fetch(getUrl, {
        headers: {
          'Authorization': auth,
        },
        cache: 'no-store',
      });
    } else {
      const postUrl = `${API_BASE}/strategies/signals/generate?${qs.toString()}`;
      resp = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Authorization': auth,
        },
        cache: 'no-store',
      });
    }

    if (!resp.ok) {
      const text = await resp.text();
      failCount += 1;
      if (failCount >= OPEN_THRESHOLD) {
        openUntil = Date.now() + OPEN_MS;
      }
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
          strategyId: strategyIdParam || 'conservative',
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
          strategyId: strategyIdParam || 'moderate',
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

      return NextResponse.json({
        signals: paginatedMockSignals,
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
          'Content-Encoding': 'gzip',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }

    const data = await resp.json();

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

    // Optional: filter by active strategies if provided in header X-Active-Strategies: csv
    // reuse header value read earlier
    let filtered = quality;
    if (activeHeader) {
      const active = new Set(
        activeHeader
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
      filtered = quality.filter((s) => !s.strategyId || active.has(s.strategyId));
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

    return NextResponse.json({
      signals: transformedSignals,
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
        'Content-Encoding': 'gzip',
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
        strategyId: strategyIdParam || 'conservative',
        entry: 46000 + Math.random() * 4000,
        tp1: 48000 + Math.random() * 2000,
        tp2: 50000 + Math.random() * 2000,
        stopLoss: 44000 + Math.random() * 2000,
        source: { provider: 'mock_provider_fallback' },
        marketScenario: 'sideways_consolidation'
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

    return NextResponse.json({
      signals: paginatedMockSignals,
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
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}
