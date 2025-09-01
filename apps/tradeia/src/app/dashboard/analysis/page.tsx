import React from "react";

export default function AnalysisPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Profundice en su rendimiento de trading con estas herramientas de análisis. Compare ganancias y pérdidas a lo largo del tiempo y evalúe su tasa de acierto para identificar patrones y optimizar sus estrategias. Puede cambiar el período de análisis usando el selector.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <h3 className="font-semibold mb-4">Ganancias vs. Pérdidas Mensuales</h3>
          <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
            <span className="text-gray-400">[Gráfico de barras aquí]</span>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Tasa de Acierto (Win Rate)</h3>
          <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
            <span className="text-gray-400">[Gráfico de dona aquí]</span>
          </div>
        </div>
      </div>
    </div>
  );
} 