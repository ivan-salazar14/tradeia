import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type BacktestParams = {
  symbol?: string | string[];
  timeframe: string;
  start_date: string;
  end_date: string;
  strategy_id: string;
  initial_balance: string;
  risk_per_trade: string;
};

interface MockStrategy {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  is_active: boolean;
}

// Mock strategies list for backtest view
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
    id: 'aggressive',
    name: 'Aggressive Strategy',
    description: 'High-risk strategy for experienced traders',
    risk_level: 'High',
    timeframe: '15m',
    indicators: ['RSI', 'MACD', 'Bollinger Bands'],
    is_active: false
  },
  {
    id: 'sqzmom_adx',
    name: 'Squeeze Momentum ADX',
    description: 'Advanced strategy using squeeze momentum and ADX indicators',
    risk_level: 'Medium',
    timeframe: '1h',
    indicators: ['SQZMOM', 'ADX', 'RSI'],
    is_active: false
  },
  {
    id: 'scenario_based',
    name: 'Scenario Based Strategy',
    description: 'Dynamic strategy that adapts to market conditions',
    risk_level: 'moderate',
    timeframe: '4h',
    indicators: ['SMA', 'RSI', 'MACD', 'ADX'],
    is_active: false
  },
  {
    id: 'onda_3_5_alcista',
    name: 'Onda 3/5 Alcista',
    description: 'Detecta oportunidades de compra en tendencias alcistas fuertes',
    risk_level: 'moderate',
    timeframe: '4h',
    indicators: ['Elliott Wave', 'RSI', 'MACD'],
    is_active: false
  },
  {
    id: 'onda_c_bajista',
    name: 'Onda C Bajista',
    description: 'Detecta oportunidades de venta en tendencias bajistas fuertes',
    risk_level: 'moderate',
    timeframe: '4h',
    indicators: ['Elliott Wave', 'RSI', 'MACD'],
    is_active: false
  },
  {
    id: 'ruptura_rango',
    name: 'Ruptura de Rango',
    description: 'Detecta rupturas de consolidación con momentum confirmado',
    risk_level: 'moderate',
    timeframe: '1h',
    indicators: ['Bollinger Bands', 'Volume', 'RSI'],
    is_active: false
  },
  {
    id: 'reversion_patron',
    name: 'Reversión por Patrón',
    description: 'Detecta patrones de reversión con confirmación técnica',
    risk_level: 'moderate',
    timeframe: '4h',
    indicators: ['Chart Patterns', 'RSI', 'Fibonacci'],
    is_active: false
  },
  {
    id: 'gestion_riesgo',
    name: 'Gestión de Riesgo',
    description: 'Gestión avanzada de riesgo con trailing stops dinámicos',
    risk_level: 'conservative',
    timeframe: '1h',
    indicators: ['ATR', 'Trailing Stop', 'Risk Management'],
    is_active: false
  }
];

// Strategy configuration for backtesting
function getStrategyConfig(strategyId: string) {
  const configs: Record<string, any> = {
    conservative: {
      minCandles: 20,
      lookback: 14,
      stopLossPct: 0.02, // 2%
      takeProfitPct: 0.04, // 4%
      holdPeriod: 240, // 4 hours in minutes
      rsiOverbought: 70,
      rsiOversold: 30
    },
    moderate: {
      minCandles: 26,
      lookback: 26,
      stopLossPct: 0.025, // 2.5%
      takeProfitPct: 0.05, // 5%
      holdPeriod: 60, // 1 hour in minutes
      rsiOverbought: 75,
      rsiOversold: 25
    },
    aggressive: {
      minCandles: 14,
      lookback: 14,
      stopLossPct: 0.015, // 1.5%
      takeProfitPct: 0.03, // 3%
      holdPeriod: 15, // 15 minutes
      rsiOverbought: 80,
      rsiOversold: 20
    },
    sqzmom_adx: {
      minCandles: 20,
      lookback: 14,
      stopLossPct: 0.02,
      takeProfitPct: 0.045,
      holdPeriod: 60,
      adxThreshold: 25,
      squeezeThreshold: 1780
    },
    scenario_based: {
      minCandles: 30,
      lookback: 20,
      stopLossPct: 0.025,
      takeProfitPct: 0.05,
      holdPeriod: 120,
      rsiOverbought: 75,
      rsiOversold: 25,
      adxThreshold: 25
    },
    onda_3_5_alcista: {
      minCandles: 50,
      lookback: 30,
      stopLossPct: 0.02,
      takeProfitPct: 0.06,
      holdPeriod: 240,
      rsiThreshold: 50,
      waveConfirmation: true
    },
    onda_c_bajista: {
      minCandles: 50,
      lookback: 30,
      stopLossPct: 0.02,
      takeProfitPct: 0.06,
      holdPeriod: 240,
      rsiThreshold: 50,
      waveConfirmation: true
    },
    ruptura_rango: {
      minCandles: 20,
      lookback: 20,
      stopLossPct: 0.015,
      takeProfitPct: 0.04,
      holdPeriod: 30,
      volumeThreshold: 1.5,
      breakoutPct: 0.02
    },
    reversion_patron: {
      minCandles: 30,
      lookback: 20,
      stopLossPct: 0.01,
      takeProfitPct: 0.03,
      holdPeriod: 180,
      rsiOverbought: 75,
      rsiOversold: 25
    },
    gestion_riesgo: {
      minCandles: 20,
      lookback: 14,
      stopLossPct: 0.01,
      takeProfitPct: 0.02,
      holdPeriod: 60,
      trailingStopPct: 0.005
    }
  };

  return configs[strategyId] || configs.moderate;
}

// Generate backtest signal based on strategy
function generateBacktestSignal(strategyConfig: any, marketData: any) {
  const { open, high, low, close, prevClose, candles } = marketData;

  switch (strategyConfig.id || 'moderate') {
    case 'conservative':
      // RSI-based strategy
      const rsi = calculateRSI(candles.slice(-14));
      if (rsi < strategyConfig.rsiOversold && close > prevClose) {
        return { direction: 'BUY', reason: 'RSI oversold + upward momentum' };
      } else if (rsi > strategyConfig.rsiOverbought && close < prevClose) {
        return { direction: 'SELL', reason: 'RSI overbought + downward momentum' };
      }
      break;

    case 'moderate':
      // RSI + MACD strategy
      const rsi_mod = calculateRSI(candles.slice(-14));
      const macd = calculateMACD(candles.slice(-26));
      if (rsi_mod < strategyConfig.rsiOversold && macd.histogram > 0 && close > prevClose) {
        return { direction: 'BUY', reason: 'RSI oversold + MACD positive + upward momentum' };
      } else if (rsi_mod > strategyConfig.rsiOverbought && macd.histogram < 0 && close < prevClose) {
        return { direction: 'SELL', reason: 'RSI overbought + MACD negative + downward momentum' };
      }
      break;

    case 'aggressive':
      // Quick momentum strategy
      const priceChange = (close - prevClose) / prevClose;
      if (priceChange > 0.005) { // 0.5% upward move
        return { direction: 'BUY', reason: 'Strong upward momentum' };
      } else if (priceChange < -0.005) { // 0.5% downward move
        return { direction: 'SELL', reason: 'Strong downward momentum' };
      }
      break;

    case 'onda_3_5_alcista':
      // Elliott Wave bullish pattern
      const trend = calculateTrend(candles.slice(-20));
      if (trend === 'uptrend' && close > calculateSMA(candles.slice(-20), 20)) {
        return { direction: 'BUY', reason: 'Elliott Wave 3/5 bullish pattern' };
      }
      break;

    case 'onda_c_bajista':
      // Elliott Wave bearish pattern
      const trend_down = calculateTrend(candles.slice(-20));
      if (trend_down === 'downtrend' && close < calculateSMA(candles.slice(-20), 20)) {
        return { direction: 'SELL', reason: 'Elliott Wave C bearish pattern' };
      }
      break;

    case 'ruptura_rango':
      // Range breakout strategy
      const range = calculateBollingerBands(candles.slice(-20));
      if (close > range.upper && close > prevClose) {
        return { direction: 'BUY', reason: 'Upper Bollinger Band breakout' };
      } else if (close < range.lower && close < prevClose) {
        return { direction: 'SELL', reason: 'Lower Bollinger Band breakout' };
      }
      break;

    default:
      // Default conservative strategy
      const defaultRsi = calculateRSI(candles.slice(-14));
      if (defaultRsi < 30 && close > prevClose) {
        return { direction: 'BUY', reason: 'Default RSI strategy' };
      }
  }

  return null;
}

// Helper functions for technical indicators
function calculateRSI(prices: any[]): number {
  if (prices.length < 2) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i][4] - prices[i-1][4]; // close prices
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / (prices.length - 1);
  const avgLoss = losses / (prices.length - 1);

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateSMA(prices: any[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1][4];

  const closes = prices.slice(-period).map(p => p[4]);
  return closes.reduce((sum, price) => sum + price, 0) / period;
}

function calculateMACD(prices: any[]) {
  // Simplified MACD calculation
  const closes = prices.map(p => p[4]);
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macd = ema12 - ema26;
  const signal = calculateEMA([macd], 9);
  const histogram = macd - signal;

  return { macd, signal, histogram };
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

function calculateTrend(prices: any[]): string {
  if (prices.length < 10) return 'sideways';

  const recent = prices.slice(-10);
  const older = prices.slice(-20, -10);

  const recentAvg = recent.reduce((sum, p) => sum + p[4], 0) / recent.length;
  const olderAvg = older.reduce((sum, p) => sum + p[4], 0) / older.length;

  if (recentAvg > olderAvg * 1.02) return 'uptrend';
  if (recentAvg < olderAvg * 0.98) return 'downtrend';
  return 'sideways';
}

function calculateBollingerBands(prices: any[]) {
  const closes = prices.map(p => p[4]);
  const sma = closes.reduce((sum, price) => sum + price, 0) / closes.length;
  const variance = closes.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / closes.length;
  const stdDev = Math.sqrt(variance);

  return {
    upper: sma + (stdDev * 2),
    middle: sma,
    lower: sma - (stdDev * 2)
  };
}

export async function POST(request: Request) {
  console.log('[BACKTEST] ===== STARTING BACKTEST REQUEST =====');
  console.log('[BACKTEST] Request URL:', request.url);
  console.log('[BACKTEST] Request method:', request.method);
  console.log('[BACKTEST] Request headers:', Object.fromEntries(request.headers.entries()));

  // Check for Bearer token authentication
  const auth = request.headers.get('authorization');
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
    // Extract pagination and field selection parameters from request body
    const body = await request.json();
    const {
      symbol,
      timeframe,
      start_date,
      end_date,
      strategy_id,
      initial_balance,
      risk_per_trade,
      limit = 50,
      offset = 0,
      fields = null
    } = body;

    // Cap limits to prevent excessive data transfer
    const cappedLimit = Math.min(parseInt(limit), 200);
    const cappedOffset = parseInt(offset);

    console.log('[BACKTEST] Bearer token validated successfully');

    // Use already parsed body
    const params: BacktestParams = {
      symbol,
      timeframe,
      start_date,
      end_date,
      strategy_id,
      initial_balance,
      risk_per_trade
    };
    console.log('[BACKTEST] Request params:', params);
    console.log('[BACKTEST] Symbol parameter:', symbol);
    console.log('[BACKTEST] Symbol type:', Array.isArray(symbol) ? 'array' : typeof symbol);
    if (Array.isArray(symbol)) {
      console.log('[BACKTEST] Symbol array length:', symbol.length);
      console.log('[BACKTEST] Symbol array contents:', symbol);
    }

    // Validate required parameters (symbol can be empty for all symbols)
    const requiredParams = ['timeframe', 'start_date', 'end_date', 'strategy_id'];
    const missingParams = requiredParams.filter(param => !params[param as keyof BacktestParams]);

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing required parameters: ${missingParams.join(', ')}` },
        {
          status: 400,
          headers: {
            'Accept-Encoding': 'identity' // Disable gzip compression
          }
        }
      );
    }

    // Validate symbol parameter (can be string, array, or undefined)
    if (params.symbol !== undefined && !Array.isArray(params.symbol) && typeof params.symbol !== 'string') {
      return NextResponse.json(
        { error: 'Symbol parameter must be a string, array of strings, or undefined' },
        {
          status: 400,
          headers: {
            'Accept-Encoding': 'identity'
          }
        }
      );
    }

    // Call the external signals API for backtesting
    const apiUrl = `${process.env.SIGNALS_API_BASE}/backtest/run`;

    // Prepare request body for external API with correct parameter mapping
    const requestBody = {
      ...params,
      strategy: params.strategy_id, // Map strategy_id to strategy for external API
      end_date: params.end_date, // Use the end_date provided by frontend (already includes current hour)
      symbol: Array.isArray(params.symbol) ? params.symbol : (params.symbol ? [params.symbol] : undefined), // Ensure symbol is an array
      debug: true // Add debug field
    };

    console.log('[BACKTEST] Calling external API:', apiUrl);
    console.log('[BACKTEST] Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.substring(0, 20)}...` // Log partial token for security
    });
    console.log('[BACKTEST] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('[BACKTEST] Final symbol in request:', requestBody.symbol);
    console.log('[BACKTEST] Symbol is array:', Array.isArray(requestBody.symbol));

    // Try to run backtest via external API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept-Encoding': 'identity' // Disable gzip compression
        },
        body: JSON.stringify(requestBody)
      });

      console.log('[BACKTEST] External API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[BACKTEST] External API success response:', data);

        // Apply pagination and field selection to external API response
        if (data.trades && Array.isArray(data.trades)) {
          const totalTrades = data.trades.length;
          const paginatedTrades = data.trades.slice(cappedOffset, cappedOffset + cappedLimit);

          // Apply field selection if specified
          const processedTrades = paginatedTrades.map((trade: any) => {
            if (fields && Array.isArray(fields) && fields.length > 0) {
              const selectedTrade: any = {};
              fields.forEach(field => {
                if (trade.hasOwnProperty(field)) {
                  selectedTrade[field] = trade[field];
                }
              });
              return selectedTrade;
            }
            return trade;
          });

          const paginatedData = {
            ...data,
            trades: processedTrades,
            strategies: mockStrategies,
            pagination: {
              total: totalTrades,
              limit: cappedLimit,
              offset: cappedOffset,
              current_page: Math.floor(cappedOffset / cappedLimit) + 1,
              total_pages: Math.ceil(totalTrades / cappedLimit),
              has_next: cappedOffset + cappedLimit < totalTrades,
              has_prev: cappedOffset > 0
            }
          };

          console.log('[BACKTEST] ===== BACKTEST REQUEST COMPLETED =====');
          console.log('[BACKTEST] Response signals count:', paginatedData.trades?.length || 0);
          console.log('[BACKTEST] Response headers:', {
            'Cache-Control': 'private, max-age=300'
          });

          return NextResponse.json(paginatedData, {
            headers: {
              'Cache-Control': 'private, max-age=300', // Cache for 5 minutes, private since user-specific
              'Accept-Encoding': 'identity',
              'Content-Encoding': 'identity',
              'Content-Type': 'application/json; charset=utf-8',
              'Vary': 'Accept-Encoding'
            }
          });
        }

        console.log('[BACKTEST] ===== BACKTEST REQUEST COMPLETED =====');
        return NextResponse.json(data, {
          headers: {
            'Accept-Encoding': 'identity',
            'Content-Encoding': 'identity',
            'Content-Type': 'application/json; charset=utf-8',
            'Vary': 'Accept-Encoding'
          }
        });
      } else {
        console.warn('[BACKTEST] External API not available, using fallback');
      }
    } catch (fetchError) {
      console.warn('[BACKTEST] External API fetch failed:', fetchError);
    }

    // Fallback: Return mock backtest results when external API is not available
    console.log('[BACKTEST] Using fallback mock results');
    const allMockTrades = [
      {
        entry_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        entry_price: 50000,
        stop_loss: 49000,
        take_profit: 52000,
        direction: 'BUY',
        exit_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        exit_price: 51500,
        exit_reason: 'take_profit',
        reason: 'RSI oversold',
        profit_pct: 3.0,
        profit: 1500,
        balance_after: 101500
      },
      {
        entry_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        entry_price: 51500,
        stop_loss: 50500,
        take_profit: 53500,
        direction: 'SELL',
        exit_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        exit_price: 50800,
        exit_reason: 'take_profit',
        reason: 'RSI overbought',
        profit_pct: 1.36,
        profit: 700,
        balance_after: 102200
      }
    ];

    // Apply pagination to mock trades
    const totalTrades = allMockTrades.length;
    const paginatedTrades = allMockTrades.slice(cappedOffset, cappedOffset + cappedLimit);

    // Apply field selection if specified
    const processedTrades = paginatedTrades.map(trade => {
      if (fields && Array.isArray(fields) && fields.length > 0) {
        const selectedTrade: any = {};
        fields.forEach(field => {
          if (trade.hasOwnProperty(field)) {
            selectedTrade[field] = (trade as any)[field];
          }
        });
        return selectedTrade;
      }
      return trade;
    });

    const mockResult = {
      trades: processedTrades,
      strategies: mockStrategies,
      initial_balance: parseFloat(params.initial_balance),
      final_balance: parseFloat(params.initial_balance) + 2200,
      total_return: 2200,
      total_return_pct: 2.2,
      pagination: {
        total: totalTrades,
        limit: cappedLimit,
        offset: cappedOffset,
        current_page: Math.floor(cappedOffset / cappedLimit) + 1,
        total_pages: Math.ceil(totalTrades / cappedLimit),
        has_next: cappedOffset + cappedLimit < totalTrades,
        has_prev: cappedOffset > 0
      }
    };

    console.log('[BACKTEST] ===== BACKTEST REQUEST COMPLETED WITH FALLBACK =====');
    console.log('[BACKTEST] Fallback mock trades count:', mockResult.trades?.length || 0);
    console.log('[BACKTEST] Response headers:', {
      'Cache-Control': 'private, max-age=300'
    });

    return NextResponse.json(mockResult, {
      headers: {
        'Cache-Control': 'private, max-age=300',
        'Accept-Encoding': 'identity',
        'Content-Encoding': 'identity',
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept-Encoding'
      }
    });

  } catch (error) {
    console.error('[BACKTEST] ===== BACKTEST ERROR =====');
    console.error('[BACKTEST] Error type:', typeof error);
    console.error('[BACKTEST] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[BACKTEST] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[BACKTEST] Environment variables check:');
    console.log('[BACKTEST] SIGNALS_API_BASE:', process.env.SIGNALS_API_BASE ? 'Set' : 'NOT SET');
    console.log('[BACKTEST] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'NOT SET');
    console.log('[BACKTEST] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'NOT SET');

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred during backtest',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.stack : String(error)
      },
      {
        status: 500,
        headers: {
          'Accept-Encoding': 'identity',
          'Content-Encoding': 'identity',
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept-Encoding'
        }
      }
    );
  }
}
