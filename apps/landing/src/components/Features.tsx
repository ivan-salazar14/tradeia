import { BarChart2, Cpu, Shield, Zap, TrendingUp, Clock, Activity, Target, Bell, BarChart4, LineChart } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
    <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-teal-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Cpu,
      title: 'Análisis Cuantitativo',
      description: 'Algoritmos avanzados que analizan múltiples indicadores técnicos en tiempo real para identificar oportunidades de trading.'
    },
    {
      icon: BarChart2,
      title: 'Estrategias Personalizables',
      description: 'Tres perfiles de estrategia (Conservadora, Moderada, Agresiva) adaptables a tu tolerancia al riesgo.'
    },
    {
      icon: Shield,
      title: 'Gestión de Riesgo',
      description: 'Stop-loss dinámicos y gestión de posición inteligente para proteger tu capital.'
    },
    {
      icon: Zap,
      title: 'Ejecución Rápida',
      description: 'Operaciones ejecutadas en milisegundos para aprovechar las mejores oportunidades del mercado.'
    },
    {
      icon: TrendingUp,
      title: 'Rendimiento Comprobado',
      description: 'Estrategias respaldadas por análisis técnico riguroso y backtesting exhaustivo.'
    },
    {
      icon: Clock,
      title: 'Timeframe 4H',
      description: 'Enfoque en el timeframe de 4 horas para señales de mayor calidad y menor ruido de mercado.'
    }
  ];

  const indicators = [
    {
      icon: Activity,
      title: 'EMA55',
      description: 'Media Móvil Exponencial de 55 períodos para identificar la tendencia principal.'
    },
    {
      icon: LineChart,
      title: 'RSI',
      description: 'Índice de Fuerza Relativa para detectar condiciones de sobrecompra/sobreventa.'
    },
    {
      icon: BarChart4,
      title: 'ADX/DMI',
      description: 'Índice de Movimiento Direccional para medir la fuerza de la tendencia.'
    },
    {
      icon: Target,
      title: 'SQZMOM',
      description: 'Squeeze Momentum Indicator para identificar periodos de compresión del precio.'
    },
    {
      icon: Bell,
      title: 'ATR',
      description: 'Average True Range para medir la volatilidad del mercado.'
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Características Principales</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Plataforma de trading cuantitativo diseñada para operar en mercados criptográficos con precisión y eficiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">Indicadores Técnicos Avanzados</h3>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            Nuestro sistema utiliza múltiples indicadores técnicos para generar señales de alta precisión.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {indicators.map((indicator, index) => (
              <div key={index} className="bg-gray-800/50 p-5 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <indicator.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h4 className="font-semibold mb-1">{indicator.title}</h4>
                <p className="text-sm text-gray-400">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-900/30 to-teal-800/20 rounded-2xl p-8 md:p-12 border border-teal-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Estrategia de Trading Probada</h3>
            <p className="text-gray-300 mb-6">
              Nuestro sistema combina múltiples indicadores técnicos con un riguroso proceso de validación para generar señales de alta calidad.
              Cada operación sigue criterios estrictos de gestión de riesgo y objetivos de beneficio claramente definidos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">97.9%</div>
                <p className="text-sm text-gray-400">Eficiencia en llamadas API</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">4/5</div>
                <p className="text-sm text-gray-400">Criterios de validación</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">12h</div>
                <p className="text-sm text-gray-400">Mínimo entre señales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
