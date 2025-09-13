"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";

type Signal = {
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
  source: { provider: string };
  position_size?: number;
  risk_amount?: number;
  reward_to_risk?: number;
};

type PortfolioMetrics = {
  total_position_size: number;
  total_risk_amount: number;
  remaining_balance: number;
  avg_reward_to_risk: number;
};

type RiskParameters = {
  initial_balance: number;
  risk_per_trade_pct: number;
};

type SignalsResponse = {
  signals: Signal[];
  portfolio_metrics?: PortfolioMetrics;
  risk_parameters?: RiskParameters;
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [riskParameters, setRiskParameters] = useState<RiskParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('4h');
  const timeframeOptions = ['1m','5m','15m','1h','4h','1d','1w'];
  const [symbol, setSymbol] = useState<string>("");
  const [strategyOptions, setStrategyOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [strategiesLoading, setStrategiesLoading] = useState(true);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [includeLiveSignals, setIncludeLiveSignals] = useState(false);

  // Risk analysis parameters
  const [initialBalance, setInitialBalance] = useState<string>('10000');
  const [riskPerTrade, setRiskPerTrade] = useState<string>('1.0');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [signalsPerPage, setSignalsPerPage] = useState(25);
  const signalsPerPageOptions = [10, 25, 50, 100];

  const fetchSignals = useMemo(() => async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock strategies - no need for Supabase client
      const activeStrategies: string[] = selectedStrategies.length > 0 ? selectedStrategies : ['moderate'];

      const params = new URLSearchParams({
        timeframe,
        start_date: `${dateRange.start}T00:00:00`,
        end_date: `${dateRange.end}T23:59:59`,
        initial_balance: initialBalance,
        risk_per_trade: riskPerTrade
      });
      if (symbol.trim()) params.set('symbol', symbol.trim().toUpperCase());
      if (includeLiveSignals) params.set('include_live_signals', 'true');
      // If exactly one strategy is active, pass as strategy_id param
      if (Array.isArray(activeStrategies) && activeStrategies.length === 1) {
        params.set('strategy_id', activeStrategies[0]);
      }
      const headers: Record<string, string> = {};
      // For multi-select, send header to let backend filter locally by all
      if (Array.isArray(activeStrategies) && activeStrategies.length > 1) {
        headers["X-Active-Strategies"] = activeStrategies.join(",");
      }

      // Use GET request to retrieve stored signals as per API documentation
      const res = await fetch(`/api/signals?${params.toString()}`, {
        method: 'GET',
        headers
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json: SignalsResponse = await res.json();
      setSignals(json.signals || []);
      setPortfolioMetrics(json.portfolio_metrics || null);
      setRiskParameters(json.risk_parameters || null);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar señales");
    } finally {
      setLoading(false);
    }
  }, [timeframe, symbol, selectedStrategies, dateRange, includeLiveSignals]);

  const generateNewSignals = useMemo(() => async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock strategies - no need for Supabase client
      const activeStrategies: string[] = selectedStrategies.length > 0 ? selectedStrategies : ['moderate'];

      const requestBody = {
        timeframe,
        start_date: `${dateRange.start}T00:00:00`,
        end_date: `${dateRange.end}T23:59:59`,
        initial_balance: parseFloat(initialBalance),
        risk_per_trade: parseFloat(riskPerTrade),
        symbol: symbol.trim() || undefined
      };

      // Use POST request to generate new signals as per API documentation
      const res = await fetch(`/api/signals/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json: SignalsResponse = await res.json();
      setSignals(json.signals || []);
      setPortfolioMetrics(json.portfolio_metrics || null);
      setRiskParameters(json.risk_parameters || null);
    } catch (e: any) {
      setError(e?.message ?? "Error al generar señales");
    } finally {
      setLoading(false);
    }
  }, [timeframe, symbol, selectedStrategies, dateRange, initialBalance, riskPerTrade]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Use static mock strategies instead of API call
  useEffect(() => {
    console.log('[SIGNALS-PAGE] ===== USING MOCK STRATEGIES =====');
    setStrategiesLoading(true);

    const mockStrategies = [
      {
        id: 'conservative',
        name: 'Conservative Strategy',
        description: 'Low-risk strategy with basic technical indicators'
      },
      {
        id: 'moderate',
        name: 'Moderate Strategy',
        description: 'Balanced risk strategy with multiple indicators'
      },
      {
        id: 'sqzmom_adx',
        name: 'ADX Squeeze Momentum',
        description: 'Strategy using ADX and Squeeze Momentum indicators for trend confirmation'
      },
      {
        id: 'aggressive',
        name: 'Aggressive Strategy',
        description: 'High-risk strategy for experienced traders'
      },
      {
        id: 'scalping',
        name: 'Scalping Strategy',
        description: 'Fast-paced strategy for quick profits'
      },
      {
        id: 'swing',
        name: 'Swing Trading',
        description: 'Medium-term strategy for trend following'
      }
    ];

    console.log('[SIGNALS-PAGE] Setting mock strategies:', mockStrategies.length);
    console.log('[SIGNALS-PAGE] Mock strategies data:', mockStrategies);
    setStrategyOptions(mockStrategies);
    setStrategiesLoading(false);

    // Log when strategies are set
    setTimeout(() => {
      console.log('[SIGNALS-PAGE] Strategy options after set:', strategyOptions.length);
    }, 100);
  }, []);

  // Create a map of strategy IDs to names for quick lookup
  const strategyMap = useMemo(() => {
    return new Map(strategyOptions.map(s => [s.id, s.name]));
  }, [strategyOptions]);

  // Debug logging for strategy options
  useEffect(() => {
    console.log('[SIGNALS-PAGE] Strategy options updated:', strategyOptions.length, 'strategies');
    console.log('[SIGNALS-PAGE] Strategies loading:', strategiesLoading);
    if (strategyOptions.length > 0) {
      console.log('[SIGNALS-PAGE] Available strategies:', strategyOptions.map(s => `${s.id}: ${s.name}`));
    }
  }, [strategyOptions, strategiesLoading]);

  // Pagination calculations
  const totalPages = Math.ceil(signals.length / signalsPerPage);
  const startIndex = (currentPage - 1) * signalsPerPage;
  const endIndex = startIndex + signalsPerPage;
  const currentSignals = signals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [timeframe, symbol, selectedStrategies, dateRange, initialBalance, riskPerTrade, includeLiveSignals]);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSignalsPerPageChange = (newPerPage: number) => {
    setSignalsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          En esta sección puede monitorear todas las señales de trading. Se muestran señales normalizadas desde proveedores externos.
        </p>
        {strategyOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Mock Mode
            </span>
            <span className="text-sm text-gray-500">
              {strategyOptions.length} strategies loaded
            </span>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Señales</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchSignals}
                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Get Stored Signals
              </button>
              <button
                onClick={generateNewSignals}
                className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700"
              >
                Generate New Signals
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Rango de Fechas</label>
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <span className="flex items-center md:flex-shrink-0">a</span>
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Símbolo</label>
              <input
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="Ej: BTC/USDT"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Timeframe</label>
              <select
                className="border rounded px-2 py-1 text-sm w-full"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                {timeframeOptions.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Balance Inicial</label>
              <input
                type="number"
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="10000"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Riesgo por Trade (%)</label>
              <input
                type="number"
                className="border rounded px-2 py-1 text-sm w-full"
                placeholder="1.0"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(e.target.value)}
                min="0.01"
                max="100"
                step="0.01"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Estrategias
                {strategyOptions.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Mock ({strategyOptions.length})
                  </span>
                )}
              </label>
              <select
                multiple
                className="border rounded px-2 py-1 text-sm w-full h-24"
                value={selectedStrategies}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                  setSelectedStrategies(opts);
                }}
                disabled={strategiesLoading}
              >
                {strategiesLoading ? (
                  <option disabled>Loading strategies...</option>
                ) : strategyOptions.length === 0 ? (
                  <option disabled>No strategies available</option>
                ) : (
                  strategyOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))
                )}
              </select>
              {strategyOptions.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Using mock strategies for demonstration
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Incluir Señales Live</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeLiveSignals"
                  checked={includeLiveSignals}
                  onChange={(e) => setIncludeLiveSignals(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includeLiveSignals" className="text-sm">Sí</label>
              </div>
            </div>
          </div>
        </div>

        {loading && <div className="text-gray-500">Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {/* Portfolio Metrics */}
            {portfolioMetrics && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Análisis de Riesgo del Portafolio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Posición Total</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      ${portfolioMetrics.total_position_size.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Riesgo Total</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      ${portfolioMetrics.total_risk_amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Balance Restante</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${portfolioMetrics.remaining_balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Ratio Promedio R/R</p>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {portfolioMetrics.avg_reward_to_risk.toFixed(2)}:1
                    </p>
                  </div>
                </div>
                {riskParameters && (
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Parámetros de Riesgo:</span> Balance inicial ${riskParameters.initial_balance.toLocaleString()}, Riesgo por trade {riskParameters.risk_per_trade_pct}%
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Mostrando {signals.length > 0 ? startIndex + 1 : 0} a {Math.min(endIndex, signals.length)} de {signals.length} señales
                </span>
                <select
                  value={signalsPerPage}
                  onChange={(e) => handleSignalsPerPageChange(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {signalsPerPageOptions.map(option => (
                    <option key={option} value={option}>{option} por página</option>
                  ))}
                </select>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border rounded text-sm ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>

            {/* Signals Table with Scrolling */}
            <div className="overflow-x-auto overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Detección</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ejecución</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad (hrs)</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuente</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estrategia</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TP1</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TP2</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R/R</th>
                    <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signals.length === 0 && (
                  <tr>
                    <td colSpan={17} className="px-6 py-4 text-center text-gray-500">
                      No hay señales disponibles. Seleccione una estrategia activa en &quot;Gestión de Bots&quot; o intente refrescar.
                    </td>
                  </tr>
                )}
                {currentSignals.map((s) => {
                  const strategyName = s.strategyId ? strategyMap.get(s.strategyId) || s.strategyId : '-';
                  return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          {s.timestamp ? new Date(s.timestamp).toLocaleString() : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          {s.execution_timestamp ? new Date(s.execution_timestamp).toLocaleString() : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          {s.signal_age_hours ? s.signal_age_hours.toFixed(1) : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">
                          {s.signal_source || '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-medium text-sm">{s.symbol}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">{s.timeframe}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500">
                          {strategyName}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <span
                            className={`px-1 md:px-2 py-0.5 rounded-full text-xs font-semibold ${
                              s.type?.toLowerCase() === 'buy'
                                ? 'bg-green-100 text-green-700'
                                : s.type?.toLowerCase() === 'sell'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {s.type ? s.type.toUpperCase() : '-'}
                          </span>
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm">{s.direction}</td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.entry ? s.entry.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.tp1 ? s.tp1.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.tp2 ? s.tp2.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.stopLoss ? s.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.position_size ? `$${s.position_size.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.risk_amount ? `$${s.risk_amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap font-mono text-sm">
                          {s.reward_to_risk ? `${s.reward_to_risk.toFixed(2)}:1` : '-'}
                        </td>
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500">
                          {s.source?.provider || '-'}
                        </td>
                      </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}