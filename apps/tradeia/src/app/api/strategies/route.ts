import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    // For development/testing, allow requests without authentication
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:3001';

    // Try to fetch strategies from external API (only if token exists)
    if (token) {
      try {
        const response = await fetch(`${apiBase}/strategies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            strategies: data.strategies || data || [],
            current_strategy: data.current_strategy || null
          });
        } else {
          console.warn('External API not available, using fallback strategies');
        }
      } catch (fetchError) {
        console.warn('External API fetch failed, using fallback strategies:', fetchError);
      }
    }

    // Fallback: Return mock strategies when external API is not available
    const mockStrategies = [
      {
        id: 'conservative',
        name: 'Conservative Strategy',
        description: 'Low-risk strategy with basic technical indicators',
        risk_level: 'Low',
        timeframe: '4h',
        indicators: ['SMA', 'RSI'],
        created_at: new Date().toISOString()
      },
      {
        id: 'moderate',
        name: 'Moderate Strategy',
        description: 'Balanced risk strategy with multiple indicators',
        risk_level: 'Medium',
        timeframe: '1h',
        indicators: ['SMA', 'RSI', 'MACD'],
        created_at: new Date().toISOString()
      },
      {
        id: 'sqzmom_adx',
        name: 'ADX Squeeze Momentum',
        description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation',
        risk_level: 'Medium',
        timeframe: '4h',
        indicators: ['ADX', 'Squeeze Momentum'],
        created_at: new Date().toISOString()
      },
      {
        id: 'aggressive',
        name: 'Aggressive Strategy',
        description: 'High-risk strategy for experienced traders',
        risk_level: 'High',
        timeframe: '15m',
        indicators: ['RSI', 'MACD', 'Bollinger Bands'],
        created_at: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      strategies: mockStrategies,
      current_strategy: null
    });

  } catch (error) {
    console.error('Error in strategies API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    // For development/testing, allow requests without authentication
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    const apiBase = process.env.SIGNALS_API_BASE || 'http://localhost:3001';

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Validar datos requeridos
    if (!name || !description || !risk_level || !timeframe || !indicators || !Array.isArray(indicators)) {
      return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
    }

    // Try to create strategy via external API (only if token exists)
    if (token) {
      try {
        const response = await fetch(`${apiBase}/strategies`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            risk_level,
            timeframe,
            indicators,
            stop_loss: stop_loss || 2,
            take_profit: take_profit || 4,
            max_positions: max_positions || 3
          })
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            message: 'Estrategia creada exitosamente',
            strategy: data.strategy || data
          }, { status: 201 });
        } else {
          console.warn('External API not available for creating strategies');
        }
      } catch (fetchError) {
        console.warn('External API fetch failed for creating strategies:', fetchError);
      }
    }

    // Fallback: Return success with mock strategy when external API is not available
    const mockStrategy = {
      id: `strategy_${Date.now()}`,
      name,
      description,
      risk_level,
      timeframe,
      indicators,
      stop_loss: stop_loss || 2,
      take_profit: take_profit || 4,
      max_positions: max_positions || 3,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Estrategia creada exitosamente (modo offline)',
      strategy: mockStrategy
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}