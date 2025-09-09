import React from 'react';
import { BookOpen, Play, Users, Award, ChevronRight, Activity, Target, BarChart3, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();

  const indicators = [
    {
      title: t('education.indicators.ema55.title'),
      description: t('education.indicators.ema55.description'),
      icon: Activity,
      video: t('education.indicators.ema55.video'),
      color: 'bg-blue-500'
    },
    {
      title: t('education.indicators.rsi.title'),
      description: t('education.indicators.rsi.description'),
      icon: Target,
      video: t('education.indicators.rsi.video'),
      color: 'bg-green-500'
    },
    {
      title: t('education.indicators.adx.title'),
      description: t('education.indicators.adx.description'),
      icon: TrendingUp,
      video: t('education.indicators.adx.video'),
      color: 'bg-purple-500'
    },
    {
      title: t('education.indicators.sqzmom.title'),
      description: t('education.indicators.sqzmom.description'),
      icon: BarChart3,
      video: t('education.indicators.sqzmom.video'),
      color: 'bg-red-500'
    },
    {
      title: t('education.indicators.atr.title'),
      description: t('education.indicators.atr.description'),
      icon: Activity,
      video: t('education.indicators.atr.video'),
      color: 'bg-yellow-500'
    }
  ];

  const courses = [
    {
      title: 'Crypto Trading 101',
      description: 'From wallets to exchanges - master the fundamentals',
      duration: '2 hours',
      level: 'Beginner',
      icon: BookOpen
    },
    {
      title: 'Technical Analysis Mastery',
      description: 'Learn to read charts and identify trading opportunities',
      duration: '4 hours',
      level: 'Intermediate',
      icon: TrendingUp
    },
    {
      title: 'Risk Management Strategies',
      description: 'Protect your capital and maximize returns',
      duration: '3 hours',
      level: 'Advanced',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('education.title')}
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto mb-8">
            {t('education.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {t('education.certification.cta')}
            </button>
            <button
              onClick={() => window.location.href = '/features'}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              Explore Resources
            </button>
          </div>
        </div>
      </section>

      {/* Indicators Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Technical Indicators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the indicators that power our trading signals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {indicators.map((indicator, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`${indicator.color} p-6 text-white`}>
                  <indicator.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{indicator.title}</h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4">{indicator.description}</p>
                  <button className="flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                    <Play className="w-4 h-4 mr-2" />
                    {indicator.video}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trading Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive courses designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <course.icon className="w-8 h-8 text-teal-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
                  Start Course
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Learning Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our comprehensive library of trading resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Trading Guides</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Complete beginner's guide to crypto trading
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Advanced technical analysis techniques
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Risk management best practices
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Market psychology and trading psychology
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Community & Support</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Active trading community forum
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Weekly live Q&A sessions
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  24/7 support for premium members
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-teal-500 mr-2" />
                  Strategy sharing and collaboration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('education.certification.title')}
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            {t('education.certification.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Certificate upon completion</h4>
              <p className="text-sm text-teal-100">Earn a recognized certification</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Community moderated Q&A</h4>
              <p className="text-sm text-teal-100">Get help from experts and peers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">Weekly live webinars</h4>
              <p className="text-sm text-teal-100">Interactive learning sessions</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/register'}
            className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            {t('education.certification.cta')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Education;