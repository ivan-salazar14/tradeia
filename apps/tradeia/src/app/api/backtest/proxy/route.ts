import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('[BACKTEST-PROXY] ===== STARTING BACKTEST PROXY =====');

  try {
    const body = await request.json();
    const { token, ...params } = body;

    console.log('[BACKTEST-PROXY] Received token:', token ? 'Present' : 'NULL/MISSING');
    console.log('[BACKTEST-PROXY] Request params:', params);

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

    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:8000';
    const url = `${apiBase}/backtest/run`;

    console.log('[BACKTEST-PROXY] External API URL:', apiBase);
    console.log('[BACKTEST-PROXY] Full URL:', url);
    
    // Try to run backtest via external API with timeout and better error handling
    try {
      // Prepare request body for external API (JSON format as per curl example)
      const requestBody = {
        ...params,
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
      console.log('[BACKTEST-PROXY] - Sending JSON to external API (corrected)');

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
        console.log('[BACKTEST-PROXY] External API response has initial_balance:', data.hasOwnProperty('initial_balance'));
        console.log('[BACKTEST-PROXY] External API response has trades:', data.hasOwnProperty('trades'));
        return NextResponse.json(data);
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
