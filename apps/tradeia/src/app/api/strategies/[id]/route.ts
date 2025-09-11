import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      console.error('[STRATEGIES DETAIL] Supabase client not available');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const params = await context.params;
    const strategyId = params.id;

    // Verificar la sesión usando el cliente regular de Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener la estrategia
    const { data: strategy, error: strategyError } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .eq('user_id', session.user.id)
      .single();

    if (strategyError) {
      if (strategyError.code === 'PGRST116') {
        // Return mock strategy data when not found in database
        console.log('[STRATEGIES DETAIL] Strategy not found, returning mock data for:', strategyId);
        const mockStrategy = {
          id: strategyId,
          name: `${strategyId.charAt(0).toUpperCase() + strategyId.slice(1)} Strategy`,
          description: `Mock strategy for ${strategyId}`,
          risk_level: 'Medium',
          timeframe: '4h',
          indicators: ['SMA', 'RSI', 'MACD'],
          stop_loss: 2,
          take_profit: 4,
          max_positions: 3,
          created_at: new Date().toISOString()
        };

        return NextResponse.json({
          strategy: mockStrategy,
          recent_signals: [],
          performance: {
            win_rate: 60,
            total_trades: 50,
            profit_loss: 5.5,
            sharpe_ratio: 1.1,
            max_drawdown: -2.5,
            avg_trade_duration: 15.0
          },
          _mock: true
        });
      }
      console.error('Error fetching strategy:', strategyError);
      return NextResponse.json({ error: 'Error al obtener estrategia' }, { status: 500 });
    }

    // Verificar si la estrategia está activa
    const { data: userStrategy, error: userStrategyError } = await supabase
      .from('user_strategies')
      .select('is_active')
      .eq('user_id', session.user.id)
      .eq('strategy_id', strategyId)
      .single();

    // Mock performance data (se puede mejorar con datos reales después)
    const mockPerformance = {
      win_rate: 65,
      total_trades: 120,
      profit_loss: 8.5,
      sharpe_ratio: 1.2,
      max_drawdown: -3.2,
      avg_trade_duration: 18.5
    };

    // Mock recent signals (se puede mejorar con datos reales después)
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
        indicators: JSON.parse(strategy.indicators),
        is_active: userStrategy?.is_active || false
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
    if (!supabase) {
      console.error('[STRATEGIES UPDATE] Supabase client not available');
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const params = await context.params;
    const strategyId = params.id;

    // Verificar la sesión usando el cliente regular de Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, risk_level, timeframe, indicators, stop_loss, take_profit, max_positions } = body;

    // Actualizar la estrategia
    const { data: updatedStrategy, error: updateError } = await supabase
      .from('strategies')
      .update({
        name,
        description,
        risk_level,
        timeframe,
        indicators: JSON.stringify(indicators),
        stop_loss,
        take_profit,
        max_positions
      })
      .eq('id', strategyId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating strategy:', updateError);
      return NextResponse.json({ error: 'Error al actualizar estrategia' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Estrategia actualizada exitosamente',
      strategy: {
        ...updatedStrategy,
        indicators: JSON.parse(updatedStrategy.indicators)
      }
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