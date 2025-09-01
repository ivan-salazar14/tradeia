import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Correo Electrónico',
      details: ['soporte@tradingplatform.com', 'ventas@tradingplatform.com'],
      color: 'bg-blue-500'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      details: ['+1 (555) 123-4567', 'Lunes a Viernes: 9:00 AM - 6:00 PM (EST)'],
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'Oficinas',
      details: ['123 Calle Principal', 'Ciudad de México, 11520', 'México'],
      color: 'bg-purple-500'
    }
  ];

  const faqs = [
    {
      question: '¿Cuál es el tiempo de respuesta del soporte?',
      answer: 'Nuestro equipo de soporte responde a todas las consultas en un plazo de 24 horas hábiles. Para problemas urgentes, por favor indícalo en el asunto del correo.'
    },
    {
      question: '¿Ofrecen soporte telefónico?',
      answer: 'Sí, ofrecemos soporte telefónico para clientes con planes Profesional y Empresarial. Los clientes Básico pueden contactarnos por correo electrónico o chat en vivo.'
    },
    {
      question: '¿Cómo puedo programar una demostración?',
      answer: 'Puedes programar una demostración personalizada completando el formulario de contacto y seleccionando "Demostración" en el campo de asunto.'
    },
    {
      question: '¿Dónde puedo encontrar documentación?',
      answer: 'Visita nuestra sección de documentación para encontrar guías, tutoriales y respuestas a preguntas frecuentes.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              ¿Tienes preguntas sobre nuestra plataforma o necesitas asistencia? No dudes en contactarnos 
              utilizando la información a continuación o completando el formulario.
            </p>

            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{method.title}</h4>
                    {method.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors">
                  <MessageCircle size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="" disabled>Selecciona un asunto</option>
                  <option value="support">Soporte Técnico</option>
                  <option value="sales">Consultas de Ventas</option>
                  <option value="billing">Facturación</option>
                  <option value="partnership">Asociaciones</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  required
                  checked={formData.privacy}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  Acepto la <a href="#" className="text-teal-600 hover:underline">Política de Privacidad</a> y los{' '}
                  <a href="#" className="text-teal-600 hover:underline">Términos de Servicio</a> *
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;