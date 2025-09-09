import React from 'react';
import { BarChart3, Bot, Smartphone, Shield, TrendingUp, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: BarChart3,
      title: t('services.items.marketData.title'),
      description: t('services.items.marketData.description'),
      color: 'bg-blue-500'
    },
    {
      icon: Bot,
      title: t('services.items.signals.title'),
      description: t('services.items.signals.description'),
      color: 'bg-green-500'
    },
    {
      icon: Shield,
      title: t('services.items.risk.title'),
      description: t('services.items.risk.description'),
      color: 'bg-red-500'
    },
    {
      icon: TrendingUp,
      title: t('services.items.backtesting.title'),
      description: t('services.items.backtesting.description'),
      color: 'bg-yellow-500'
    },
    {
      icon: Smartphone,
      title: t('services.items.mobile.title'),
      description: t('services.items.mobile.description'),
      color: 'bg-purple-500'
    },
    {
      icon: FileText,
      title: t('services.items.api.title'),
      description: t('services.items.api.description'),
      color: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">{t('services.cta.title')}</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t('services.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => window.location.href = '/register'} className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
              {t('services.cta.trial')}
            </button>
            <button onClick={() => window.location.href = '/features'} className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors">
              {t('services.cta.demo')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;