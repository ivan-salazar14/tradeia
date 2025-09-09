import React from 'react';
import { TrendingUp, Shield, Zap, Target, BarChart3, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Strategies = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('strategies.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('strategies.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Conservative Strategy */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{t('strategies.conservative.title')}</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Low Risk
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                {t('strategies.conservative.description')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{t('strategies.conservative.winRate')}</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{t('strategies.conservative.riskReward')}</div>
                <div className="text-sm text-gray-600">Risk/Reward</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Shield className="w-5 h-5 text-green-500 mr-3" />
                All 5 conditions must be met
              </li>
              <li className="flex items-center text-gray-700">
                <Target className="w-5 h-5 text-green-500 mr-3" />
                High precision signals
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-green-500 mr-3" />
                Low frequency of operations
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                Best for large accounts
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
              <h3 className="text-2xl font-bold text-gray-900">Moderate (Default)</h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                Balanced Risk
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Criteria: 4/5 conditions (RSI {'<'}40/{'>'}60, ADX {'>'}15, SQZMOM ≠0, DMI diff {'>'}3, ATR {'>'}50).
                Frequency: Balanced. Best For: Everyday traders on mid-priority pairs like XRP/USDT.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">Good</div>
                <div className="text-sm text-gray-600">Risk/Reward</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">1:1 min</div>
                <div className="text-sm text-gray-600">Ratio</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Activity className="w-5 h-5 text-teal-500 mr-3" />
                4 of 5 conditions required
              </li>
              <li className="flex items-center text-gray-700">
                <Target className="w-5 h-5 text-teal-500 mr-3" />
                Balance between risk and reward
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-teal-500 mr-3" />
                Moderate frequency of operations
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-teal-500 mr-3" />
                Ideal for medium accounts
              </li>
            </ul>

            <button  onClick={() => window.location.href = '/login'} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors">
              Comenzar Ahora
            </button>
          </div>

          {/* Aggressive Strategy */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Aggressive</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                High Risk
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Criteria: Relaxed (ADX {'>'}10, minimal DMI/ATR filters). Frequency: High.
                Best For: High-volume traders on altcoins like SOL/USDT.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">More Trades</div>
                <div className="text-sm text-gray-600">Higher Frequency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">Higher Risk</div>
                <div className="text-sm text-gray-600">False Signals</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <Zap className="w-5 h-5 text-orange-500 mr-3" />
                Minimal confirmations required
              </li>
              <li className="flex items-center text-gray-700">
                <Activity className="w-5 h-5 text-orange-500 mr-3" />
                High frequency of operations
              </li>
              <li className="flex items-center text-gray-700">
                <BarChart3 className="w-5 h-5 text-orange-500 mr-3" />
                Greater market exposure
              </li>
              <li className="flex items-center text-gray-700">
                <TrendingUp className="w-5 h-5 text-orange-500 mr-3" />
                Best for small accounts
              </li>
            </ul>

            <button  onClick={() => window.location.href = '/login'} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
              Comenzar Ahora
            </button>
          </div>
        </div>

        {/* SQZMOM_ADX Specialized Strategy */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">SQZMOM_ADX Specialized</h3>
              <p className="text-xl mb-8 opacity-90">
                Criteria: Focus on squeeze momentum with ADX for breakout detection.
                Best For: Volatility plays in low-priority pairs like ADA/USDT.
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
                  <div className="text-2xl font-bold">Excellent</div>
                  <div className="text-sm opacity-80">For Trends</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3x ATR</div>
                  <div className="text-sm opacity-80">TP2 Target</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Breakouts</div>
                  <div className="text-sm opacity-80">Best For</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href = '/register'} className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {t('strategies.buttons.select')}
                </button>
                <button onClick={() => window.location.href = '/features'} className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  {t('strategies.buttons.backtest')}
                </button>
              </div>
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