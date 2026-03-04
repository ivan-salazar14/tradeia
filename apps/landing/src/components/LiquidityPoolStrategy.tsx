import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Lock,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Componente del Medidor de Confianza
const ConfidenceMeter = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { color: 'from-emerald-400 to-emerald-600', label: 'High Confidence', percentage: 85, textColor: 'text-emerald-400' },
    medium: { color: 'from-yellow-400 to-yellow-600', label: 'Medium Confidence', percentage: 65, textColor: 'text-yellow-400' },
    low: { color: 'from-orange-400 to-orange-600', label: 'Low Confidence', percentage: 45, textColor: 'text-orange-400' }
  };

  const { color, label, percentage, textColor } = config[level];

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className={`text-2xl font-bold ${textColor}`}>{percentage}%</span>
      </div>
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

// Componente del Gráfico de Rango
const RangeBoxChart = () => {
  const [animatedPrice, setAnimatedPrice] = useState(50);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedPrice(prev => {
        const variation = (Math.random() - 0.5) * 5;
        const newPrice = prev + variation;
        return Math.max(30, Math.min(70, newPrice));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-700 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(to right, #374151 1px, transparent 1px),
            linear-gradient(to bottom, #374151 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Range Box */}
      <div className="relative h-64">
        {/* Upper Limit */}
        <div className="absolute top-[20%] left-0 right-0 border-t-2 border-dashed border-emerald-500/60">
          <span className="absolute -top-6 right-0 text-emerald-400 text-sm font-mono">Upper Limit</span>
          <span className="absolute -top-6 left-0 text-emerald-400 text-sm font-mono">$2,450</span>
        </div>

        {/* Lower Limit */}
        <div className="absolute top-[80%] left-0 right-0 border-t-2 border-dashed border-emerald-500/60">
          <span className="absolute top-2 right-0 text-emerald-400 text-sm font-mono">Lower Limit</span>
          <span className="absolute top-2 left-0 text-emerald-400 text-sm font-mono">$2,180</span>
        </div>

        {/* Range Box Area */}
        <div className="absolute top-[20%] left-[10%] right-[10%] bottom-[20%] bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-emerald-400 text-sm font-medium">OPTIMAL RANGE</div>
              <div className="text-emerald-300 text-xs">Liquidity Zone</div>
            </div>
          </div>
        </div>

        {/* Price Line */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${80 - animatedPrice * 0.4} Q 100 ${70 - animatedPrice * 0.3} 200 ${75 - animatedPrice * 0.35} T 400 ${animatedPrice * 0.8}`}
            fill="none"
            stroke="url(#priceGradient)"
            strokeWidth="3"
            className="transition-all duration-1000"
          />
        </svg>

        {/* Current Price Indicator */}
        <div 
          className="absolute w-4 h-4 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50 transition-all duration-1000"
          style={{ 
            top: `${animatedPrice}%`, 
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-75" />
        </div>

        {/* Price Label */}
        <div 
          className="absolute bg-gray-800 px-3 py-1 rounded-lg border border-teal-500/50 text-teal-400 text-sm font-mono transition-all duration-1000"
          style={{ 
            top: `${animatedPrice - 15}%`, 
            left: '55%'
          }}
        >
          $2,315.42
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500/30 border border-emerald-500 rounded" />
          <span>Liquidity Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-400 rounded-full" />
          <span>Current Price</span>
        </div>
      </div>
    </div>
  );
};

// Componente del Badge de Protección
const ProtectionBadge = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border border-emerald-500/30">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Shield className="w-12 h-12 text-emerald-400" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Active Protection</h4>
          <span className="text-emerald-400 text-sm font-medium">Hedge Short Enabled</span>
        </div>
        <div className="ml-auto">
          <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isActive ? 'bg-emerald-500' : 'bg-gray-600'}`}>
            <div 
              className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
              onClick={() => setIsActive(!isActive)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-emerald-400 font-bold text-lg">10-20%</div>
          <div className="text-gray-400 text-xs">Hedge Position</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-emerald-400 font-bold text-lg">Auto</div>
          <div className="text-gray-400 text-xs">Break-even Stop</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-emerald-400 font-bold text-lg">IL</div>
          <div className="text-gray-400 text-xs">Compensation</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            If the price drops to the lower limit, your Short profits compensate for Impermanent Loss in the pool.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Indicador
const IndicatorCard = ({ 
  icon: Icon, 
  title, 
  description, 
  rule,
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  rule: string;
  color: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-2 text-teal-400 text-sm hover:text-teal-300 transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Learn More'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300">
                <span className="text-teal-400 font-medium">Golden Rule:</span> {rule}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LiquidityPoolStrategy = () => {
  const { t, language } = useLanguage();
  const [activeTimeframe, setActiveTimeframe] = useState<'4h' | '1d'>('4h');

  const indicators = [
    {
      icon: Activity,
      title: language === 'es' ? 'ADX - Índice Direccional' : 'ADX - Directional Index',
      description: language === 'es' 
        ? 'Confirma la ausencia de tendencia fuerte' 
        : 'Confirms absence of strong trend',
      rule: 'ADX < 23 = Mercado en calma, ideal para pools',
      color: 'bg-blue-500'
    },
    {
      icon: TrendingUp,
      title: language === 'es' ? 'EMAs Entrelazadas' : 'Intertwined EMAs',
      description: language === 'es' 
        ? 'Medias móviles de corto y largo plazo' 
        : 'Short and long term moving averages',
      rule: 'Cuando se "trenzan" = Zona de equilibrio',
      color: 'bg-purple-500'
    },
    {
      icon: BarChart3,
      title: 'SQZMOM',
      description: language === 'es' 
        ? 'Valida momentum bajo sin presiones agresivas' 
        : 'Validates low momentum without aggressive pressures',
      rule: 'Bajo momentum = Rango estable confirmado',
      color: 'bg-orange-500'
    },
    {
      icon: Target,
      title: language === 'es' ? 'Límites ATR Dinámicos' : 'Dynamic ATR Limits',
      description: language === 'es' 
        ? 'Volatilidad real para margen de seguridad' 
        : 'Real volatility for safety margin',
      rule: '± ATR desde precio actual = Límites del pool',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <section id="liquidity-pool-strategy" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              {language === 'es' ? 'Nueva Estrategia' : 'New Strategy'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'es' 
              ? 'Estrategia: Detección de Rango Delta-Neutral' 
              : 'Strategy: Delta-Neutral Range Detection'}
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {language === 'es'
              ? 'Maximiza tu rendimiento en Pools de Liquidez con Protección Activa. Diseñada para protocolos de Liquidez Concentrada como Uniswap V3.'
              : 'Maximize your returns in Liquidity Pools with Active Protection. Designed for Concentrated Liquidity protocols like Uniswap V3.'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Chart */}
          <div>
            <RangeBoxChart />
            
            {/* Timeframe Selector */}
            <div className="flex justify-center gap-4 mt-6">
              {(['4h', '1d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTimeframe === tf 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tf === '4h' 
                    ? (language === 'es' ? '4H (Punto Dulce)' : '4H (Sweet Spot)') 
                    : (language === 'es' ? '1D (Macro)' : '1D (Macro)')}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Protection & Confidence */}
          <div className="space-y-6">
            <ProtectionBadge />
            <ConfidenceMeter level="high" />
            
            {/* Supported Assets */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h4 className="text-white font-semibold mb-4">
                {language === 'es' ? 'Activos Soportados' : 'Supported Assets'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {['ETH/USDT', 'BTC/USDT', 'WBTC/ETH', 'USDC/ETH'].map((pair) => (
                  <span 
                    key={pair}
                    className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 border border-gray-600"
                  >
                    {pair}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Indicators Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            {language === 'es' ? 'Nuestra "Salsa Secreta"' : 'Our "Secret Sauce"'}
          </h3>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8">
            {language === 'es'
              ? 'Análisis multi-indicador de grado institucional para confirmar que el mercado es apto para un pool'
              : 'Institutional-grade multi-indicator analysis to confirm market suitability for pooling'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((indicator, index) => (
              <IndicatorCard key={index} {...indicator} />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            {language === 'es' ? '¿Cómo funciona el Hedge de Protección?' : 'How Does the Protection Hedge Work?'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">
                {language === 'es' ? 'Cobertura Inmediata' : 'Immediate Coverage'}
              </h4>
              <p className="text-gray-400 text-sm">
                {language === 'es'
                  ? 'Al abrir tu pool, abres un SHORT del 10-20% como seguro'
                  : 'When opening your pool, open a 10-20% SHORT as insurance'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">
                {language === 'es' ? 'Compensación de Pérdida' : 'Loss Compensation'}
              </h4>
              <p className="text-gray-400 text-sm">
                {language === 'es'
                  ? 'Si el precio cae, las ganancias del Short compensan la IL'
                  : 'If price drops, Short profits compensate for Impermanent Loss'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-teal-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">
                {language === 'es' ? 'Stop-Loss Inteligente' : 'Smart Stop-Loss'}
              </h4>
              <p className="text-gray-400 text-sm">
                {language === 'es'
                  ? 'Si rompe el techo, el Short se cierra en break-even'
                  : 'If it breaks the ceiling, Short closes at break-even'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            {language === 'es'
              ? 'Deja de adivinar dónde poner tus límites en Uniswap. Deja que nuestro algoritmo calcule la zona de mayor probabilidad y proteja tu capital.'
              : 'Stop guessing where to set your limits on Uniswap. Let our algorithm calculate the highest probability zone and protect your capital.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
              <span>{language === 'es' ? 'Probar Estrategia' : 'Try Strategy'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              {language === 'es' ? 'Ver Documentación' : 'View Documentation'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiquidityPoolStrategy;