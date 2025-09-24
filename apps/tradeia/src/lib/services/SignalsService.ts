import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { normalizeExampleProvider } from '@/lib/signals/normalize';
import { UnifiedSignal } from '@/lib/signals/types';
import { ValidationSchemas, validateQueryParams } from '@/lib/utils/validation';
import { ErrorFactory, Logger, withErrorHandler } from '@/lib/utils/error-handler';
import { applySecurityMiddleware } from '@/lib/middleware/security';
import { CacheKeys, CacheUtils } from '@/lib/utils/cache';
import { signalsAPIClient } from '@/lib/utils/circuit-breaker';
import { formatVersionedResponse, detectAPIVersion, APIVersion } from '@/lib/utils/api-versioning';
import { signalProcessorPool } from '@/lib/workers/signal-processor';
import { dbConnectionPool, DatabaseHelpers } from '@/lib/database/connection-pool';
import { AsyncUtils, DataStreamProcessor } from '@/lib/utils/async-patterns';

interface PortfolioMetrics {
  total_position_size: number;
  total_risk_amount: number;
  remaining_balance: number;
  avg_reward_to_risk: number;
}

interface RiskParameters {
  initial_balance: number;
  risk_per_trade_pct: number;
}

interface MockStrategy {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  is_active: boolean;
}

export class SignalsService {
  private static readonly API_BASE = process.env.SIGNALS_API_BASE;

  private static readonly mockStrategies: MockStrategy[] = [
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

  // Calculate portfolio metrics
  private static calculatePortfolioMetrics(
    signals: UnifiedSignal[],
    initialBalance: number,
    riskPerTrade: number
  ): PortfolioMetrics {
    let totalPositionSize = 0;
    let totalRiskAmount = 0;
    let remainingBalance = initialBalance;
    let totalRewardToRisk = 0;
    let validSignalsCount = 0;

    for (const signal of signals) {
      if (!signal.entry || !signal.stopLoss) continue;

      const riskAmount = (remainingBalance * riskPerTrade) / 100;
      const riskPerUnit = Math.abs(signal.entry - signal.stopLoss);
      const positionSize = riskAmount / riskPerUnit;

      totalPositionSize += positionSize * signal.entry;
      totalRiskAmount += riskAmount;

      if (signal.tp1) {
        const reward = Math.abs(signal.tp1 - signal.entry);
        const rewardToRisk = reward / riskPerUnit;
        totalRewardToRisk += rewardToRisk;
        validSignalsCount++;
      }

      remainingBalance -= riskAmount;
    }

    const avgRewardToRisk = validSignalsCount > 0 ? totalRewardToRisk / validSignalsCount : 0;

    return {
      total_position_size: totalPositionSize,
      total_risk_amount: totalRiskAmount,
      remaining_balance: Math.max(0, remainingBalance),
      avg_reward_to_risk: avgRewardToRisk
    };
  }

  // Get user strategies from database with connection pooling and caching
  private static async getUserStrategies(session: any): Promise<string[]> {
    if (!session?.user) return [];

    const userId = session.user.id;

    // Use cached version first
    const cacheKey = CacheKeys.userStrategies(userId);
    const cached = CacheUtils.getUserDataCache().get(cacheKey);
    if (cached) {
      return cached;
    }

    // Use connection pooling for database access
    try {
      const strategyIds = await DatabaseHelpers.getUserStrategies(userId);
      CacheUtils.getUserDataCache().set(cacheKey, strategyIds, 10 * 60 * 1000); // 10 minutes
      return strategyIds;
    } catch (error) {
      Logger.warn('Failed to fetch user strategies:', error);
      return [];
    }
  }

  // Validate and parse query parameters
  private static validateSignalsParams(searchParams: URLSearchParams) {
    const validation = validateQueryParams(searchParams, ValidationSchemas.signalsQuery);
    if (!validation.success) {
      throw ErrorFactory.validation('Invalid query parameters: ' + validation.errors.join(', '));
    }
    return validation.data;
  }

  // Create Supabase client
  private static async createSupabaseClient() {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = supabaseUrl.split('https://')[1]?.split('.')[0] || 'ztlxyfrznqerebeysxbx';

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (name === `sb-${projectRef}-auth-token`) {
              return cookieStore.get(`sb-${projectRef}-auth-token`)?.value;
            }
            if (name === `sb-${projectRef}-refresh-token`) {
              return cookieStore.get(`sb-${projectRef}-refresh-token`)?.value;
            }
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Ignore in server context
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch {
              // Ignore in server context
            }
          },
        },
      }
    );
  }

  // Fetch signals from external API
  private static async fetchSignalsFromAPI(params: any): Promise<UnifiedSignal[]> {
    if (!this.API_BASE) {
      throw ErrorFactory.internal('SIGNALS_API_BASE environment variable is not configured');
    }

    const qs = new URLSearchParams();
    qs.set('symbol', params.symbol);
    qs.set('timeframe', params.timeframe);

    // Add date parameters if provided
    if (params.startDate) qs.set('start_date', params.startDate);
    if (params.endDate) qs.set('end_date', params.endDate);
    if (params.limit) qs.set('limit', params.limit.toString());
    if (params.offset) qs.set('offset', params.offset.toString());
    if (params.forceFresh) qs.set('force_fresh', 'true');

    // Add strategy filtering
    if (params.activeStrategyIds?.length > 0) {
      qs.set('strategy_ids', params.activeStrategyIds.join(','));
    }

    try {
      const response = await signalsAPIClient.get(`${this.API_BASE}/signals/generate?${qs.toString()}`);
      const data = await response.json();

      const pickArray = (d: any): any[] | null => {
        if (!d) return null;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d.signals)) return d.signals;
        if (Array.isArray(d.results)) return d.results;
        if (Array.isArray(d.items)) return d.items;
        if (d.data) return pickArray(d.data);
        return null;
      };

      const payloadArr = pickArray(data);
      const signals: UnifiedSignal[] = Array.isArray(payloadArr)
        ? payloadArr.map(p => {
            const signal = normalizeExampleProvider(p);
            if (p.strategy_id) signal.strategyId = p.strategy_id;
            return signal;
          })
        : [normalizeExampleProvider(data)];

      return this.filterAndValidateSignals(signals, params.activeStrategyIds);
    } catch (error) {
      Logger.warn('External API failed, using mock signals:', error);
      return this.generateMockSignals(params);
    }
  }

  // Filter and validate signals
  private static filterAndValidateSignals(signals: UnifiedSignal[], activeStrategyIds?: string[]): UnifiedSignal[] {
    const quality = signals.filter((s) => {
      if (!s.id || !s.symbol || !s.timeframe || !s.timestamp || !s.direction) return false;
      if (s.entry !== undefined && typeof s.entry !== 'number') return false;
      if (s.tp1 !== undefined && typeof s.tp1 !== 'number') return false;
      if (s.tp2 !== undefined && typeof s.tp2 !== 'number') return false;
      if (s.stopLoss !== undefined && typeof s.stopLoss !== 'number') return false;
      if (s.reason === 'No signal generated' || s.reason === 'no signal generated') return false;
      if (s.marketScenario === null && !s.entry) return false;
      return true;
    });

    if (!activeStrategyIds?.length) return quality;

    const activeSet = new Set(activeStrategyIds);
    return quality.filter((s) => !s.strategyId || activeSet.has(s.strategyId));
  }

  // Generate mock signals for fallback
  private static generateMockSignals(params: any): UnifiedSignal[] {
    const { symbol = 'BTC/USDT', timeframe, activeStrategyIds = ['moderate'] } = params;

    return [
      {
        id: 'mock-signal-1',
        symbol,
        timeframe,
        timestamp: new Date().toISOString(),
        execution_timestamp: new Date().toISOString(),
        signal_age_hours: 0,
        signal_source: 'mock',
        type: 'entry' as const,
        direction: 'BUY' as const,
        strategyId: activeStrategyIds[0],
        entry: 50000,
        tp1: 51000,
        tp2: 52000,
        stopLoss: 49000,
        source: { provider: 'mock_provider' }
      },
      {
        id: 'mock-signal-2',
        symbol: symbol.replace('BTC', 'ETH'),
        timeframe,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        execution_timestamp: new Date(Date.now() - 3600000).toISOString(),
        signal_age_hours: 1,
        signal_source: 'mock',
        type: 'entry' as const,
        direction: 'SELL' as const,
        strategyId: activeStrategyIds[0],
        entry: 3000,
        tp1: 2900,
        tp2: 2800,
        stopLoss: 3100,
        source: { provider: 'mock_provider' }
      }
    ];
  }

  // Transform signals for response
  private static transformSignals(signals: UnifiedSignal[], params: any, version: APIVersion) {
    const { initialBalance = 10000, riskPerTrade = 1.0, fields } = params;

    const transformedSignals = signals.map(signal => {
      const baseSignal = {
        id: signal.id,
        symbol: signal.symbol,
        timeframe: signal.timeframe,
        timestamp: signal.timestamp,
        execution_timestamp: signal.execution_timestamp,
        signal_age_hours: signal.signal_age_hours,
        signal_source: signal.signal_source,
        type: signal.type,
        direction: signal.direction,
        strategyId: signal.strategyId,
        entry: signal.entry,
        tp1: signal.tp1,
        tp2: signal.tp2,
        stopLoss: signal.stopLoss,
        source: signal.source,
        position_size: signal.entry ? (initialBalance * riskPerTrade / 100) / Math.abs(signal.entry - (signal.stopLoss || signal.entry)) * signal.entry : undefined,
        risk_amount: signal.entry ? (initialBalance * riskPerTrade / 100) : undefined,
        reward_to_risk: signal.entry && signal.tp1 && signal.stopLoss ? Math.abs(signal.tp1 - signal.entry) / Math.abs(signal.entry - signal.stopLoss) : undefined
      };

      // Apply field selection if specified
      if (fields && fields.length > 0) {
        const selectedSignal: any = {};
        fields.forEach((field: string) => {
          if (baseSignal.hasOwnProperty(field.trim())) {
            selectedSignal[field.trim()] = (baseSignal as any)[field.trim()];
          }
        });
        return selectedSignal;
      }

      return baseSignal;
    });

    return transformedSignals;
  }

  // Main handler for GET /api/signals
  static async getSignals(request: NextRequest) {
    return withErrorHandler(async () => {
      Logger.info('Processing signals request');

      // Apply security middleware
      const securedHandler = await applySecurityMiddleware(request, async () => {
        // Validate query parameters
        const searchParams = new URL(request.url).searchParams;
        const params = this.validateSignalsParams(searchParams);

        // Check cache first
        const cacheKey = CacheKeys.signals({
          symbol: params.symbol,
          timeframe: params.timeframe,
          strategyIds: params.strategyIds,
          startDate: params.startDate,
          endDate: params.endDate
        });

        const cachedResult = CacheUtils.getAPIResponseCache().get(cacheKey);
        if (cachedResult) {
          Logger.debug('Returning cached signals result');
          return formatVersionedResponse(cachedResult, detectAPIVersion(request), request);
        }

        // Create Supabase client and get user session
        const supabase = await this.createSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        // Get user strategies
        const userStrategyIds = await this.getUserStrategies(session);

        // Determine active strategies
        let activeStrategyIds: string[] = [];
        if (params.strategyIds?.length) {
          activeStrategyIds = params.strategyIds;
        } else if (userStrategyIds.length) {
          activeStrategyIds = userStrategyIds;
        } else {
          activeStrategyIds = ['moderate'];
        }

        // Fetch signals
        const signals = await this.fetchSignalsFromAPI({
          ...params,
          activeStrategyIds
        });

        // Calculate metrics using worker threads for CPU-intensive operations
        const portfolioMetrics = await signalProcessorPool.calculatePortfolioMetrics(
          signals,
          params.initialBalance,
          params.riskPerTrade
        );
        const riskParameters: RiskParameters = {
          initial_balance: params.initialBalance,
          risk_per_trade_pct: params.riskPerTrade
        };

        // Apply pagination
        const totalSignals = signals.length;
        const paginatedSignals = signals.slice(params.offset, params.offset + params.limit);

        // Transform signals
        const version = detectAPIVersion(request);
        const transformedSignals = this.transformSignals(paginatedSignals, params, version);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalSignals / params.limit);
        const currentPage = Math.floor(params.offset / params.limit) + 1;
        const hasNextPage = params.offset + params.limit < totalSignals;
        const hasPrevPage = params.offset > 0;

        const result = {
          signals: transformedSignals,
          strategies: this.mockStrategies,
          portfolio_metrics: portfolioMetrics,
          risk_parameters: riskParameters,
          pagination: {
            total: totalSignals,
            limit: params.limit,
            offset: params.offset,
            current_page: currentPage,
            total_pages: totalPages,
            has_next: hasNextPage,
            has_prev: hasPrevPage
          }
        };

        // Cache the result
        CacheUtils.getAPIResponseCache().set(cacheKey, result, 5 * 60 * 1000); // 5 minutes

        return formatVersionedResponse(result, version, request);
      });

      return securedHandler;
    }, 'getSignals')();
  }
}