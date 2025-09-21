import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('[SIGNALS GENERATE] ===== STARTING GENERATE SIGNALS REQUEST =====');

  try {
    const body = await req.json();
    const {
      symbol,
      timeframe = '4h',
      start_date,
      end_date,
      initial_balance = 10000,
      risk_per_trade = 1.0,
      strategy_id
    } = body;

    console.log('[SIGNALS GENERATE] Request body:', { symbol, timeframe, start_date, end_date, initial_balance, risk_per_trade, strategy_id });

    // Determine strategy to use
    const strategyToUse = strategy_id || 'moderate';
    console.log('[SIGNALS GENERATE] Using strategy:', strategyToUse);

    // Available strategies
    const availableStrategies = ['conservative', 'moderate', 'aggressive', 'sqzmom_adx'];

    if (!availableStrategies.includes(strategyToUse)) {
      return NextResponse.json({
        error: 'Strategy not found',
        details: `Strategy '${strategyToUse}' is not available. Available strategies: ${availableStrategies.join(', ')}`
      }, {
        status: 404,
        headers: {
          'Accept-Encoding': 'identity'
        }
      });
    }

    // Generate signals based on strategy
    const mockSignals = generateSignalsForStrategy(strategyToUse, symbol, timeframe, initial_balance, risk_per_trade);

    function generateSignalsForStrategy(strategy: string, symbol: string, timeframe: string, initialBalance: number, riskPerTrade: number) {
      const baseSymbol = symbol || 'BTC/USDT';
      const signals = [];

      switch (strategy) {
        case 'conservative':
          signals.push({
            id: `generated-${strategy}-1`,
            symbol: baseSymbol,
            timeframe: timeframe,
            timestamp: new Date().toISOString(),
            execution_timestamp: new Date().toISOString(),
            signal_age_hours: 0.1,
            signal_source: 'generated_conservative',
            type: 'entry',
            direction: 'BUY',
            strategyId: strategy,
            entry: 50000,
            tp1: 50250,
            tp2: 50500,
            stopLoss: 49750,
            source: { provider: 'conservative_provider' },
            position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49750) * 50000,
            risk_amount: initialBalance * riskPerTrade / 100,
            reward_to_risk: Math.abs(50250 - 50000) / Math.abs(50000 - 49750)
          });
          break;

        case 'moderate':
          signals.push(
            {
              id: `generated-${strategy}-1`,
              symbol: baseSymbol,
              timeframe: timeframe,
              timestamp: new Date().toISOString(),
              execution_timestamp: new Date().toISOString(),
              signal_age_hours: 0.1,
              signal_source: 'generated_moderate',
              type: 'entry',
              direction: 'BUY',
              strategyId: strategy,
              entry: 50000,
              tp1: 51000,
              tp2: 52000,
              stopLoss: 49000,
              source: { provider: 'moderate_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49000) * 50000,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(51000 - 50000) / Math.abs(50000 - 49000)
            },
            {
              id: `generated-${strategy}-2`,
              symbol: baseSymbol === 'BTC/USDT' ? 'ETH/USDT' : baseSymbol,
              timeframe: timeframe,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
              signal_age_hours: 1,
              signal_source: 'generated_moderate',
              type: 'entry',
              direction: 'SELL',
              strategyId: strategy,
              entry: 3000,
              tp1: 2900,
              tp2: 2800,
              stopLoss: 3100,
              source: { provider: 'moderate_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(3000 - 3100) * 3000,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(2900 - 3000) / Math.abs(3000 - 3100)
            }
          );
          break;

        case 'aggressive':
          signals.push(
            {
              id: `generated-${strategy}-1`,
              symbol: baseSymbol,
              timeframe: timeframe,
              timestamp: new Date().toISOString(),
              execution_timestamp: new Date().toISOString(),
              signal_age_hours: 0.1,
              signal_source: 'generated_aggressive',
              type: 'entry',
              direction: 'BUY',
              strategyId: strategy,
              entry: 50000,
              tp1: 53000,
              tp2: 55000,
              stopLoss: 48500,
              source: { provider: 'aggressive_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 48500) * 50000,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(53000 - 50000) / Math.abs(50000 - 48500)
            },
            {
              id: `generated-${strategy}-2`,
              symbol: baseSymbol === 'BTC/USDT' ? 'SOL/USDT' : baseSymbol,
              timeframe: timeframe,
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              execution_timestamp: new Date(Date.now() - 1800000).toISOString(),
              signal_age_hours: 0.5,
              signal_source: 'generated_aggressive',
              type: 'entry',
              direction: 'SELL',
              strategyId: strategy,
              entry: 150,
              tp1: 135,
              tp2: 125,
              stopLoss: 158,
              source: { provider: 'aggressive_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(150 - 158) * 150,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(135 - 150) / Math.abs(150 - 158)
            }
          );
          break;

        case 'sqzmom_adx':
          signals.push(
            {
              id: `generated-${strategy}-1`,
              symbol: baseSymbol,
              timeframe: timeframe,
              timestamp: new Date().toISOString(),
              execution_timestamp: new Date().toISOString(),
              signal_age_hours: 0.1,
              signal_source: 'generated_sqzmom_adx',
              type: 'entry',
              direction: 'BUY',
              strategyId: strategy,
              entry: 50000,
              tp1: 51500,
              tp2: 52500,
              stopLoss: 48800,
              source: { provider: 'sqzmom_adx_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 48800) * 50000,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(51500 - 50000) / Math.abs(50000 - 48800)
            },
            {
              id: `generated-${strategy}-2`,
              symbol: baseSymbol === 'BTC/USDT' ? 'ADA/USDT' : baseSymbol,
              timeframe: timeframe,
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              execution_timestamp: new Date(Date.now() - 7200000).toISOString(),
              signal_age_hours: 2,
              signal_source: 'generated_sqzmom_adx',
              type: 'entry',
              direction: 'SELL',
              strategyId: strategy,
              entry: 0.5,
              tp1: 0.475,
              tp2: 0.455,
              stopLoss: 0.515,
              source: { provider: 'sqzmom_adx_provider' },
              position_size: (initialBalance * riskPerTrade / 100) / Math.abs(0.5 - 0.515) * 0.5,
              risk_amount: initialBalance * riskPerTrade / 100,
              reward_to_risk: Math.abs(0.475 - 0.5) / Math.abs(0.5 - 0.515)
            }
          );
          break;

        default:
          // Fallback to moderate
          signals.push({
            id: `generated-fallback-1`,
            symbol: baseSymbol,
            timeframe: timeframe,
            timestamp: new Date().toISOString(),
            execution_timestamp: new Date().toISOString(),
            signal_age_hours: 0.1,
            signal_source: 'generated_fallback',
            type: 'entry',
            direction: 'BUY',
            strategyId: 'moderate',
            entry: 50000,
            tp1: 51000,
            tp2: 52000,
            stopLoss: 49000,
            source: { provider: 'fallback_provider' },
            position_size: (initialBalance * riskPerTrade / 100) / Math.abs(50000 - 49000) * 50000,
            risk_amount: initialBalance * riskPerTrade / 100,
            reward_to_risk: Math.abs(51000 - 50000) / Math.abs(50000 - 49000)
          });
      }

      return signals;
    }

    const portfolioMetrics = {
      total_position_size: mockSignals.reduce((sum, s) => sum + (s.position_size || 0), 0),
      total_risk_amount: mockSignals.reduce((sum, s) => sum + (s.risk_amount || 0), 0),
      remaining_balance: initial_balance - mockSignals.reduce((sum, s) => sum + (s.risk_amount || 0), 0),
      avg_reward_to_risk: mockSignals.length > 0 ? mockSignals.reduce((sum, s) => sum + (s.reward_to_risk || 0), 0) / mockSignals.length : 0
    };

    const riskParameters = {
      initial_balance: initial_balance,
      risk_per_trade_pct: risk_per_trade
    };

    // Return strategy-specific mock strategies list
    const getStrategyInfo = (strategyId: string) => {
      const strategies = {
        conservative: {
          id: 'conservative',
          name: 'Conservative Strategy',
          description: 'Low-risk strategy with basic technical indicators'
        },
        moderate: {
          id: 'moderate',
          name: 'Moderate Strategy',
          description: 'Balanced risk strategy with multiple indicators'
        },
        aggressive: {
          id: 'aggressive',
          name: 'Aggressive Strategy',
          description: 'High-risk strategy for experienced traders'
        },
        sqzmom_adx: {
          id: 'sqzmom_adx',
          name: 'ADX Squeeze Momentum',
          description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation'
        }
      };
      return strategies[strategyId as keyof typeof strategies] || strategies.moderate;
    };

    const mockStrategies = [getStrategyInfo(strategyToUse)];

    console.log('[SIGNALS GENERATE] ===== SENDING SUCCESS RESPONSE =====');
    console.log('[SIGNALS GENERATE] Response signals count:', mockSignals.length);

    return NextResponse.json({
      signals: mockSignals,
      strategies: mockStrategies,
      portfolio_metrics: portfolioMetrics,
      risk_parameters: riskParameters,
      _fallback: true,
      _message: `Signals generated successfully for ${strategyToUse} strategy (mock data)`
    }, {
      headers: {
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  } catch (err: any) {
    console.warn('[SIGNALS GENERATE] Request failed with exception:', err?.message);

    return NextResponse.json({
      error: 'Signals generation request failed',
      details: err?.message ?? 'Unknown error occurred while generating signals'
    }, {
      status: 500,
      headers: {
        'Accept-Encoding': 'identity'
      }
    });
  }
}