import React from "react";

export default function SignalsPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">En esta sección puede monitorear todas las señales de trading. Las "Señales Activas" son operaciones en curso, mientras que el "Historial" le permite auditar el rendimiento pasado. Puede filtrar y ordenar la tabla para un análisis detallado.</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-gray-300 active">Señales Activas</button>
            <button className="tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:border-gray-300">Historial de Señales</button>
          </nav>
        </div>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objetivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop-Loss</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="signal-row gain">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">BTC/USDT</td>
                  <td className="px-6 py-4 whitespace-nowrap">68,500.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">72,000.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">67,000.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">1.5%</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span></td>
                </tr>
                <tr className="signal-row loss">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">ETH/USDT</td>
                  <td className="px-6 py-4 whitespace-nowrap">3,800.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">3,650.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">3,850.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">1.0%</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Cierre</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">SOL/USDT</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ganancia</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">+$250.75</td>
                  <td className="px-6 py-4 whitespace-nowrap">2024-07-19</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">ADA/USDT</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Pérdida</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">-$80.20</td>
                  <td className="px-6 py-4 whitespace-nowrap">2024-07-18</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 