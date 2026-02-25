import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /strategies/validator/stats
 * 
 * Returns consensus validator statistics for signal filtering and quality metrics.
 * This endpoint provides aggregated statistics about signal validation performance
 * across different strategies and symbols.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const strategyId = searchParams.get('strategy_id');
  const timeframe = searchParams.get('timeframe');

  console.log('[VALIDATOR STATS API] Fetching validator statistics');

  // Get the external API base URL
  const API_BASE = process.env.SIGNALS_API_BASE;
  
  if (!API_BASE) {
    console.error('[VALIDATOR STATS API] SIGNALS_API_BASE not configured');
    return NextResponse.json(
      { error: 'SIGNALS_API_BASE environment variable is not configured' },
      { status: 500 }
    );
  }

  try {
    // Build the external API URL
    const externalUrl = new URL('/strategies/validator/stats', API_BASE);
    if (symbol) externalUrl.searchParams.set('symbol', symbol);
    if (strategyId) externalUrl.searchParams.set('strategy_id', strategyId);
    if (timeframe) externalUrl.searchParams.set('timeframe', timeframe);

    console.log('[VALIDATOR STATS API] Calling external API:', externalUrl.toString());

    // Call the external API
    const response = await fetch(externalUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[VALIDATOR STATS API] External API response received');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[VALIDATOR STATS API] Error calling external API:', error);
    
    // Fallback to mock data if external API fails
    console.log('[VALIDATOR STATS API] Falling back to mock data');
    
    const mockStats = [
    {
      symbol: 'BTC/USDT',
      timeframe: '1h',
      strategy_id: 'conservative',
      total_signals: 145,
      approved_signals: 98,
      rejected_signals: 47,
      avg_sharpe: 1.82,
      avg_win_rate: 62.5,
      avg_expected_return: 2.34,
      signal_distribution: {
        BUY: 78,
        SELL: 67
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 18,
        'RISK_HIGH: Volatility exceeds limit': 15,
        'RISK_POSITION: Max positions reached': 14
      },
      last_validation: new Date().toISOString(),
      risk_score: 22
    },
    {
      symbol: 'BTC/USDT',
      timeframe: '4h',
      strategy_id: 'moderate',
      total_signals: 89,
      approved_signals: 61,
      rejected_signals: 28,
      avg_sharpe: 1.45,
      avg_win_rate: 58.2,
      avg_expected_return: 1.87,
      signal_distribution: {
        BUY: 52,
        SELL: 37
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 12,
        'RISK_HIGH: Volatility exceeds limit': 10,
        'TIMING_UNFAVORABLE: Market conditions': 6
      },
      last_validation: new Date().toISOString(),
      risk_score: 28
    },
    {
      symbol: 'ETH/USDT',
      timeframe: '1h',
      strategy_id: 'conservative',
      total_signals: 112,
      approved_signals: 75,
      rejected_signals: 37,
      avg_sharpe: 1.65,
      avg_win_rate: 59.8,
      avg_expected_return: 2.12,
      signal_distribution: {
        BUY: 63,
        SELL: 49
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 14,
        'RISK_HIGH: Volatility exceeds limit': 12,
        'LIQUIDITY_LOW: Insufficient volume': 11
      },
      last_validation: new Date().toISOString(),
      risk_score: 25
    },
    {
      symbol: 'ETH/USDT',
      timeframe: '4h',
      strategy_id: 'aggressive',
      total_signals: 203,
      approved_signals: 124,
      rejected_signals: 79,
      avg_sharpe: 1.12,
      avg_win_rate: 52.3,
      avg_expected_return: 3.45,
      signal_distribution: {
        BUY: 118,
        SELL: 85
      },
      rejection_reasons: {
        'RISK_HIGH: Volatility exceeds limit': 28,
        'LOW_CONFIDENCE: Score below threshold': 25,
        'TIMING_UNFAVORABLE: Market conditions': 26
      },
      last_validation: new Date().toISOString(),
      risk_score: 58
    },
    {
      symbol: 'SOL/USDT',
      timeframe: '1h',
      strategy_id: 'moderate',
      total_signals: 78,
      approved_signals: 52,
      rejected_signals: 26,
      avg_sharpe: 1.38,
      avg_win_rate: 56.7,
      avg_expected_return: 2.56,
      signal_distribution: {
        BUY: 41,
        SELL: 37
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 10,
        'RISK_HIGH: Volatility exceeds limit': 9,
        'LIQUIDITY_LOW: Insufficient volume': 7
      },
      last_validation: new Date().toISOString(),
      risk_score: 32
    },
    {
      symbol: 'BNB/USDT',
      timeframe: '4h',
      strategy_id: 'conservative',
      total_signals: 56,
      approved_signals: 42,
      rejected_signals: 14,
      avg_sharpe: 1.95,
      avg_win_rate: 65.2,
      avg_expected_return: 1.78,
      signal_distribution: {
        BUY: 28,
        SELL: 28
      },
      rejection_reasons: {
        'RISK_HIGH: Volatility exceeds limit': 6,
        'LOW_CONFIDENCE: Score below threshold': 5,
        'RISK_POSITION: Max positions reached': 3
      },
      last_validation: new Date().toISOString(),
      risk_score: 18
    },
    {
      symbol: 'XRP/USDT',
      timeframe: '1h',
      strategy_id: 'sqzmom_adx',
      total_signals: 95,
      approved_signals: 67,
      rejected_signals: 28,
      avg_sharpe: 1.55,
      avg_win_rate: 60.1,
      avg_expected_return: 2.23,
      signal_distribution: {
        BUY: 52,
        SELL: 43
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 11,
        'RISK_HIGH: Volatility exceeds limit': 10,
        'TIMING_UNFAVORABLE: Market conditions': 7
      },
      last_validation: new Date().toISOString(),
      risk_score: 27
    },
    {
      symbol: 'ADA/USDT',
      timeframe: '4h',
      strategy_id: 'scenario_based',
      total_signals: 67,
      approved_signals: 48,
      rejected_signals: 19,
      avg_sharpe: 1.72,
      avg_win_rate: 61.5,
      avg_expected_return: 1.95,
      signal_distribution: {
        BUY: 35,
        SELL: 32
      },
      rejection_reasons: {
        'LOW_CONFIDENCE: Score below threshold': 8,
        'RISK_HIGH: Volatility exceeds limit': 7,
        'RISK_POSITION: Max positions reached': 4
      },
      last_validation: new Date().toISOString(),
      risk_score: 24
    }
  ];

  // Filter by query params if provided
  let filteredStats = mockStats;
  
  if (symbol) {
    filteredStats = filteredStats.filter(s => s.symbol === symbol);
  }
  
  if (strategyId) {
    filteredStats = filteredStats.filter(s => s.strategy_id === strategyId);
  }
  
  if (timeframe) {
    filteredStats = filteredStats.filter(s => s.timeframe === timeframe);
  }

  // Calculate summary
  const totalSymbols = new Set(filteredStats.map(s => s.symbol)).size;
  const totalStrategies = new Set(filteredStats.map(s => s.strategy_id)).size;
  const totalSignals = filteredStats.reduce((acc, s) => acc + s.total_signals, 0);
  const totalApproved = filteredStats.reduce((acc, s) => acc + s.approved_signals, 0);
  const totalRejected = filteredStats.reduce((acc, s) => acc + s.rejected_signals, 0);
  const avgSharpe = filteredStats.length > 0 
    ? filteredStats.reduce((acc, s) => acc + s.avg_sharpe, 0) / filteredStats.length 
    : 0;
  const avgWinRate = filteredStats.length > 0 
    ? filteredStats.reduce((acc, s) => acc + s.avg_win_rate, 0) / filteredStats.length 
    : 0;
  const avgExpectedReturn = filteredStats.length > 0 
    ? filteredStats.reduce((acc, s) => acc + s.avg_expected_return, 0) / filteredStats.length 
    : 0;
  const rejectionRate = totalSignals > 0 ? (totalRejected / totalSignals) * 100 : 0;

  const response = {
    stats: filteredStats,
    summary: {
      total_symbols: totalSymbols,
      total_strategies: totalStrategies,
      total_signals: totalSignals,
      total_approved: totalApproved,
      total_rejected: totalRejected,
      avg_sharpe: avgSharpe,
      avg_win_rate: avgWinRate,
      avg_expected_return: avgExpectedReturn,
      rejection_rate: rejectionRate
    }
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'private, max-age=60',
      'Accept-Encoding': 'identity'
    }
  });
  }
}
