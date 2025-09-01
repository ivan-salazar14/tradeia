import React from "react";

export default function PortfolioPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Revise la composición detallada de su cartera. Esta tabla muestra todos sus activos, la cantidad que posee y su valor actual de mercado, dándole una visión clara de sus inversiones.</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Actual (USD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% de Cartera</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">Bitcoin (BTC)</td>
                <td className="px-6 py-4 whitespace-nowrap">0.105</td>
                <td className="px-6 py-4 whitespace-nowrap">$7,192.50</td>
                <td className="px-6 py-4 whitespace-nowrap">45.5%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">Ethereum (ETH)</td>
                <td className="px-6 py-4 whitespace-nowrap">1.25</td>
                <td className="px-6 py-4 whitespace-nowrap">$4,750.00</td>
                <td className="px-6 py-4 whitespace-nowrap">30.1%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap font-medium">USDT</td>
                <td className="px-6 py-4 whitespace-nowrap">3,838.00</td>
                <td className="px-6 py-4 whitespace-nowrap">$3,838.00</td>
                <td className="px-6 py-4 whitespace-nowrap">24.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 