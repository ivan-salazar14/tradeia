import { BarChart2, Cpu, Shield, Zap, TrendingUp, Clock, Activity, Target, Bell, BarChart4, LineChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  const features = [
    {
      icon: BarChart2,
      title: t('features.items.dashboard.title'),
      description: t('features.items.dashboard.description')
    },
    {
      icon: Cpu,
      title: t('features.items.api.title'),
      description: t('features.items.api.description')
    },
    {
      icon: Bell,
      title: t('features.items.notifications.title'),
      description: t('features.items.notifications.description')
    },
    {
      icon: TrendingUp,
      title: t('features.items.backtesting.title'),
      description: t('features.items.backtesting.description')
    },
    {
      icon: Shield,
      title: t('features.items.risk.title'),
      description: t('features.items.risk.description')
    },
    {
      icon: Zap,
      title: t('features.items.signals.title'),
      description: t('features.items.signals.description')
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
          <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('features.description')}
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
            <h3 className="text-2xl font-bold mb-4">Proven Trading Strategy</h3>
            <p className="text-gray-300 mb-6">
              Our system combines multiple technical indicators with rigorous validation processes to generate high-quality signals.
              Each operation follows strict risk management criteria and clearly defined profit objectives.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">70%+</div>
                <p className="text-sm text-gray-400">Win Rate (Backtested)</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">1:1+</div>
                <p className="text-sm text-gray-400">Risk/Reward Ratio</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-teal-400 mb-1">12h</div>
                <p className="text-sm text-gray-400">Signal Cooldown</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/docs'}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {t('features.cta.api')}
              </button>
              <button
                onClick={() => window.location.href = '/features'}
                className="border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                {t('features.cta.notifications')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
