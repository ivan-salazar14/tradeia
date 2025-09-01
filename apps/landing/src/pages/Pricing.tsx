import React from 'react';

const Pricing: React.FC = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Planes de Precios</h1>
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {/* Plan Básico */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="px-6 py-8 flex-grow flex flex-col">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800">Básico</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">Gratis</span>
              </div>
              <p className="mt-2 text-gray-600">Perfecto para comenzar</p>
            </div>
            <ul className="mt-8 space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Acceso a estrategias básicas</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Soporte por correo electrónico</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Actualizaciones mensuales</span>
              </li>
            </ul>
            <div className="mt-auto">
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                Comenzar Prueba
              </button>
            </div>
          </div>
        </div>

        {/* Plan Profesional */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-teal-500 transform scale-105 flex flex-col">
          <div className="bg-teal-500 text-white text-center py-2">
            <span className="text-sm font-semibold">MÁS POPULAR</span>
          </div>
          <div className="px-6 py-8 flex-grow flex flex-col">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800">Profesional</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">$3</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <p className="mt-2 text-gray-600">Para traders serios</p>
            </div>
            <ul className="mt-8 space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Todo en Básico, más:</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Estrategias avanzadas</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Soporte prioritario</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Actualizaciones semanales</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Análisis personalizado</span>
              </li>
            </ul>
            <div className="mt-auto">
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Plan Empresarial */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="px-6 py-8 flex-grow flex flex-col">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800">Empresarial</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">Personalizado</span>
              </div>
              <p className="mt-2 text-gray-600">Para instituciones</p>
            </div>
            <ul className="mt-8 space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Todo en Profesional, más:</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Solución personalizada</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Soporte 24/7</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">API personalizada</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">Entrenamiento dedicado</span>
              </li>
            </ul>
            <div className="mt-auto">
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300">
                Contáctanos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
