import React from 'react';
import { TrendingUp, Shield, Zap, Target, BarChart3, Activity } from 'lucide-react';

const Strategies = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestras Estrategias de Trading
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estrategias cuantitativas avanzadas diseñadas para diferentes perfiles de riesgo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Conservative Strategy */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Estrategia Conservadora</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Bajo Riesgo
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">2-3%</div>
                <div className="text-sm text-gray-600">Rentabilidad Mensual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">5%</div>
                <div className="text-sm text-gray-600">Drawdown Máx.</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Shield className="w-5 h-5 text-green-500 mr-3" />
                Todas las condiciones deben cumplirse
              </li>
              <li className="flex items-center text-gray-700">
                <Target className="w-5 h-5 text-green-500 mr-3" />
                Señales de alta precisión
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-green-500 mr-3" />
                Baja frecuencia de operaciones
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                Ideal para cuentas grandes
              </li>
            </ul>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
              Ver Detalles
            </button>
          </div>

          {/* Moderate Strategy - Featured */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-teal-500 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Más Popular
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Estrategia Moderada</h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                Riesgo Moderado
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">5-8%</div>
                <div className="text-sm text-gray-600">Rentabilidad Mensual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">10%</div>
                <div className="text-sm text-gray-600">Drawdown Máx.</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Activity className="w-5 h-5 text-teal-500 mr-3" />
                3 de 5 condiciones requeridas
              </li>
              <li className="flex items-center text-gray-700">
                <Target className="w-5 h-5 text-teal-500 mr-3" />
                Equilibrio entre riesgo y recompensa
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-teal-500 mr-3" />
                Frecuencia moderada de operaciones
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-teal-500 mr-3" />
                Ideal para cuentas medianas
              </li>
            </ul>

            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Comenzar Ahora
            </button>
          </div>

          {/* Aggressive Strategy */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Estrategia Agresiva</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                Alto Riesgo
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">10-15%</div>
                <div className="text-sm text-gray-600">Rentabilidad Mensual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">15%</div>
                <div className="text-sm text-gray-600">Drawdown Máx.</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Zap className="w-5 h-5 text-orange-500 mr-3" />
                Mínimas confirmaciones requeridas
              </li>
              <li className="flex items-center text-gray-700">
                <Activity className="w-5 h-5 text-orange-500 mr-3" />
                Alta frecuencia de operaciones
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-orange-500 mr-3" />
                Mayor exposición al mercado
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
                Ideal para cuentas pequeñas
              </li>
            </ul>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Squeeze+ADX Strategy Highlight */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Estrategia Avanzada: Squeeze+ADX Pro</h3>
              <p className="text-xl mb-8 opacity-90">
                Nuestra estrategia insignia que combina el poder del indicador Squeeze Momentum con ADX 
                para identificar las mejores oportunidades de trading en mercados con tendencia.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-2">Identificación de Tendencias</h4>
                  <p className="text-sm opacity-80">ADX &gt; 30 para confirmar tendencias fuertes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📉</div>
                  <h4 className="font-semibold mb-2">Momento Óptimo</h4>
                  <p className="text-sm opacity-80">Detecta cambios en el momentum</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-semibold mb-2">Análisis de Divergencias</h4>
                  <p className="text-sm opacity-80">Identifica reversiones en 5 velas</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">65-70%</div>
                  <div className="text-sm opacity-80">Tasa de Aciertos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1:2</div>
                  <div className="text-sm opacity-80">Ratio Riesgo/Beneficio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4H-1D</div>
                  <div className="text-sm opacity-80">Timeframe Recomendado</div>
                </div>
              </div>

              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Aprender Más
              </button>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-xl font-semibold mb-2">Gráfico Squeeze+ADX</h4>
                <p className="opacity-80">Visualización en tiempo real de señales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Strategies;