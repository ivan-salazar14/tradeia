import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const strategyId = params.id;

    // Mock strategies data (same as main strategies API)
    const mockStrategies = [
      {
        id: 'conservative',
        name: 'Conservative Strategy',
        description: 'Low-risk strategy with basic technical indicators',
        risk_level: 'Low',
        timeframe: '4h',
        indicators: ['SMA', 'RSI'],
        created_at: new Date().toISOString(),
        stop_loss: 2,
        take_profit: 4,
        max_positions: 3
      },
      {
        id: 'moderate',
        name: 'Moderate Strategy',
        description: 'Balanced risk strategy with multiple indicators',
        risk_level: 'Medium',
        timeframe: '1h',
        indicators: ['SMA', 'RSI', 'MACD'],
        created_at: new Date().toISOString(),
        stop_loss: 2.5,
        take_profit: 5,
        max_positions: 4
      },
      {
        id: 'sqzmom_adx',
        name: 'ADX Squeeze Momentum',
        description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation',
        risk_level: 'Medium',
        timeframe: '4h',
        indicators: ['ADX', 'Squeeze Momentum'],
        created_at: new Date().toISOString(),
        stop_loss: 3,
        take_profit: 6,
        max_positions: 3
      },
      {
        id: 'aggressive',
        name: 'Aggressive Strategy',
        description: 'High-risk strategy for experienced traders',
        risk_level: 'High',
        timeframe: '15m',
        indicators: ['RSI', 'MACD', 'Bollinger Bands'],
        created_at: new Date().toISOString(),
        stop_loss: 1.5,
        take_profit: 3,
        max_positions: 5
      }
    ];

    // Find the strategy by ID
    const strategy = mockStrategies.find(s => s.id === strategyId);

    if (!strategy) {
      return NextResponse.json({ error: 'Estrategia no encontrada' }, { status: 404 });
    }

    // Mock performance data
    const mockPerformance = {
      win_rate: strategy.id === 'sqzmom_adx' ? 68 : strategy.id === 'conservative' ? 65 : strategy.id === 'moderate' ? 62 : 58,
      total_trades: strategy.id === 'sqzmom_adx' ? 145 : strategy.id === 'conservative' ? 120 : strategy.id === 'moderate' ? 98 : 87,
      profit_loss: strategy.id === 'sqzmom_adx' ? 12.3 : strategy.id === 'conservative' ? 8.5 : strategy.id === 'moderate' ? 6.2 : 4.1,
      sharpe_ratio: strategy.id === 'sqzmom_adx' ? 1.4 : strategy.id === 'conservative' ? 1.2 : strategy.id === 'moderate' ? 1.1 : 0.9,
      max_drawdown: strategy.id === 'sqzmom_adx' ? -4.2 : strategy.id === 'conservative' ? -3.2 : strategy.id === 'moderate' ? -4.8 : -5.5,
      avg_trade_duration: strategy.id === 'sqzmom_adx' ? 22.5 : strategy.id === 'conservative' ? 18.5 : strategy.id === 'moderate' ? 14.2 : 12.8
    };

    // Mock recent signals
    const mockSignals = [
      {
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        signal_type: 'BUY',
        price: 45000 + Math.random() * 5000,
        confidence: 0.75 + Math.random() * 0.2,
        status: 'CLOSED',
        pnl: (Math.random() - 0.3) * 5
      },
      {
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        signal_type: 'SELL',
        price: 48000 + Math.random() * 5000,
        confidence: 0.7 + Math.random() * 0.25,
        status: 'CLOSED',
        pnl: (Math.random() - 0.4) * 4
      },
      {
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        signal_type: 'BUY',
        price: 46000 + Math.random() * 5000,
        confidence: 0.8 + Math.random() * 0.15,
        status: 'OPEN',
        pnl: null
      }
    ];

    return NextResponse.json({
      strategy: {
        ...strategy,
        is_active: strategy.id === 'conservative' // Make conservative active by default
      },
      recent_signals: mockSignals,
      performance: mockPerformance
    });

  } catch (error) {
    console.error('Error in strategy details API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const strategyId = params.id;

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Mock update - just return success
    const mockUpdatedStrategy = {
      id: strategyId,
      name: name || 'Updated Strategy',
      description: description || 'Updated description',
      risk_level: risk_level || 'Medium',
      timeframe: timeframe || '4h',
      indicators: indicators || ['SMA', 'RSI'],
      stop_loss: stop_loss || 2,
      take_profit: take_profit || 4,
      max_positions: max_positions || 3,
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Estrategia actualizada exitosamente',
      strategy: mockUpdatedStrategy
    });

  } catch (error) {
    console.error('Error in update strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const strategyId = params.id;

    // Mock delete - just return success
    return NextResponse.json({
      message: 'Estrategia eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error in delete strategy API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}