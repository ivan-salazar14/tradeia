import React from 'react';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  return (
    <>
      <SEO 
        title="Política de Privacidad | TradeIA"
        description="Política de privacidad de TradeIA. Descubre cómo protegemos y manejamos tus datos personales."
      />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Política de Privacidad
              </h1>
              <p className="text-gray-500">
                Última actualización: 16 sept 2025
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introducción
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  En TradeIA, nos comprometemos a proteger tu privacidad y tus datos personales. 
                  Esta Política de Privacidad describe cómo recopilamos, usamos, divulgamos y 
                  protegemos tu información cuando utilizas nuestra plataforma de trading.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Información que Recopilamos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Recopilamos los siguientes tipos de información:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Información de cuenta (nombre, email, teléfono)</li>
                  <li>Datos de verificación de identidad</li>
                  <li>Información de transacciones y operaciones</li>
                  <li>Datos de uso de la plataforma</li>
                  <li>Información del dispositivo y conexión</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Cómo Usamos tu Información
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Utilizamos tu información para:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Proporcionar y mantener nuestros servicios</li>
                  <li>Procesar tus transacciones y operaciones</li>
                  <li>Verificar tu identidad y cumplir con regulaciones</li>
                  <li>Mejorar y personalizar tu experiencia</li>
                  <li>Comunicarte actualizaciones y soporte</li>
                  <li>Cumplir con obligaciones legales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Protección de Datos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger 
                  tus datos personales contra accesos no autorizados, alteración, divulgación 
                  o destrucción. Utilizamos encriptación SSL, firewalls y controles de acceso 
                  estrictos para salvaguardar tu información.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Cookies y Tecnologías Similares
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia, 
                  analizar el uso de la plataforma y personalizar el contenido. Puedes 
                  gestionar tus preferencias de cookies a través de la configuración de tu navegador.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Compartir Información
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  No vendemos tus datos personales. Podemos compartir información con:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
                  <li>Autoridades regulatorias cuando sea requerido por ley</li>
                  <li>Partners comerciales para funcionalidades específicas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Tus Derechos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Acceder a tus datos personales</li>
                  <li>Rectificar datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Optar por no recibir comunicaciones de marketing</li>
                  <li>Exportar tus datos en formato legible</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Contacto
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:
                  <br />
                  <a href="mailto:privacidad@tradeia.online" className="text-teal-600 hover:underline">
                    privacidad@tradeia.online
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
