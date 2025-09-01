import React, { useState } from 'react';
import { Search, Rocket, Gauge, Wallet, Bot, TrendingUp, Code, Shield, Video, Book, HelpCircle, Headphones, ArrowRight } from 'lucide-react';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const navSections = [
    {
      title: 'Empezando',
      items: [
        { icon: Rocket, title: 'Introducción', active: true },
        { icon: Gauge, title: 'Panel de Control' },
        { icon: Wallet, title: 'Configurar Cuenta' }
      ]
    },
    {
      title: 'Guías',
      items: [
        { icon: Bot, title: 'Trading Automatizado' },
        { icon: TrendingUp, title: 'Análisis Técnico' },
        { icon: Code, title: 'API de Trading' },
        { icon: Shield, title: 'Seguridad' }
      ]
    },
    {
      title: 'Recursos',
      items: [
        { icon: Video, title: 'Tutoriales en Video' },
        { icon: Book, title: 'Glosario' },
        { icon: HelpCircle, title: 'Preguntas Frecuentes' }
      ]
    }
  ];

  const quickStartCards = [
    {
      icon: Rocket,
      title: 'Primeros Pasos',
      description: 'Guía rápida para comenzar a operar en nuestra plataforma.',
      readTime: '5 min'
    },
    {
      icon: Bot,
      title: 'Trading Automatizado',
      description: 'Aprende a configurar y ejecutar estrategias de trading automático.',
      readTime: '10 min'
    },
    {
      icon: TrendingUp,
      title: 'Análisis Técnico',
      description: 'Domina las herramientas de análisis técnico avanzado.',
      readTime: '15 min'
    }
  ];

  const popularArticles = [
    {
      title: 'Cómo configurar tu primera estrategia de trading',
      readTime: '5 min de lectura'
    },
    {
      title: 'Guía de indicadores técnicos',
      readTime: '8 min de lectura'
    },
    {
      title: 'Seguridad de la cuenta: Mejores prácticas',
      readTime: '4 min de lectura'
    },
    {
      title: 'Configuración de alertas y notificaciones',
      readTime: '6 min de lectura'
    },
    {
      title: 'Análisis de riesgo y gestión de capital',
      readTime: '12 min de lectura'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Documentación
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprende a utilizar nuestra plataforma de trading con nuestras guías detalladas y tutoriales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Search Box */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Buscar documentación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Navigation */}
              <nav className="space-y-6">
                {navSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a
                            href="#"
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              item.active
                                ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <item.icon size={18} />
                            <span className="text-sm">{item.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido a la Documentación</h1>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Aprende a utilizar nuestra plataforma de trading con nuestras guías detalladas y tutoriales.
              </p>

              {/* Quick Start Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {quickStartCards.map((card, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors">
                      <card.icon className="w-6 h-6 text-teal-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{card.readTime}</span>
                      <ArrowRight className="w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular Articles */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Populares</h2>
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-teal-600">{article.title}</span>
                      <span className="text-sm text-gray-500">{article.readTime}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">¿Necesitas ayuda?</h3>
                    <p className="text-lg opacity-90 mb-6">
                      Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta 
                      que tengas sobre la plataforma.
                    </p>
                    <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Contactar Soporte
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <Headphones className="w-24 h-24 opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documentation;