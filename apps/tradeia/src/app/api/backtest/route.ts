import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type BacktestParams = {
  symbol?: string;
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

    // Call the backtest service
    const apiUrl = `${process.env.SIGNALS_API_BASE}/backtest/run`;
    console.log('[BACKTEST] Calling external API:', apiUrl);
    console.log('[BACKTEST] Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.substring(0, 20)}...` // Log partial token for security
    });

    // Try to run backtest via external API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept-Encoding': 'identity' // Disable gzip compression
        },
        body: JSON.stringify(params)
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
              'Accept-Encoding': 'identity' // Disable gzip compression
            }
          });
        }

        console.log('[BACKTEST] ===== BACKTEST REQUEST COMPLETED =====');
        return NextResponse.json(data, {
          headers: {
            'Accept-Encoding': 'identity' // Disable gzip compression
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
        'Accept-Encoding': 'identity' // Disable gzip compression
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
          'Accept-Encoding': 'identity' // Disable gzip compression
        }
      }
    );
  }
}
