export default function Testimonials() {
  const items = [
    {
      quote:
        'Las señales moderadas han mejorado mi gestión del riesgo. Ya no persigo entradas, espero confirmaciones.',
      author: 'María L.',
      role: 'Swing trader',
    },
    {
      quote:
        'El backtesting me ayudó a entender cuándo una estrategia deja de funcionar. Transparencia clave.',
      author: 'Carlos P.',
      role: 'Quant aficionado',
    },
    {
      quote:
        'Las notificaciones puntuales y el dashboard responsive me permiten operar desde el móvil sin estrés.',
      author: 'Ana G.',
      role: 'Day trader',
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.author} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{t.author}</span> — {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
