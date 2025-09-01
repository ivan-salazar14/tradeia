import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="py-16 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Documentación</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Guía de Inicio Rápido</h2>
          <p className="text-gray-700 mb-6">
            Bienvenido a la documentación de TradingPro. Aquí encontrarás toda la información necesaria para comenzar a utilizar nuestra plataforma.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-600 mb-2">1. Creación de Cuenta</h3>
              <p className="text-gray-700">
                Para comenzar, crea una cuenta en nuestra plataforma haciendo clic en "Registrarse" en la esquina superior derecha.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-teal-600 mb-2">2. Configuración Inicial</h3>
              <p className="text-gray-700 mb-4">
                Una vez registrado, sigue los pasos de configuración inicial para personalizar tu experiencia de trading.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Conecta tu exchange favorito</li>
                <li>Configura tus preferencias de trading</li>
                <li>Selecciona tus pares de trading preferidos</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-teal-600 mb-2">3. Estrategias de Trading</h3>
              <p className="text-gray-700">
                Explora nuestras estrategias predefinidas o crea las tuyas propias utilizando nuestro constructor de estrategias intuitivo.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Documentation</h2>
          <p className="text-gray-700 mb-6">
            Nuestra API te permite integrar TradingPro con tus propias aplicaciones y herramientas personalizadas.
          </p>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code>
{`// Ejemplo de llamada a la API
const response = await fetch('https://api.tradingpro.com/v1/market/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer TU_API_KEY',
    'Content-Type': 'application/json'
  }
});`}
              </code>
            </pre>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">¿Qué exchanges son compatibles?</h3>
              <p className="mt-2 text-gray-700">Actualmente soportamos Binance, Coinbase Pro, Kraken y más. Consulta nuestra lista completa de exchanges compatibles en la sección de configuración.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">¿Cómo se factura el servicio?</h3>
              <p className="mt-2 text-gray-700">El servicio se factura mensualmente a través de tu método de pago registrado. Puedes actualizar o cancelar tu suscripción en cualquier momento.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">¿Ofrecen soporte técnico?</h3>
              <p className="mt-2 text-gray-700">Sí, ofrecemos soporte técnico prioritario para todos nuestros usuarios. Los planes profesionales y empresariales incluyen soporte prioritario 24/7.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
