import React from 'react';
import { BookOpen, Play, Users, Award, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();

  const indicators = [
    {
      title: 'EMA55',
      description: 'Learn how this 55-period exponential moving average identifies trends.',
      icon: '📈',
      video: 'Spotting Bullish Crossovers'
    },
    {
      title: 'RSI (14)',
      description: 'Detect overbought/oversold levels with the Relative Strength Index.',
      icon: '📊',
      video: 'Interactive Calculator Tool'
    },
    {
      title: t('education.indicators.adx.title'),
      description: t('education.indicators.adx.description'),
      icon: '🎯',
      video: t('education.indicators.adx.video')
    },
    {
      title: 'SQZMOM',
      description: 'Spot momentum squeezes for breakout opportunities.',
      icon: '💎',
      video: 'BTC Squeeze Case Study'
    },
    {
      title: 'ATR',
      description: 'Understand volatility for optimal stop-loss placement.',
      icon: '📏',
      video: 'ATR Calculation Worksheet'
    }
  ];

  const resources = [
    {
      title: 'Trading Basics',
      items: [
        '"Crypto Trading 101" – From wallets to exchanges',
        'Advanced Topics: Risk management, backtesting pitfalls',
        'Strategy Education: Building Your First Moderate Strategy'
      ]
    },
    {
      title: 'Resources',
      items: [
        'Glossary: 50+ terms explained (OHLCV, Cronjob)',
        'Blog & Videos: Weekly posts on 2025 trends',
        'Community Forum: Discuss strategies with other users'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('education.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('education.description')}
          </p>
        </div>

        {/* Indicator Tutorials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Indicator Tutorials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {indicators.map((indicator, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{indicator.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{indicator.title}</h4>
                <p className="text-gray-600 mb-4">{indicator.description}</p>
                <div className="flex items-center text-teal-600 font-medium">
                  <Play size={16} className="mr-2" />
                  {indicator.video}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Resources & Community</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-8">
                <h4 className="text-2xl font-semibold mb-6 text-gray-900">{resource.title}</h4>
                <ul className="space-y-4">
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-700">
                      <ChevronRight size={20} className="text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certification & Community */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Free Certification Course</h3>
              <p className="text-xl mb-6 opacity-90">
                "Quantitative Crypto Trading" – Self-paced course with quizzes and badges.
                Learn to avoid common pitfalls like overtrading.
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-300 mr-2" />
                  <span>Certificate upon completion</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-300 mr-2" />
                  <span>Community moderated Q&A</span>
                </div>
              </div>
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Learning
              </button>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-6xl mb-4">🎓</div>
                <h4 className="text-xl font-semibold mb-2">Why Education Matters</h4>
                <p className="opacity-80 mb-4">
                  95% of our users report better decisions after using these resources.
                  Start learning to avoid common pitfalls.
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">
                    Join Webinar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;