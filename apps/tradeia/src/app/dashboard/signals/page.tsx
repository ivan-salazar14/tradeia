"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase-singleton";
import { format, subDays } from "date-fns";

type Signal = {
  id: string;
  symbol: string;
  timeframe: string;
  timestamp: string;
  type: string;
  direction: string;
  strategyId?: string;
  entry?: number;
  tp1?: number;
  tp2?: number;
  stopLoss?: number;
  source: { provider: string };
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>('4h');
  const timeframeOptions = ['1m','5m','15m','1h','4h','1d','1w'];
  const [symbol, setSymbol] = useState<string>("");
  const [strategyOptions, setStrategyOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchSignals = useMemo(() => async () => {
    try {
      setLoading(true);
      setError(null);

      const supabaseClient = getSupabaseClient();
      if (!supabaseClient) {
        setError("Error al inicializar cliente de Supabase.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabaseClient.auth.getSession();
      const token = sessionData.session?.access_token;
      const meta = sessionData.session?.user?.user_metadata as any;
      const userActive: string[] = meta?.active_strategies || [];
      // If user selected strategies locally, prefer those; otherwise, fallback to user's active strategies metadata
      const activeStrategies: string[] = selectedStrategies.length > 0 ? selectedStrategies : userActive;

      if (!token) {
        setError("Sesión no válida. Inicie sesión nuevamente.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ 
        timeframe,
        start_date: dateRange.start,
        end_date: dateRange.end
      });
      if (symbol.trim()) params.set('symbol', symbol.trim().toUpperCase());
      // If exactly one strategy is active, pass as strategy_id param
      if (Array.isArray(activeStrategies) && activeStrategies.length === 1) {
        params.set('strategy_id', activeStrategies[0]);
      }
      const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
      // For multi-select, send header to let backend filter locally by all
      if (Array.isArray(activeStrategies) && activeStrategies.length > 1) {
        headers["X-Active-Strategies"] = activeStrategies.join(",");
      }
      const res = await fetch(`/api/signals?${params.toString()}`, { headers });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setSignals(json.items || []);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar señales");
    } finally {
      setLoading(false);
    }
  }, [timeframe, symbol, selectedStrategies, dateRange]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Load available strategies for filter options
  useEffect(() => {
    (async () => {
      try {
        const supabaseClient = getSupabaseClient();
        if (!supabaseClient) return;

        const { data } = await supabaseClient.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;

        const res = await fetch('/api/strategies', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-id': data.session?.user?.id || ''
          },
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json = await res.json();
        const strategies = Array.isArray(json?.strategies) ? json.strategies : [];
        setStrategyOptions(strategies);
      } catch {}
    })();
  }, []);

  // Create a map of strategy IDs to names for quick lookup
  const strategyMap = useMemo(() => {
    return new Map(strategyOptions.map(s => [s.id, s.name]));
  }, [strategyOptions]);

  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">
        En esta sección puede monitorear todas las señales de trading. Se muestran señales normalizadas desde proveedores externos.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Señales</h2>
            <button
              onClick={fetchSignals}
              className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Refrescar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Rango de Fechas</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <span className="flex items-center">a</span>
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
              <label className="block text-sm font-medium text-gray-700">Estrategias</label>
              <select
                multiple
                className="border rounded px-2 py-1 text-sm w-full h-24"
                value={selectedStrategies}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                  setSelectedStrategies(opts);
                }}
              >
                {strategyOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <div className="text-gray-500">Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estrategia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TP1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TP2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signals.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                      No hay señales disponibles. Seleccione una estrategia activa en &quot;Gestión de Bots&quot; o intente refrescar.
                    </td>
                  </tr>
                )}
                {signals.map((s) => {
                  const strategyName = s.strategyId ? strategyMap.get(s.strategyId) || s.strategyId : '-';
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {s.timestamp ? new Date(s.timestamp).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{s.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{s.timeframe}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {strategyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
                    <td className="px-6 py-4 whitespace-nowrap">{s.direction}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {s.entry ? s.entry.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {s.tp1 ? s.tp1.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {s.tp2 ? s.tp2.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {s.stopLoss ? s.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.source?.provider || '-'}
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}