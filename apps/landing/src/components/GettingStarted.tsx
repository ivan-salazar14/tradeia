import React, { useState } from 'react';
import { Copy, Check, Terminal, Book, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GettingStarted = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const steps = [
    {
      step: '1',
      title: t('gettingStarted.steps.account.title'),
      description: t('gettingStarted.steps.account.description'),
      action: t('gettingStarted.steps.account.action')
    },
    {
      step: '2',
      title: t('gettingStarted.steps.strategy.title'),
      description: t('gettingStarted.steps.strategy.description'),
      action: t('gettingStarted.steps.strategy.action')
    },
    {
      step: '3',
      title: t('gettingStarted.steps.signals.title'),
      description: t('gettingStarted.steps.signals.description'),
      action: t('gettingStarted.steps.signals.action')
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('gettingStarted.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('gettingStarted.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Onboarding Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (step.action === 'Register Now') window.location.href = '/register';
                    else if (step.action === 'View Strategies') window.location.href = '/strategies';
                    else if (step.action === 'Connect Exchange') window.location.href = '/dashboard/settings';
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  {step.action}
                </button>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-8 rounded-2xl text-white">
              <Terminal className="w-12 h-12 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">Ready to Trade?</h3>
              <p className="mb-6 opacity-90">
                Start receiving automated trading signals with our comprehensive platform.
              </p>
              <button
                onClick={() => window.location.href = '/register'}
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => window.location.href = '/docs'}
                className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <Book className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-2">API Documentation</h4>
                <p className="text-sm text-gray-600">Complete guides and integration examples</p>
              </div>

              <div
                onClick={() => window.location.href = '/education'}
                className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <Users className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-900 mb-2">Education Center</h4>
                <p className="text-sm text-gray-600">Learn trading with our tutorials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('gettingStarted.bottom.title')}
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('gettingStarted.bottom.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t('gettingStarted.bottom.signup')}
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="text-teal-600 hover:text-teal-700 font-semibold text-lg transition-colors"
            >
              {t('gettingStarted.bottom.dashboard')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;