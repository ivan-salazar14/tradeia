"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { RangePoolCard } from "@/components/signals/range-pool-card";
import { MultiSelect } from "@/components/ui/multi-select";

type PoolSignal = {
  id: string;
  symbol: string;
  timeframe: string;
  timestamp: string;
  execution_timestamp?: string;
  signal_age_hours?: number;
  signal_source?: string;
  type: string;
  direction: string;
  strategyId?: string;
  entry?: number;
  tp1?: number;
  tp2?: number;
  stopLoss?: number;
  reason?: string;
  marketScenario?: string | null;
  source: { provider: string };
  // Range Detection specific fields (Pool Liquidity)
  range_min?: number;
  range_max?: number;
  confidence?: 'high' | 'medium' | 'low';
  hedge_short?: {
    entry_price: number;
    stop_price: number;
    target_price: number;
    size_suggestion: string;
    risk_pct: number;
    reward_pct: number;
    rationale: string;
  };
  // Protection field for partial close at range floor
  protection?: {
    trigger_price: number;
    close_pct: number;
    remaining_pct: number;
    rationale: string;
  };
};

type PoolMetrics = {
  total_pools: number;
  high_confidence: number;
  medium_confidence: number;
  low_confidence: number;
  avg_range_size: number;
  symbols_count: number;
};

type PoolsResponse = {
  signals: PoolSignal[];
  pool_metrics?: PoolMetrics;
  _fallback?: boolean;
  _message?: string;
};

export default function PoolsPage() {
  const { session } = useAuth();
  const [pools, setPools] = useState<PoolSignal[]>([]);
  const [poolMetrics, setPoolMetrics] = useState<PoolMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [timeframe, setTimeframe] = useState<string>('4h');
  const timeframeOptions = ['15m', '1h', '4h', '1d', '1w'];
  const [symbol, setSymbol] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [includeLiveSignals, setIncludeLiveSignals] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState<string>('');

  // Trading pairs options
  const tradingPairs = ["BTC/USDT", "ETH/USDT", "LINK/USDT", "XRP/USDT", "LTC/USDT", "XLM/USDT", "DOGE/USDT", "MATIC/USDT", "AVAX/USDT", "ATOM/USDT"];

  // Filter states for pools
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [rangeFilter, setRangeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  // Strategy parameter states for customization
  const [protectionClosePct, setProtectionClosePct] = useState<number>(0.75);
  const [hedgeCoveragePct, setHedgeCoveragePct] = useState<number>(0.75);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const poolsPerPage = 12;

  // Generate Range Detection Signals manually
  const generateRangeDetectionSignals = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestBody = {
        timeframe,
        start_date: `${dateRange.start}T00:00:00`,
        end_date: `${dateRange.end}T23:59:59`,
        initial_balance: 10000,
        risk_per_trade: 1.0,
        // Enviar múltiples símbolos - el endpoint acepta array o cadena separada por comas
        symbol: symbol.length > 0 ? symbol : tradingPairs.slice(0, 4),
        strategy_id: 'RangeDetection',
        // Strategy parameters for customization
        protection_close_pct: protectionClosePct,
        hedge_coverage_pct: hedgeCoveragePct
      };

      console.log('[POOLS] Making POST request to /api/signals/generate for RangeDetection');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      };

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      let res: Response;
      try {
        res = await fetch(`/api/signals/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          mode: 'cors',
          credentials: 'same-origin'
        });
      } catch (fetchError) {
        console.error('[POOLS] Fetch failed:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'}`);
      }

      if (!res.ok) {
        let errorText: string;
        try {
          errorText = await res.text();
        } catch (decodeError) {
          console.warn('[POOLS] Failed to decode error response:', decodeError);
          errorText = `HTTP ${res.status} - Content decoding failed`;
        }
        throw new Error(errorText || `HTTP ${res.status}`);
      }

      let json: PoolsResponse;
      try {
        json = await res.json();
        console.log('[POOLS] RangeDetection generation successful:', {
          signalsCount: json.signals?.length || 0
        });
      } catch (decodeError) {
        console.warn('[POOLS] Failed to decode JSON response:', decodeError);
        throw new Error('Failed to decode response JSON');
      }

      const signals = json.signals || [];
      console.log('[POOLS] Raw signals from API:', JSON.stringify(signals, null, 2));
      setPools(signals);
      
      // Calculate pool metrics
      if (signals.length > 0) {
        const highConf = signals.filter(p => p.confidence?.toLowerCase() === 'high').length;
        const mediumConf = signals.filter(p => p.confidence?.toLowerCase() === 'medium').length;
        const lowConf = signals.filter(p => p.confidence?.toLowerCase() === 'low').length;
        
        const rangesWithEntry = signals.filter(p => p.range_min && p.range_max && p.entry);
        const avgRange = rangesWithEntry.length > 0
          ? rangesWithEntry.reduce((acc, p) => {
              const rangeSize = ((p.range_max! - p.range_min!) / p.entry!) * 100;
              return acc + rangeSize;
            }, 0) / rangesWithEntry.length
          : 0;

        const uniqueSymbols = new Set(signals.map(p => p.symbol));

        setPoolMetrics({
          total_pools: signals.length,
          high_confidence: highConf,
          medium_confidence: mediumConf,
          low_confidence: lowConf,
          avg_range_size: Math.round(avgRange * 100) / 100,
          symbols_count: uniqueSymbols.size,
        });
      } else {
        setPoolMetrics(null);
      }
      
      setIsUsingFallback(json._fallback || false);
      setFallbackMessage(json._message || '');
      setHasGenerated(true);
    } catch (e: any) {
      console.error('[POOLS] Error in generateRangeDetectionSignals:', e);
      setError(`Error generando Range Detection: ${e?.message ?? "Error desconocido"}`);
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter pools based on confidence and range size
  const filteredPools = useMemo(() => {
    let filtered = pools;

    // Filter by confidence (case-insensitive comparison)
    if (confidenceFilter !== 'all') {
      filtered = filtered.filter(pool => 
        pool.confidence?.toLowerCase() === confidenceFilter.toLowerCase()
      );
    }

    // Filter by range size
    if (rangeFilter !== 'all') {
      filtered = filtered.filter(pool => {
        if (!pool.range_min || !pool.range_max || !pool.entry) return false;
        const rangeSize = ((pool.range_max - pool.range_min) / pool.entry) * 100;
        
        if (rangeFilter === 'small') return rangeSize < 3;
        if (rangeFilter === 'medium') return rangeSize >= 3 && rangeSize < 6;
        if (rangeFilter === 'large') return rangeSize >= 6;
        return true;
      });
    }

    return filtered;
  }, [pools, confidenceFilter, rangeFilter]);

  // Paginated pools
  const paginatedPools = useMemo(() => {
    const startIndex = (currentPage - 1) * poolsPerPage;
    return filteredPools.slice(startIndex, startIndex + poolsPerPage);
  }, [filteredPools, currentPage]);

  const totalPages = Math.ceil(filteredPools.length / poolsPerPage);

  // Fetch pools data
  // Note: Automatic fetching removed - only manual generation via button

  // Demo pools for fallback
  function getDemoPools(): PoolSignal[] {
    return [
      {
        id: 'demo-1',
        symbol: 'BTC/USDT',
        timeframe: '4h',
        timestamp: new Date().toISOString(),
        type: 'entry',
        direction: 'BUY',
        strategyId: 'RangeDetection',
        entry: 67500,
        tp1: 68500,
        stopLoss: 66500,
        reason: 'Pool: [66500 – 68500] (HIGH)',
        range_min: 66500,
        range_max: 68500,
        confidence: 'high',
        marketScenario: 'lateral',
        source: { provider: 'RangeDetection' },
        hedge_short: {
          entry_price: 68500,
          stop_price: 69500,
          target_price: 67000,
          size_suggestion: '50%',
          risk_pct: 2,
          reward_pct: 3,
          rationale: 'Protection against upward breakout'
        },
        protection: {
          trigger_price: 66500,
          close_pct: 0.75,
          remaining_pct: 0.25,
          rationale: 'Protección parcial: cerrar 75% al tocar 66500.00 (piso del rango). Mantener 25% abierto por rebote. Ancho del rango: 2.99%.'
        }
      },
      {
        id: 'demo-2',
        symbol: 'ETH/USDT',
        timeframe: '4h',
        timestamp: new Date().toISOString(),
        type: 'entry',
        direction: 'BUY',
        strategyId: 'RangeDetection',
        entry: 3450,
        tp1: 3520,
        stopLoss: 3380,
        reason: 'Pool: [3380 – 3520] (MEDIUM)',
        range_min: 3380,
        range_max: 3520,
        confidence: 'medium',
        marketScenario: 'lateral',
        source: { provider: 'RangeDetection' },
        hedge_short: {
          entry_price: 3520,
          stop_price: 3600,
          target_price: 3420,
          size_suggestion: '50%',
          risk_pct: 2.5,
          reward_pct: 2.5,
          rationale: 'Hedge short at range ceiling'
        },
        protection: {
          trigger_price: 3380,
          close_pct: 0.75,
          remaining_pct: 0.25,
          rationale: 'Protección parcial: cerrar 75% al tocar 3380.00 (piso del rango). Mantener 25% abierto por rebote.'
        }
      },
      {
        id: 'demo-3',
        symbol: 'LINK/USDT',
        timeframe: '4h',
        timestamp: new Date().toISOString(),
        type: 'entry',
        direction: 'BUY',
        strategyId: 'RangeDetection',
        entry: 14.5,
        tp1: 15.2,
        stopLoss: 13.8,
        reason: 'Pool: [13.8 – 15.2] (LOW)',
        range_min: 13.8,
        range_max: 15.2,
        confidence: 'low',
        marketScenario: 'lateral',
        source: { provider: 'RangeDetection' },
        hedge_short: {
          entry_price: 15.2,
          stop_price: 15.8,
          target_price: 13.5,
          size_suggestion: '50%',
          risk_pct: 3,
          reward_pct: 4,
          rationale: 'Hedge short at range ceiling'
        },
        protection: {
          trigger_price: 13.8,
          close_pct: 0.50,
          remaining_pct: 0.50,
          rationale: 'Protección parcial: cerrar 50% al tocar 13.80 (piso del rango). Mantener 50% abierto por rebote.'
        }
      }
    ];
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [confidenceFilter, rangeFilter, timeframe, symbol]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Por favor, inicia sesión para ver los pools de liquidez</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Pools de Liquidez
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Estrategia: Range Detection (Pool Liquidity)
              </p>
            </div>

            {/* Metrics Summary */}
            {poolMetrics && (
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-blue-600 font-medium">Total Pools</div>
                  <div className="text-lg font-bold text-blue-900">{poolMetrics.total_pools}</div>
                </div>
                <div className="bg-green-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-green-600 font-medium">Alta Confianza</div>
                  <div className="text-lg font-bold text-green-900">{poolMetrics.high_confidence}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-yellow-600 font-medium">Confianza Media</div>
                  <div className="text-lg font-bold text-yellow-900">{poolMetrics.medium_confidence}</div>
                </div>
                <div className="bg-red-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-red-600 font-medium">Baja Confianza</div>
                  <div className="text-lg font-bold text-red-900">{poolMetrics.low_confidence}</div>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-2">
                  <div className="text-xs text-gray-600 font-medium">Símbolos</div>
                  <div className="text-lg font-bold text-gray-900">{poolMetrics.symbols_count}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Strategy Info Button & Explanation */}
          <div className="mb-4">
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="group-open:hidden">ℹ️ Información sobre la Estrategia</span>
                <span className="hidden group-open:inline">ℹ️ Ocultar Información</span>
              </summary>
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Estrategia Range Detection */}
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">🎯 Estrategia Range Detection (Pool de Liquidez)</h4>
                    <p className="text-gray-700 mb-2">
                      Detecta <strong>pools de liquidez</strong> (zonas donde se concentra gran volumen de órdenes) en mercados laterales. 
                      Utiliza el indicador <strong>ADX</strong> para confirmar que el mercado está en rango (no en tendencia).
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>Rango:</strong> Zona entre soporte (piso) y resistencia (techo)</li>
                      <li><strong>Entry:</strong> Precio de entrada al pool</li>
                      <li><strong>TP (Techo):</strong> Objetivo = resistencia del rango</li>
                      <li><strong>Stop Loss:</strong> Precio de protección = soporte del rango</li>
                    </ul>
                  </div>

                  {/* Niveles de Confianza */}
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">📊 Niveles de Confianza</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-bold">ALTA</span>
                        <span className="text-gray-600">ADX &lt; 20 (rango confirmado), ancho &gt; 3%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">MEDIA</span>
                        <span className="text-gray-600">ADX 20-30 (rango posible), ancho 1-3%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-bold">BAJA</span>
                        <span className="text-gray-600">ADX &gt; 30 (tendencia), ancho &lt; 1%</span>
                      </div>
                    </div>
                  </div>

                  {/* Parámetros Configurables */}
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">⚙️ Parámetros Configurables</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li><strong>🛡️ Cierre (%):</strong> Porcentaje de la posición a cerrar cuando el precio toca el piso del rango (stop loss). Protege ganancias.</li>
                      <li><strong>📉 Cobertura (%):</strong> Porcentaje del valor/volatility del pool utilizado para el hedge short en caso de ruptura falsa.</li>
                    </ul>
                  </div>

                  {/* Hedge Short */}
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">🛡️ Hedge Short (Cobertura)</h4>
                    <p className="text-gray-700 mb-2">
                      Si el precio rompe el rango hacia arriba pero luego vuelve, el hedge short protege contra pérdidas. 
                      Es un <strong>short de protección</strong> que se activa al precio de entrada del pool.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                      <li><strong>Entry:</strong> Precio de entrada del short = precio actual</li>
                      <li><strong>Stop:</strong> Stop del short = techo del rango</li>
                      <li><strong>Target:</strong> Objetivo = piso del rango</li>
                    </ul>
                  </div>
                </div>

                {/* Gráfico ASCII de ejemplo */}
                <div className="mt-4 p-3 bg-white rounded border border-blue-100 font-mono text-xs">
                  <div className="text-gray-500 mb-1">Ejemplo de Pool:</div>
                  <div className="text-green-600">$61,500 ───────── TP (techo del pool)</div>
                  <div className="text-blue-600">$60,000 ───────── ENTRY (precio actual)</div>
                  <div className="text-orange-500">$58,500 ───────── 🛡️ PROTECTION TRIGGER</div>
                  <div className="text-red-600">$57,000 ───────── STOP LOSS (piso - margen)</div>
                  <div className="mt-1 text-gray-400">Ancho del rango: 5% | ADX: 18 (rango confirmado)</div>
                </div>
              </div>
            </details>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Timeframe */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Timeframe:</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeframeOptions.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>

            {/* Symbols - Multi-select */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Símbolos:</label>
              <MultiSelect
                options={tradingPairs.map(pair => ({ value: pair, label: pair }))}
                value={symbol}
                onChange={setSymbol}
                placeholder="Todos los símbolos"
                className="min-w-[200px]"
              />
            </div>

            {/* Confidence Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Confianza:</label>
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            {/* Range Size Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Tamaño Rango:</label>
              <select
                value={rangeFilter}
                onChange={(e) => setRangeFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos</option>
                <option value="small">&lt; 3%</option>
                <option value="medium">3% - 6%</option>
                <option value="large">&gt; 6%</option>
              </select>
            </div>

            {/* Live Signals Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLiveSignals}
                  onChange={(e) => setIncludeLiveSignals(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Señales en Vivo</span>
              </label>
            </div>

            {/* Strategy Parameters - Protection Close % */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap" title="Porcentaje de la posición a cerrar al tocar el piso del rango">
                🛡️ Cierre:
              </label>
              <select
                value={protectionClosePct}
                onChange={(e) => setProtectionClosePct(parseFloat(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20"
                title="Porcentaje de cierre parcial al tocar el piso del rango"
              >
                <option value={0.25}>25%</option>
                <option value={0.50}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1.00}>100%</option>
              </select>
            </div>

            {/* Strategy Parameters - Hedge Coverage % */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap" title="Porcentaje de cobertura del hedge short">
                📉 Cobertura:
              </label>
              <select
                value={hedgeCoveragePct}
                onChange={(e) => setHedgeCoveragePct(parseFloat(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20"
                title="Porcentaje de cobertura del hedge short"
              >
                <option value={0.25}>25%</option>
                <option value={0.50}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1.00}>100%</option>
              </select>
            </div>

            {/* Generate Range Button */}
            <button
              onClick={generateRangeDetectionSignals}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              title="Genera señales de Range Detection (Pool de Liquidez) manualmente"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Generar Rango
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fallback Warning */}
      {isUsingFallback && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{fallbackMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasGenerated ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium">Presiona &quot;Generar Rango&quot; para obtener señales</p>
              <p className="text-gray-400 text-sm mt-1">La generación es manual, no automática</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500">Cargando pools de liquidez...</p>
            </div>
          </div>
        ) : error && pools.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        ) : filteredPools.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-lg">No se encontraron pools de liquidez</p>
              <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pool Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPools.map((pool) => (
                <div key={pool.id} className="space-y-4">
                  {/* Pool Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{pool.symbol}</span>
                        <span className="text-xs text-gray-500">• {pool.timeframe}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        pool.confidence?.toLowerCase() === 'high' ? 'bg-green-100 text-green-800' :
                        pool.confidence?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        pool.confidence?.toLowerCase() === 'low' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pool.confidence?.toLowerCase() === 'high' ? 'ALTA' : 
                         pool.confidence?.toLowerCase() === 'medium' ? 'MEDIA' : 
                         pool.confidence?.toLowerCase() === 'low' ? 'BAJA' : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Pool Card Component */}
                    <RangePoolCard
                      range_min={pool.range_min}
                      range_max={pool.range_max}
                      confidence={pool.confidence}
                      entry={pool.entry}
                      tp1={pool.tp1}
                      stopLoss={pool.stopLoss}
                      // @ts-ignore
                      hedge_short={pool.hedge_short}
                      // @ts-ignore
                      protection={pool.protection}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Mostrando {paginatedPools.length} de {filteredPools.length} pools
            </div>
          </>
        )}
      </div>
    </div>
  );
}
