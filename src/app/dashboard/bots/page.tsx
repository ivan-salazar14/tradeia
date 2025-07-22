import React from "react";

export default function BotsPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Administre la configuración de sus bots de trading. Aquí puede activar o desactivar bots, ajustar su nivel de riesgo y personalizar las estrategias que utilizan para operar en el mercado.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Bot Scalper BTC</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nivel de Riesgo</label>
              <input type="range" min="1" max="10" defaultValue="4" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estrategia</label>
              <select className="w-full p-2 border rounded-md bg-gray-50">
                <option>Momentum</option>
                <option selected>RSI Divergence</option>
              </select>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Bot Swing ETH</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nivel de Riesgo</label>
              <input type="range" min="1" max="10" defaultValue="7" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Estrategia</label>
              <select className="w-full p-2 border rounded-md bg-gray-50">
                <option>Trend Following</option>
                <option>Mean Reversion</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 