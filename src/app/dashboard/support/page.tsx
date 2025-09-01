import React from "react";

export default function SupportPage() {
  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Encuentre respuestas a preguntas comunes y obtenga ayuda con la plataforma. Si no encuentra lo que busca, no dude en contactar a nuestro equipo de soporte.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes (FAQ)</h2>
        
        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
              <span>¿Cómo se genera una señal?</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 px-4 pb-4">
              Nuestros algoritmos de IA analizan múltiples indicadores de mercado en tiempo real, como volumen, volatilidad y patrones de precios, para identificar oportunidades de trading con alta probabilidad de éxito.
            </p>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
              <span>¿Puedo configurar mis propios bots?</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 px-4 pb-4">
              Sí, en la sección &apos;Gestión de Bots&apos; puedes personalizar completamente tus bots, ajustando el nivel de riesgo, la estrategia a seguir y los activos en los que operará.
            </p>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
              <span>¿Cómo funciona el onboarding?</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 px-4 pb-4">
              El onboarding te permite personalizar tu experiencia en la plataforma. Puedes completarlo desde el banner amarillo en el dashboard o accediendo directamente desde el menú principal.
            </p>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
              <span>¿Qué tipos de análisis están disponibles?</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 px-4 pb-4">
              Puedes acceder a análisis de ganancias vs pérdidas mensuales, tasa de acierto (win rate), y métricas de rendimiento de tu cartera para optimizar tus estrategias de trading.
            </p>
          </details>
          
          <details className="group">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 rounded-lg hover:bg-gray-100">
              <span>¿Cómo contactar al soporte técnico?</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3 px-4 pb-4">
              Puedes contactarnos a través del email support@tradeia.com o usando el chat en vivo disponible en la esquina inferior derecha de la plataforma durante horario de oficina.
            </p>
          </details>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Necesitas más ayuda?</h3>
          <p className="text-blue-800 mb-4">
            Si no encuentras la respuesta que buscas, nuestro equipo de soporte está aquí para ayudarte.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Contactar Soporte
            </button>
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Ver Documentación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}