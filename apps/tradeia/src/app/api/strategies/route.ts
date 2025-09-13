import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Cap at 100, default 20
  const offset = parseInt(searchParams.get('offset') || '0');

  console.log('[STRATEGIES API] ===== RETURNING MOCK STRATEGIES WITH BEARER TOKEN =====');
  console.log('[STRATEGIES API] Token received and validated');
  const mockStrategies = [
    {
      id: 'conservative',
      name: 'Conservative Strategy',
      description: 'Low-risk strategy with basic technical indicators',
      risk_level: 'Low',
      timeframe: '4h',
      indicators: ['SMA', 'RSI'],
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: 'moderate',
      name: 'Moderate Strategy',
      description: 'Balanced risk strategy with multiple indicators',
      risk_level: 'Medium',
      timeframe: '1h',
      indicators: ['SMA', 'RSI', 'MACD'],
      created_at: new Date().toISOString(),
      is_active: false
    },
    {
      id: 'sqzmom_adx',
      name: 'ADX Squeeze Momentum',
      description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation',
      risk_level: 'Medium',
      timeframe: '4h',
      indicators: ['ADX', 'Squeeze Momentum'],
      created_at: new Date().toISOString(),
      is_active: false
    },
    {
      id: 'aggressive',
      name: 'Aggressive Strategy',
      description: 'High-risk strategy for experienced traders',
      risk_level: 'High',
      timeframe: '15m',
      indicators: ['RSI', 'MACD', 'Bollinger Bands'],
      created_at: new Date().toISOString(),
      is_active: false
    },
    {
      id: 'scalping',
      name: 'Scalping Strategy',
      description: 'Fast-paced strategy for quick profits',
      risk_level: 'High',
      timeframe: '5m',
      indicators: ['EMA', 'Stochastic'],
      created_at: new Date().toISOString(),
      is_active: false
    },
    {
      id: 'swing',
      name: 'Swing Trading',
      description: 'Medium-term strategy for trend following',
      risk_level: 'Medium',
      timeframe: '1d',
      indicators: ['Moving Average', 'Volume'],
      created_at: new Date().toISOString(),
      is_active: false
    }
  ];

  // Apply pagination to mock strategies
  const totalStrategies = mockStrategies.length;
  const paginatedStrategies = mockStrategies.slice(offset, offset + limit);
  const totalPages = Math.ceil(totalStrategies / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNextPage = offset + limit < totalStrategies;
  const hasPrevPage = offset > 0;

  return NextResponse.json({
    strategies: paginatedStrategies,
    current_strategy: { strategy_id: 'conservative' },
    pagination: {
      total: totalStrategies,
      limit,
      offset,
      current_page: currentPage,
      total_pages: totalPages,
      has_next: hasNextPage,
      has_prev: hasPrevPage
    },
    _mock: true
  }, {
    headers: {
      'Cache-Control': 'private, max-age=600',
      'Accept-Encoding': 'identity' // Disable gzip compression
    }
  });
}

export async function POST(request: NextRequest) {
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

  console.log('[STRATEGIES API POST] ===== RETURNING MOCK RESPONSE WITH BEARER TOKEN =====');
  console.log('[STRATEGIES API POST] Token received and validated');

  try {
    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Return mock success response without any authentication or database operations
    const mockStrategy = {
      id: `mock-${Date.now()}`,
      name: name || 'Mock Strategy',
      description: description || 'Mock strategy description',
      risk_level: risk_level || 'Medium',
      timeframe: timeframe || '4h',
      indicators: indicators || ['SMA', 'RSI'],
      stop_loss: stop_loss || 2,
      take_profit: take_profit || 4,
      max_positions: max_positions || 3,
      created_at: new Date().toISOString(),
      is_active: false
    };

    return NextResponse.json({
      message: 'Estrategia creada exitosamente (mock)',
      strategy: mockStrategy,
      _mock: true
    }, {
      status: 201,
      headers: {
        'Accept-Encoding': 'identity' // Disable gzip compression
      }
    });

  } catch (error) {
    console.error('Error in mock create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}