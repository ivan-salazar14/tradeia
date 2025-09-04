import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900"></div>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Potencia tus
            <span className="block bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Operaciones de Trading
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Automatiza tus estrategias de trading y maximiza tus ganancias con nuestra 
            plataforma cuantitativa avanzada. Estrategias probadas para diferentes perfiles de riesgo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button  onClick={() => window.location.href = '/register'}  className="group bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
              <span>Comenzar Ahora</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button onClick={() => window.location.href = '/login'}  className="group border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-3">
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              <span>Ver Demo</span>
            </button>
          </div>

          {/* Code preview */}
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-6 text-left shadow-2xl border border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">trading_strategy.py</span>
              </div>
              <code className="text-green-400 text-sm">
                <div className="mb-2">strategy = {'{'}{'}'}</div>
                <div className="ml-4 mb-2 text-blue-400">'type': 'moderate',</div>
                <div className="ml-4 mb-2 text-yellow-400">'risk_level': 'medium',</div>
                <div className="ml-4 mb-2 text-purple-400">'indicators': ['EMA55', 'RSI', 'ADX']</div>
                <div className="mb-2">&nbsp;</div>
                <div>{'}'}</div>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;