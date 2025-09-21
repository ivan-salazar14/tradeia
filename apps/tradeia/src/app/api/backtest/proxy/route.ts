import { NextResponse } from 'next/server';

interface Trade {
  symbol: string;
  entry_time: string;
  exit_time?: string;
  entry_price: number;
  exit_price?: number;
  direction: string;
  stop_loss?: number;
  take_profit?: number;
  exit_reason?: string;
  reason?: string;
  profit_pct?: number;
  profit?: number;
  balance_after?: number;
}

// Transform external API response to match frontend expectations
function transformBacktestResponse(data: any, params: any) {
  console.log('[BACKTEST-PROXY] Transforming response data...');

  // Flatten all trades from symbol_results into a single array
  const allTrades: Trade[] = [];

  if (data.symbol_results) {
    Object.keys(data.symbol_results).forEach(symbol => {
      const symbolData = data.symbol_results[symbol];
      if (symbolData.trades && Array.isArray(symbolData.trades)) {
        // Add symbol to each trade if not present
        const tradesWithSymbol = symbolData.trades.map((trade: Trade) => ({
          ...trade,
          symbol: trade.symbol || symbol
        }));

        // Deduplicate trades based on unique characteristics
        const uniqueTrades = tradesWithSymbol.filter((trade: Trade, index: number, self: Trade[]) => {
          return index === self.findIndex((t: Trade) =>
            t.symbol === trade.symbol &&
            t.entry_time === trade.entry_time &&
            t.exit_time === trade.exit_time &&
            t.entry_price === trade.entry_price &&
            t.exit_price === trade.exit_price &&
            t.direction === trade.direction
          );
        });

        allTrades.push(...uniqueTrades);
      }
    });
  }

  console.log('[BACKTEST-PROXY] Flattened trades count:', allTrades.length);

  // Calculate summary statistics
  const initialBalance = parseFloat(params.initial_balance) || 10000;
  let finalBalance = initialBalance;

  if (allTrades.length > 0) {
    // Sort trades by exit_time to get the final balance
    const sortedTrades = allTrades.sort((a, b) =>
      new Date(a.exit_time || a.entry_time).getTime() - new Date(b.exit_time || b.entry_time).getTime()
    );

    // Use the last trade's balance_after if available, otherwise calculate
    const lastTrade = sortedTrades[sortedTrades.length - 1];
    if (lastTrade.balance_after !== undefined) {
      finalBalance = lastTrade.balance_after;
    } else {
      // Calculate final balance by accumulating profits
      finalBalance = sortedTrades.reduce((balance, trade) => {
        return balance + (trade.profit || 0);
      }, initialBalance);
    }
  }

  const totalReturn = finalBalance - initialBalance;
  const totalReturnPct = initialBalance > 0 ? (totalReturn / initialBalance) * 100 : 0;

  const transformedData = {
    trades: allTrades,
    initial_balance: initialBalance,
    final_balance: finalBalance,
    total_return: totalReturn,
    total_return_pct: totalReturnPct,
    symbols_tested: data.symbols_tested || [],
    // Keep original data for debugging
    _original_response: data
  };

  console.log('[BACKTEST-PROXY] Summary stats:', {
    initial_balance: initialBalance,
    final_balance: finalBalance,
    total_return: totalReturn,
    total_return_pct: totalReturnPct,
    trades_count: allTrades.length
  });

  return transformedData;
}

export async function POST(request: Request) {
  console.log('[BACKTEST-PROXY] ===== STARTING BACKTEST PROXY =====');

  try {
    const body = await request.json();
    const { token, ...params } = body;

    console.log('[BACKTEST-PROXY] Received token:', token ? 'Present' : 'NULL/MISSING');
    console.log('[BACKTEST-PROXY] Request params:', params);
    console.log('[BACKTEST-PROXY] Symbol parameter:', params.symbol);
    console.log('[BACKTEST-PROXY] Symbol type:', Array.isArray(params.symbol) ? 'array' : typeof params.symbol);
    if (Array.isArray(params.symbol)) {
      console.log('[BACKTEST-PROXY] Symbol array length:', params.symbol.length);
      console.log('[BACKTEST-PROXY] Symbol array contents:', params.symbol);
    }

    if (!token) {
      console.error('[BACKTEST-PROXY] No token provided in request');
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Validate required parameters (symbol can be empty for all symbols)
    const requiredParams = ['timeframe', 'start_date', 'end_date', 'strategy_id'];
    const missingParams = requiredParams.filter(param => !params[param] || params[param] === '');

    if (missingParams.length > 0) {
      return NextResponse.json(
        { error: `Missing or empty required parameters: ${missingParams.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate symbol parameter (can be string, array, or undefined)
    if (params.symbol !== undefined && !Array.isArray(params.symbol) && typeof params.symbol !== 'string') {
      return NextResponse.json(
        { error: 'Symbol parameter must be a string, array of strings, or undefined' },
        { status: 400 }
      );
    }

    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:8000';
    const url = `${apiBase}/backtest/run`;

    console.log('[BACKTEST-PROXY] External API URL:', apiBase);
    console.log('[BACKTEST-PROXY] Full URL:', url);
    
    // Try to run backtest via external API with timeout and better error handling
    try {
      // Prepare request body for external API with correct parameter mapping
      const requestBody = {
        ...params,
        strategy: params.strategy_id, // Map strategy_id to strategy for external API
        end_date: params.end_date, // Use the end_date provided by frontend (already includes current hour)
        symbol: Array.isArray(params.symbol) ? params.symbol : (params.symbol ? [params.symbol] : undefined), // Ensure symbol is an array
        debug: true // Add debug field as shown in curl example
      };

      console.log('[BACKTEST-PROXY] About to call external API:');
      console.log('[BACKTEST-PROXY] - Method: POST');
      console.log('[BACKTEST-PROXY] - URL:', url);
      console.log('[BACKTEST-PROXY] - Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.substring(0, 20)}...` // Log partial token for security
      });
      console.log('[BACKTEST-PROXY] - Request body:', JSON.stringify(requestBody, null, 2));
      console.log('[BACKTEST-PROXY] - Final symbol in request:', requestBody.symbol);
      console.log('[BACKTEST-PROXY] - Symbol is array:', Array.isArray(requestBody.symbol));
      console.log('[BACKTEST-PROXY] - Sending JSON body to external API');

      // Create AbortController for timeout handling (5 minutes = 300000ms)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('[BACKTEST-PROXY] External API call timed out after 5 minutes');
      }, 300000);

      const startTime = Date.now();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log(`[BACKTEST-PROXY] External API response received in ${duration.toFixed(2)} seconds`);
      console.log(`[BACKTEST-PROXY] Response status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        console.log('[BACKTEST-PROXY] External API call successful');
        const data = await response.json();
        console.log('[BACKTEST-PROXY] External API response data:', JSON.stringify(data, null, 2));
        console.log('[BACKTEST-PROXY] External API response keys:', Object.keys(data));

        // Transform the external API response to match frontend expectations
        const transformedData = transformBacktestResponse(data, params);
        console.log('[BACKTEST-PROXY] Transformed response data:', JSON.stringify(transformedData, null, 2));

        return NextResponse.json(transformedData);
      } else {
        const errorText = await response.text();
        console.error('[BACKTEST-PROXY] External API returned error:');
        console.error(`[BACKTEST-PROXY] - Status: ${response.status} ${response.statusText}`);
        console.error(`[BACKTEST-PROXY] - Response: ${errorText}`);
        console.warn('[BACKTEST-PROXY] External API not available for backtest, using fallback');
      }
    } catch (fetchError) {
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.error('[BACKTEST-PROXY] External API call was aborted due to timeout');
        } else {
          console.error('[BACKTEST-PROXY] External API fetch failed:', fetchError.message);
          console.error('[BACKTEST-PROXY] Error details:', {
            name: fetchError.name,
            message: fetchError.message,
            stack: fetchError.stack
          });
        }
      } else {
        console.error('[BACKTEST-PROXY] External API fetch failed with unknown error:', fetchError);
      }
      console.warn('[BACKTEST-PROXY] Using fallback due to external API failure');
    }

    // Fallback: Return mock backtest results when external API is not available
    console.log('[BACKTEST-PROXY] Returning fallback mock results');

    const mockResult = {
      trades: [
        {
          symbol: 'BTC/USDT',
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
          symbol: 'ETH/USDT',
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
      ],
      initial_balance: 100000,
      final_balance: 102200,
      total_return: 2200,
      total_return_pct: 2.2,
      _fallback: true,
      _message: 'External API unavailable - showing sample results'
    };

    return NextResponse.json(mockResult);
    
  } catch (error) {
    console.error('Backtest proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
