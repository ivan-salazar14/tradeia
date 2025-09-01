import React from 'react';
import { BarChart3, Bot, Smartphone, Shield, TrendingUp, FileText } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Análisis Técnico Avanzado',
      description: 'Utilizamos indicadores técnicos profesionales como EMA55, RSI, ADX y SQZMOM para identificar oportunidades de trading con alta probabilidad de éxito.',
      color: 'bg-blue-500'
    },
    {
      icon: Bot,
      title: 'Ejecución Automática',
      description: 'Opera sin intervención manual. Nuestro sistema ejecuta órdenes de compra/venta automáticamente según las señales generadas.',
      color: 'bg-green-500'
    },
    {
      icon: Smartphone,
      title: 'Multiplataforma',
      description: 'Accede a tu cuenta y monitorea tus operaciones desde cualquier dispositivo con nuestra interfaz web responsive.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Autenticación de dos factores (2FA) y cifrado de extremo a extremo para proteger tus fondos y datos personales.',
      color: 'bg-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Estrategias Personalizables',
      description: 'Elige entre estrategias conservadoras, moderadas o agresivas según tu perfil de riesgo.',
      color: 'bg-yellow-500'
    },
    {
      icon: FileText,
      title: 'Reportes Detallados',
      description: 'Accede a informes detallados de rendimiento, historial de operaciones y métricas clave para mejorar tu estrategia.',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestros Servicios de Trading
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Potencia tus operaciones con nuestra plataforma de trading cuantitativo avanzado
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
          <h3 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a nuestra plataforma y lleva tu trading al siguiente nivel con estrategias probadas y tecnología de vanguardia.
          </p>
          <button className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
            Abrir Cuenta
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;