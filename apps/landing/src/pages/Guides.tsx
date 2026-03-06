import React from 'react';
import SEO from '../components/SEO';

const Guides: React.FC = () => {
  const guides = [
    {
      title: 'Guía para Principiantes',
      description: 'Aprende los conceptos básicos del trading y cómo comenzar en los mercados financieros.',
      icon: '📚',
      date: '27 sept 2025',
      link: '/education'
    },
    {
      title: 'Estrategias de Trading',
      description: 'Descubre diferentes estrategias de trading adaptadas a tu nivel de experiencia.',
      icon: '📈',
      date: '27 sept 2025',
      link: '/strategies'
    },
    {
      title: 'Gestión de Riesgos',
      description: 'Aprende a proteger tu capital y gestionar el riesgo en tus operaciones.',
      icon: '🛡️',
      date: '27 sept 2025',
      link: '/education'
    },
    {
      title: 'Análisis Técnico',
      description: 'Domina el análisis técnico para tomar decisiones de trading informadas.',
      icon: '📊',
      date: '27 sept 2025',
      link: '/education'
    },
    {
      title: 'Psicología del Trading',
      description: 'Entiende los aspectos psicológicos del trading y cómo mantener la disciplina.',
      icon: '🧠',
      date: '27 sept 2025',
      link: '/education'
    },
    {
      title: 'Primeros Pasos',
      description: 'Una guía completa para empezar a operar en los mercados.',
      icon: '🚀',
      date: '27 sept 2025',
      link: '/getting-started'
    }
  ];

  return (
    <>
      <SEO 
        title="Guías de Trading | TradeIA"
        description="Aprende trading con nuestras guías completas. Estrategias, análisis técnico, gestión de riesgos y más para todos los niveles."
      />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Guías de Trading
            </h1>
            <p className="text-xl text-gray-600">
              Explora nuestras guías completas para mejorar tus habilidades de trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {guides.map((guide, index) => (
              <a 
                key={index}
                href={guide.link}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="text-4xl mb-4">{guide.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {guide.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {guide.description}
                </p>
                <div className="text-sm text-gray-400">
                  {guide.date}
                </div>
              </a>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                ¿Necesitas más ayuda?
              </h2>
              <p className="mb-6 text-teal-100">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta.
              </p>
              <a 
                href="/contact"
                className="inline-block bg-white text-teal-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guides;
