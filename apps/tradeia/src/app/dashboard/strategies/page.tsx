"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Strategy {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  timeframe: string;
  indicators: string[];
  is_active: boolean;
  created_at: string;
  performance: {
    win_rate: number;
    total_trades: number;
    profit_loss: number;
  };
}

export default function StrategiesPage() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/strategies/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok && response.status==200) {

      const data = await response.json();

      // Convert object format to array format for frontend compatibility
      const strategiesArray = Object.entries(data.strategies).map(([key, strategy]: [string, any]) => ({
        id: key,
        name: strategy.name,
        description: strategy.description,
        risk_level: strategy.risk_level,
        timeframe: '4h', // Default timeframe since not provided in new format
        indicators: ['SMA', 'RSI'], // Default indicators since not provided in new format
        is_active: data.current_strategy === key,
        created_at: new Date().toISOString(),
        performance: {
          win_rate: 0, // TODO: Obtener de strategy_performance
          total_trades: 0,
          profit_loss: 0
        }
      }));

      setStrategies(strategiesArray);
      
      setStrategies(strategiesArray);
    }} catch (error) {
      console.error("Error fetching strategies:", error);
      // Fallback a datos de ejemplo si hay error
      const mockStrategies: Strategy[] = [
        {
          id: "conservative",
          name: "Estrategia Conservadora",
          description: "Estrategia de bajo riesgo con indicadores técnicos básicos",
          risk_level: "Bajo",
          timeframe: "4h",
          indicators: ["SMA", "RSI"],
          is_active: true,
          created_at: "2024-01-15",
          performance: {
            win_rate: 65,
            total_trades: 120,
            profit_loss: 8.5
          }
        }
      ];
      setStrategies(mockStrategies);
    } finally {
      setLoading(false);
    }
  };

  const filteredStrategies = strategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "conservative": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "aggressive": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPerformanceColor = (profitLoss: number) => {
    return profitLoss >= 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Estrategias</h1>
        <Button 
          onClick={() => router.push('/dashboard/strategies/create')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Crear Nueva Estrategia
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar estrategias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="grid gap-6 pr-2 pb-4">
          {filteredStrategies.map((strategy) => (
          <div key={strategy.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {strategy.name}
                </h3>
                <p className="text-gray-600 mb-3">{strategy.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Timeframe: {strategy.timeframe}</span>
                  <span>•</span>
                  <span>Indicadores: {strategy.indicators.join(", ")}</span>
                  <span>•</span>
                  <span>Creada: {new Date(strategy.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(strategy.risk_level)}`}>
                  {strategy.risk_level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  strategy.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {strategy.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{strategy.performance.win_rate}%</div>
                <div className="text-sm text-gray-500">Tasa de Éxito</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{strategy.performance.total_trades}</div>
                <div className="text-sm text-gray-500">Total Trades</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(strategy.performance.profit_loss)}`}>
                  {strategy.performance.profit_loss > 0 ? "+" : ""}{strategy.performance.profit_loss}%
                </div>
                <div className="text-sm text-gray-500">P&L</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/strategies/${strategy.id}`)}
              >
                Ver Detalles
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/strategies/${strategy.id}/edit`)}
              >
                Editar
              </Button>
              <Button
                variant={strategy.is_active ? "destructive" : "default"}
                onClick={async () => {
                  try {
                    const response = await fetch('/api/strategies/set', {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        'Content-Type': 'application/json',
                         'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                      },
                      body: JSON.stringify({
                        strategy_name: strategy.id
                      })
                    });

                    if (response.ok) {
                      // Actualizar la lista de estrategias
                      fetchStrategies();
                    } else {
                      console.error('Error toggling strategy');
                    }
                  } catch (error) {
                    console.error('Error toggling strategy:', error);
                  }
                }}
              >
                {strategy.is_active ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
          ))}
        </div>
      </div>

      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? "No se encontraron estrategias que coincidan con tu búsqueda" : "No tienes estrategias creadas"}
          </div>
          {!searchTerm && (
            <Button 
              onClick={() => router.push('/dashboard/strategies/create')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Crear tu Primera Estrategia
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
