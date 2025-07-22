import React from "react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Bienvenido a su panel de control. Aquí encontrará un resumen del rendimiento de sus bots, las señales activas y el estado general de su cuenta. Use esta vista para obtener una instantánea rápida de su actividad de trading.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <h3 className="text-gray-500 text-sm font-medium">Rendimiento (30d)</h3>
          <p className="text-3xl font-semibold text-green-600">+12.5%</p>
        </div>
        <div className="stat-card">
          <h3 className="text-gray-500 text-sm font-medium">Saldo de Cuenta</h3>
          <p className="text-3xl font-semibold">$15,780.50</p>
        </div>
        <div className="stat-card">
          <h3 className="text-gray-500 text-sm font-medium">P/L Abierto</h3>
          <p className="text-3xl font-semibold text-red-500">-$210.15</p>
        </div>
        <div className="stat-card">
          <h3 className="text-gray-500 text-sm font-medium">Señales Activas</h3>
          <p className="text-3xl font-semibold">4</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <h3 className="font-semibold mb-4">Rendimiento de la Cartera</h3>
          <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
            <span className="text-gray-400">[Gráfico de líneas aquí]</span>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Distribución de Activos</h3>
          <div className="chart-container bg-gray-50 flex items-center justify-center" style={{height: 300}}>
            <span className="text-gray-400">[Gráfico de dona aquí]</span>
          </div>
        </div>
      </div>
    </div>
  );
} 