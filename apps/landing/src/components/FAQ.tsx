export default function FAQ() {
  const faqs = [
    {
      q: '¿Qué precisión tienen las señales?',
      a: 'Depende de la estrategia y el mercado. Mostramos métricas en backtesting y fomentamos gestión de riesgo 1:1+.',
    },
    {
      q: '¿Funciona con cualquier exchange?',
      a: 'Nos integramos con datos de Binance para análisis. La ejecución puede conectarse vía API a tus bots.',
    },
    {
      q: '¿Cómo recibo alertas?',
      a: 'Email, push o integraciones vía webhooks. Puedes configurar filtros por símbolo, timeframe y estrategia.',
    },
    {
      q: '¿Hay plan gratis?',
      a: 'Sí, con funciones limitadas orientadas a pruebas y educación. Luego puedes escalar según tus necesidades.',
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-lg border border-gray-200 p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium text-gray-800">
                <span>{f.q}</span>
                <span className="ml-4 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-3 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
