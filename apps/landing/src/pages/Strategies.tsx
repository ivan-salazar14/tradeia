import { Shield, Zap, Target, BarChart3, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Strategies = () => {
  const { t } = useLanguage();

  const strategies = [
    {
      icon: Shield,
      title: t('strategies.conservative.title'),
      description: t('strategies.conservative.description'),
      winRate: t('strategies.conservative.winRate'),
      riskReward: t('strategies.conservative.riskReward'),
      color: 'bg-green-500',
      features: [
        'ADX > 25 conditions',
        'RSI < 30 for entries',
        'SQZMOM > 0 momentum',
        'DMI difference > 5',
        'ATR > 75 volatility filter'
      ]
    },
    {
      icon: Target,
      title: t('strategies.moderate.title'),
      description: t('strategies.moderate.description'),
      winRate: t('strategies.moderate.winRate'),
      riskReward: t('strategies.moderate.riskReward'),
      color: 'bg-blue-500',
      features: [
        '4/5 condition requirements',
        'RSI <40/>60 range',
        'ADX >15 trend strength',
        'SQZMOM ≠0 momentum filter',
        'DMI diff >3 directional'
      ]
    },
    {
      icon: Zap,
      title: t('strategies.aggressive.title'),
      description: t('strategies.aggressive.description'),
      winRate: t('strategies.aggressive.winRate'),
      riskReward: t('strategies.aggressive.riskReward'),
      color: 'bg-red-500',
      features: [
        'Relaxed entry conditions',
        'ADX >10 minimum',
        'High frequency signals',
        'Quick market entries',
        'Maximum profit potential'
      ]
    },
    {
      icon: Activity,
      title: t('strategies.specialized.title'),
      description: t('strategies.specialized.description'),
      winRate: t('strategies.specialized.winRate'),
      riskReward: t('strategies.specialized.riskReward'),
      color: 'bg-purple-500',
      features: [
        'SQZMOM squeeze detection',
        'ADX breakout confirmation',
        'Volatility-based entries',
        'Momentum-driven exits',
        'Specialized market conditions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('strategies.title')}
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto mb-8">
            {t('strategies.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {t('strategies.buttons.select')}
            </button>
            <button
              onClick={() => window.location.href = '/features'}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              {t('strategies.buttons.backtest')}
            </button>
          </div>
        </div>
      </section>

      {/* Strategies Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`${strategy.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <strategy.icon className="w-12 h-12" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">{strategy.winRate}</div>
                      <div className="text-sm opacity-90">Win Rate</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{strategy.title}</h3>
                  <p className="text-white/90">{strategy.description}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">{strategy.riskReward}</div>
                      <div className="text-sm text-gray-600">Risk/Reward</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">12h</div>
                      <div className="text-sm text-gray-600">Cooldown</div>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-3 text-gray-900">Key Features:</h4>
                  <ul className="space-y-2">
                    {strategy.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => window.location.href = '/register'}
                    className="w-full mt-6 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                  >
                    Choose {strategy.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Risk Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All strategies incorporate comprehensive risk management protocols to protect your capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stop Loss Protection</h3>
              <p className="text-gray-600">Dynamic stop-loss levels based on ATR and market volatility</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Position Sizing</h3>
              <p className="text-gray-600">Intelligent position sizing based on your risk tolerance</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Signal Cooldown</h3>
              <p className="text-gray-600">12-hour cooldown between signals to prevent overtrading</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Trading with Professional Strategies?
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            Choose the strategy that matches your risk tolerance and start receiving automated signals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => window.location.href = '/education'}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Strategies;