"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StrategyForm {
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  stop_loss: number;
  take_profit: number;
  max_positions: number;
}

interface Indicator {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export default function CreateStrategyPage() {
  const router = useRouter();
  const [form, setForm] = useState<StrategyForm>({
    name: "",
    description: "",
    risk_level: "Medio",
    timeframe: "1h",
    indicators: [],
    stop_loss: 2,
    take_profit: 4,
    max_positions: 3
  });
  const [availableIndicators, setAvailableIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    fetchAvailableIndicators();
    generatePreview();
  }, [form]);

  const fetchAvailableIndicators = async () => {
    // TODO: Implementar llamada a la API para obtener indicadores disponibles
    const mockIndicators: Indicator[] = [
      { id: "sma", name: "SMA", description: "Simple Moving Average", parameters: { period: 20 } },
      { id: "ema", name: "EMA", description: "Exponential Moving Average", parameters: { period: 20 } },
      { id: "rsi", name: "RSI", description: "Relative Strength Index", parameters: { period: 14 } },
      { id: "macd", name: "MACD", description: "Moving Average Convergence Divergence", parameters: { fast: 12, slow: 26, signal: 9 } },
      { id: "bollinger", name: "Bollinger Bands", description: "Bollinger Bands", parameters: { period: 20, std: 2 } },
      { id: "stochastic", name: "Stochastic", description: "Stochastic Oscillator", parameters: { k: 14, d: 3 } },
      { id: "williams", name: "Williams %R", description: "Williams Percent Range", parameters: { period: 14 } },
      { id: "atr", name: "ATR", description: "Average True Range", parameters: { period: 14 } }
    ];
    setAvailableIndicators(mockIndicators);
  };

  const generatePreview = () => {
    // TODO: Implementar generación de preview con datos reales
    // Por ahora, generamos datos de ejemplo
    const mockPreview = {
      signals: [
        { timestamp: "2024-01-01T00:00:00Z", type: "BUY", price: 45000, confidence: 0.85 },
        { timestamp: "2024-01-01T04:00:00Z", type: "SELL", price: 46000, confidence: 0.78 },
        { timestamp: "2024-01-01T08:00:00Z", type: "BUY", price: 45500, confidence: 0.92 },
        { timestamp: "2024-01-01T12:00:00Z", type: "SELL", price: 47000, confidence: 0.88 }
      ],
      performance: {
        total_signals: 4,
        win_rate: 75,
        avg_profit: 2.5
      }
    };
    setPreviewData(mockPreview);
  };

  const handleInputChange = (field: keyof StrategyForm, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIndicatorToggle = (indicatorId: string) => {
    setForm(prev => ({
      ...prev,
      indicators: prev.indicators.includes(indicatorId)
        ? prev.indicators.filter(id => id !== indicatorId)
        : [...prev.indicators, indicatorId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/strategies/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Strategy created:", data);
        
        // Redirigir a la lista de estrategias
        router.push('/dashboard/strategies');
      } else {
        const errorData = await response.json();
        console.error("Error creating strategy:", errorData);
        alert(`Error al crear estrategia: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error creating strategy:", error);
      alert('Error al crear estrategia. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Estrategia</h1>
        <p className="text-gray-600 mt-2">
          Configura los parámetros de tu estrategia de trading y visualiza su comportamiento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Configuración de la Estrategia</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Estrategia
              </label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Mi Estrategia Conservadora"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe tu estrategia..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Riesgo
                </label>
                <select
                  value={form.risk_level}
                  onChange={(e) => handleInputChange("risk_level", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={form.timeframe}
                  onChange={(e) => handleInputChange("timeframe", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="15m">15 minutos</option>
                  <option value="1h">1 hora</option>
                  <option value="4h">4 horas</option>
                  <option value="1d">1 día</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indicadores Técnicos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableIndicators.map((indicator) => (
                  <label key={indicator.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.indicators.includes(indicator.id)}
                      onChange={() => handleIndicatorToggle(indicator.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">
                      {indicator.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop Loss (%)
                </label>
                <Input
                  type="number"
                  value={form.stop_loss}
                  onChange={(e) => handleInputChange("stop_loss", parseFloat(e.target.value))}
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Take Profit (%)
                </label>
                <Input
                  type="number"
                  value={form.take_profit}
                  onChange={(e) => handleInputChange("take_profit", parseFloat(e.target.value))}
                  min="0.1"
                  max="20"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Posiciones
                </label>
                <Input
                  type="number"
                  value={form.max_positions}
                  onChange={(e) => handleInputChange("max_positions", parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.name || !form.description || form.indicators.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? "Creando..." : "Crear Estrategia"}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Vista Previa</h2>
          
          {previewData && (
            <div className="space-y-6">
              {/* Métricas de Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {previewData.performance.total_signals}
                  </div>
                  <div className="text-sm text-gray-500">Señales</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {previewData.performance.win_rate}%
                  </div>
                  <div className="text-sm text-gray-500">Tasa de Éxito</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    +{previewData.performance.avg_profit}%
                  </div>
                  <div className="text-sm text-gray-500">Ganancia Promedio</div>
                </div>
              </div>

              {/* Señales Recientes */}
              <div>
                <h3 className="text-lg font-medium mb-3">Señales Recientes</h3>
                <div className="space-y-2">
                  {previewData.signals.map((signal: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          signal.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {signal.type}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${signal.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(signal.confidence * 100)}% confianza
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico Simulado */}
              <div>
                <h3 className="text-lg font-medium mb-3">Comportamiento de la Estrategia</h3>
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📈</div>
                    <div>Gráfico de ejemplo</div>
                    <div className="text-sm">Se mostrará el comportamiento real</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
