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

    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:3001';
    const url = new URL(`${apiBase}/backtest/run`);

    console.log('[BACKTEST-PROXY] External API URL:', apiBase);
    console.log('[BACKTEST-PROXY] Full URL:', url.toString());
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to run backtest';
      try {
        // Try to parse as JSON first
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        // If JSON parsing fails, try to get the response as text
        try {
          const text = await response.text();
          errorMessage = text || errorMessage;
        } catch (textError) {
          console.error('Failed to read error response:', textError);
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Backtest proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
