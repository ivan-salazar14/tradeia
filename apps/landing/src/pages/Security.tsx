import React from 'react';
import SEO from '../components/SEO';

const Security: React.FC = () => {
  const securityFeatures = [
    {
      title: 'Encriptación de Datos',
      description: 'Todos tus datos están protegidos con encriptación AES-256 de nivel bancario.',
      icon: '🔐'
    },
    {
      title: 'Autenticación de Dos Factores (2FA)',
      description: 'Protege tu cuenta con una capa adicional de seguridad mediante 2FA.',
      icon: '🛡️'
    },
    {
      title: 'Monitoreo 24/7',
      description: 'Nuestro equipo monitorea la plataforma constantemente para detectar amenazas.',
      icon: '👁️'
    },
    {
      title: 'Almacenamiento Seguro',
      description: 'Tus fondos se almacenan en billeteras frías con seguridad multisig.',
      icon: '💎'
    },
    {
      title: 'Protocolo SSL',
      description: 'Conexiones seguras mediante certificado SSL/TLS de última generación.',
      icon: '🔒'
    },
    {
      title: 'Verificación de Identidad',
      description: 'Proceso KYC/AML completo para prevenir fraudes y lavado de dinero.',
      icon: '✅'
    }
  ];

  return (
    <>
      <SEO 
        title="Seguridad | TradeIA"
        description="Conoce las medidas de seguridad que implementamos en TradeIA para proteger tus datos y fondos."
      />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Seguridad
            </h1>
            <p className="text-xl text-gray-600">
              Última actualización: 9 sept 2025
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white mb-12">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Tu Seguridad es Nuestra Prioridad
              </h2>
              <p className="text-teal-100 text-center max-w-2xl mx-auto">
                Implementamos los más altos estándares de seguridad para proteger tus datos 
                personales y tus fondos en todo momento.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Medidas de Protección Adicionales
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Backups Regulares
                    </h3>
                    <p className="text-gray-600">
                      Realizamos copias de seguridad automáticas de todos los datos para garantizar 
                      la recuperación en caso de cualquier incidente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Pruebas de Penetración
                    </h3>
                    <p className="text-gray-600">
                      Realizamos auditorías de seguridad regulares y pruebas de penetración 
                      para identificar y corregir vulnerabilidades.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Cumplimiento Normativo
                    </h3>
                    <p className="text-gray-600">
                      Cumplimos con todas las regulaciones aplicables incluyendo GDPR, 
                      AML/KYC y otras normativas de protección de datos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-600 mb-4">
              ¿Tienes alguna pregunta sobre nuestra política de seguridad?
            </p>
            <a 
              href="/contact"
              className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Contactar Equipo de Seguridad
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;
