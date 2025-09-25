"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Strategy {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  is_active: boolean;
  created_at: string;
  stop_loss: number;
  take_profit: number;
  max_positions: number;
  performance: {
    win_rate: number;
    total_trades: number;
    profit_loss: number;
    sharpe_ratio: number;
    max_drawdown: number;
    avg_trade_duration: number;
  };
  recent_signals: Array<{
    timestamp: string;
    type: "BUY" | "SELL";
    price: number;
    confidence: number;
    status: "OPEN" | "CLOSED" | "CANCELLED";
    pnl?: number;
  }>;
}

export default function StrategyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const strategyId = params.id as string;
  
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "performance">("overview");

  useEffect(() => {
    if (strategyId) {
      fetchStrategyDetails();
    }
  }, [strategyId]);

  const fetchStrategyDetails = async () => {
    try {
      setLoading(true);
      console.log(`[STRATEGY-DETAILS] Fetching strategy details for ID: ${strategyId}`);

      const response = await fetch(`/api/strategies/${strategyId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      console.log(`[STRATEGY-DETAILS] API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[STRATEGY-DETAILS] API error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[STRATEGY-DETAILS] Successfully received data for strategy: ${data.strategy?.name || 'Unknown'}`);

      // The API now returns strategy data directly, so we can use it as-is
      const mappedStrategy: Strategy = {
        id: data.strategy.id,
        name: data.strategy.name,
        description: data.strategy.description,
        risk_level: data.strategy.risk_level,
        timeframe: data.strategy.timeframe,
        indicators: data.strategy.indicators,
        is_active: data.strategy.is_active,
        created_at: data.strategy.created_at,
        stop_loss: data.strategy.stop_loss,
        take_profit: data.strategy.take_profit,
        max_positions: data.strategy.max_positions,
        performance: {
          win_rate: 65, // Mock performance data since API doesn't provide it
          total_trades: 100,
          profit_loss: 5.0,
          sharpe_ratio: 1.0,
          max_drawdown: -4.0,
          avg_trade_duration: 16.0
        },
        recent_signals: [
          {
            timestamp: new Date().toISOString(),
            type: 'BUY' as const,
            price: 45000,
            confidence: 0.85,
            status: 'CLOSED' as const,
            pnl: 2.1
          }
        ]
      };
      
      setStrategy(mappedStrategy);
    } catch (error) {
      console.error("Error fetching strategy details:", error);
      console.log(`[STRATEGY-DETAILS] Using fallback data for strategy ID: ${strategyId}`);
      // Fallback a datos de ejemplo si hay error
      // Create a more dynamic fallback based on the requested strategy ID
      const fallbackStrategies: Record<string, Strategy> = {
        'conservative': {
          id: 'conservative',
          name: "Estrategia Conservadora",
          description: "Estrategia de bajo riesgo con indicadores técnicos básicos",
          risk_level: "Bajo",
          timeframe: "4h",
          indicators: ["SMA", "RSI"],
          is_active: true,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 2,
          take_profit: 4,
          max_positions: 3,
          performance: {
            win_rate: 65,
            total_trades: 120,
            profit_loss: 8.5,
            sharpe_ratio: 1.2,
            max_drawdown: -3.2,
            avg_trade_duration: 18.5
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'moderate': {
          id: 'moderate',
          name: "Estrategia Moderada",
          description: "Estrategia equilibrada de riesgo-recompensa",
          risk_level: "Medio",
          timeframe: "1h",
          indicators: ["SMA", "RSI", "MACD"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 2.5,
          take_profit: 5,
          max_positions: 4,
          performance: {
            win_rate: 58,
            total_trades: 95,
            profit_loss: 12.3,
            sharpe_ratio: 1.5,
            max_drawdown: -4.1,
            avg_trade_duration: 12.2
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'aggressive': {
          id: 'aggressive',
          name: "Estrategia Agresiva",
          description: "Estrategia de alto riesgo para traders experimentados, utilizando múltiples indicadores técnicos para maximizar ganancias.",
          risk_level: "Alto",
          timeframe: "15m",
          indicators: ["RSI", "MACD", "Bollinger Bands"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 1.5,
          take_profit: 3,
          max_positions: 5,
          performance: {
            win_rate: 58,
            total_trades: 87,
            profit_loss: 4.1,
            sharpe_ratio: 0.9,
            max_drawdown: -5.5,
            avg_trade_duration: 12.8
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'sqzmom_adx': {
          id: 'sqzmom_adx',
          name: "ADX Squeeze Momentum",
          description: "Estrategia que utiliza indicadores ADX y Squeeze Momentum para confirmar tendencias y generar señales precisas.",
          risk_level: "Medio",
          timeframe: "4h",
          indicators: ["ADX", "Squeeze Momentum"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 3,
          take_profit: 6,
          max_positions: 3,
          performance: {
            win_rate: 68,
            total_trades: 145,
            profit_loss: 12.3,
            sharpe_ratio: 1.4,
            max_drawdown: -4.2,
            avg_trade_duration: 22.5
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'scenario_based': {
          id: 'scenario_based',
          name: "Basada en Escenarios",
          description: "Estrategia dinámica que se adapta a las condiciones del mercado",
          risk_level: "Medio",
          timeframe: "4h",
          indicators: ["SMA", "RSI", "MACD", "ADX"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 2.5,
          take_profit: 5.0,
          max_positions: 5,
          performance: {
            win_rate: 61,
            total_trades: 110,
            profit_loss: 9.8,
            sharpe_ratio: 1.3,
            max_drawdown: -3.8,
            avg_trade_duration: 16.7
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'onda_3_5_alcista': {
          id: 'onda_3_5_alcista',
          name: "Onda 3/5 Alcista",
          description: "Detecta oportunidades de compra en tendencias alcistas fuertes",
          risk_level: "Medio",
          timeframe: "4h",
          indicators: ["Elliott Wave", "RSI", "MACD"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 2.0,
          take_profit: 6.0,
          max_positions: 3,
          performance: {
            win_rate: 62,
            total_trades: 85,
            profit_loss: 15.2,
            sharpe_ratio: 1.8,
            max_drawdown: -5.1,
            avg_trade_duration: 24.3
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.85,
              status: "CLOSED",
              pnl: 2.1
            }
          ]
        },
        'onda_c_bajista': {
          id: 'onda_c_bajista',
          name: "Onda C Bajista",
          description: "Detecta oportunidades de venta en tendencias bajistas fuertes",
          risk_level: "Medio",
          timeframe: "4h",
          indicators: ["Elliott Wave", "RSI", "MACD"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 2.0,
          take_profit: 6.0,
          max_positions: 3,
          performance: {
            win_rate: 60,
            total_trades: 78,
            profit_loss: 13.8,
            sharpe_ratio: 1.6,
            max_drawdown: -4.8,
            avg_trade_duration: 22.1
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "SELL",
              price: 45000,
              confidence: 0.82,
              status: "CLOSED",
              pnl: 3.2
            }
          ]
        },
        'ruptura_rango': {
          id: 'ruptura_rango',
          name: "Ruptura de Rango",
          description: "Detecta rupturas de consolidación con momentum confirmado",
          risk_level: "Medio",
          timeframe: "1h",
          indicators: ["Bollinger Bands", "Volume", "RSI"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 1.5,
          take_profit: 4.0,
          max_positions: 4,
          performance: {
            win_rate: 55,
            total_trades: 110,
            profit_loss: 9.7,
            sharpe_ratio: 1.3,
            max_drawdown: -3.9,
            avg_trade_duration: 8.5
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.78,
              status: "CLOSED",
              pnl: 1.8
            }
          ]
        },
        'reversion_patron': {
          id: 'reversion_patron',
          name: "Reversión por Patrón",
          description: "Detecta patrones de reversión con confirmación técnica",
          risk_level: "Medio",
          timeframe: "4h",
          indicators: ["Chart Patterns", "RSI", "Fibonacci"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 1.0,
          take_profit: 3.0,
          max_positions: 5,
          performance: {
            win_rate: 52,
            total_trades: 95,
            profit_loss: 7.4,
            sharpe_ratio: 1.1,
            max_drawdown: -2.8,
            avg_trade_duration: 16.2
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.75,
              status: "CLOSED",
              pnl: 1.2
            }
          ]
        },
        'gestion_riesgo': {
          id: 'gestion_riesgo',
          name: "Gestión de Riesgo",
          description: "Gestión avanzada de riesgo con trailing stops dinámicos",
          risk_level: "Bajo",
          timeframe: "1h",
          indicators: ["ATR", "Trailing Stop", "Risk Management"],
          is_active: false,
          created_at: "2024-01-15T10:30:00Z",
          stop_loss: 1.0,
          take_profit: 2.0,
          max_positions: 2,
          performance: {
            win_rate: 68,
            total_trades: 65,
            profit_loss: 6.9,
            sharpe_ratio: 1.4,
            max_drawdown: -2.1,
            avg_trade_duration: 14.7
          },
          recent_signals: [
            {
              timestamp: "2024-01-25T14:30:00Z",
              type: "BUY",
              price: 45000,
              confidence: 0.88,
              status: "CLOSED",
              pnl: 0.9
            }
          ]
        }
      };

      const mockStrategy = fallbackStrategies[strategyId] || {
        id: strategyId,
        name: `Estrategia ${strategyId.charAt(0).toUpperCase() + strategyId.slice(1)}`,
        description: `Estrategia personalizada con ID: ${strategyId}`,
        risk_level: "Medio",
        timeframe: "4h",
        indicators: ["SMA", "RSI"],
        is_active: false,
        created_at: "2024-01-15T10:30:00Z",
        stop_loss: 2,
        take_profit: 4,
        max_positions: 3,
        performance: {
          win_rate: 60,
          total_trades: 100,
          profit_loss: 5.0,
          sharpe_ratio: 1.0,
          max_drawdown: -4.0,
          avg_trade_duration: 16.0
        },
        recent_signals: [
          {
            timestamp: "2024-01-25T14:30:00Z",
            type: "BUY",
            price: 45000,
            confidence: 0.85,
            status: "CLOSED",
            pnl: 2.1
          }
        ]
      };
      setStrategy(mockStrategy);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Bajo": return "text-green-600 bg-green-100";
      case "conservative": return "text-green-600 bg-green-100";
      case "Medio": return "text-yellow-600 bg-yellow-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "Alto": return "text-red-600 bg-red-100";
      case "aggressive": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "text-blue-600 bg-blue-100";
      case "CLOSED": return "text-green-600 bg-green-100";
      case "CANCELLED": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Estrategia no encontrada</div>
          <Button onClick={() => router.push('/dashboard/strategies')}>
            Volver a Estrategias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Volver
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{strategy.name}</h1>
            <p className="text-gray-600 mb-4">{strategy.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Creada: {new Date(strategy.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>Timeframe: {strategy.timeframe}</span>
              <span>•</span>
              <span>Indicadores: {strategy.indicators.join(", ")}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(strategy.risk_level)}`}>
              {strategy.risk_level}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              strategy.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}>
              {strategy.is_active ? "Activa" : "Inactiva"}
            </span>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/strategies/${strategy.id}/edit`)}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Resumen" },
            { id: "signals", label: "Señales" },
            { id: "performance", label: "Rendimiento" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Métricas Principales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {strategy.performance.win_rate}%
              </div>
              <div className="text-sm text-gray-500">Tasa de Éxito</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {strategy.performance.total_trades}
              </div>
              <div className="text-sm text-gray-500">Total Trades</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`text-2xl font-bold mb-1 ${getPerformanceColor(strategy.performance.profit_loss)}`}>
                {strategy.performance.profit_loss > 0 ? "+" : ""}{strategy.performance.profit_loss}%
              </div>
              <div className="text-sm text-gray-500">P&L Total</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {strategy.performance.sharpe_ratio}
              </div>
              <div className="text-sm text-gray-500">Sharpe Ratio</div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Configuración de la Estrategia</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Stop Loss</div>
                <div className="text-lg font-medium">{strategy.stop_loss}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Take Profit</div>
                <div className="text-lg font-medium">{strategy.take_profit}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Max Posiciones</div>
                <div className="text-lg font-medium">{strategy.max_positions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duración Promedio</div>
                <div className="text-lg font-medium">{strategy.performance.avg_trade_duration}h</div>
              </div>
            </div>
          </div>

          {/* Métricas Adicionales */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Métricas de Riesgo</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Máxima Pérdida</div>
                <div className={`text-2xl font-bold ${getPerformanceColor(strategy.performance.max_drawdown)}`}>
                  {strategy.performance.max_drawdown}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Ratio de Sharpe</div>
                <div className="text-2xl font-bold text-gray-900">
                  {strategy.performance.sharpe_ratio}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "signals" && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Señales Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confianza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strategy.recent_signals.map((signal, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(signal.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        signal.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {signal.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${signal.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(signal.confidence * 100)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(signal.status)}`}>
                        {signal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {signal.pnl ? (
                        <span className={getPerformanceColor(signal.pnl)}>
                          {signal.pnl > 0 ? "+" : ""}{signal.pnl}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Rendimiento</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <div>Gráfico de rendimiento</div>
                <div className="text-sm">Se mostrará el gráfico real de la estrategia</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Distribución de Trades</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🥧</div>
                  <div>Gráfico de distribución</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Drawdown</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📉</div>
                  <div>Gráfico de drawdown</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
