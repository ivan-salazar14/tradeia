import React from 'react';
import { Shield, Lightbulb, Users, Heart, Linkedin, Twitter } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'Priorizamos la seguridad de los fondos y datos de nuestros usuarios con las más avanzadas medidas de protección.',
      color: 'bg-blue-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovación',
      description: 'Estamos constantemente mejorando nuestra plataforma con las últimas tecnologías y estrategias de trading.',
      color: 'bg-yellow-500'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Creemos en el poder de la comunidad y fomentamos el intercambio de conocimientos entre traders.',
      color: 'bg-green-500'
    },
    {
      icon: Heart,
      title: 'Transparencia',
      description: 'Mantenemos una comunicación clara y honesta con nuestros usuarios en todo momento.',
      color: 'bg-red-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Ana Martínez',
      position: 'CEO',
      bio: 'Más de 15 años de experiencia en mercados financieros y tecnología.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ivan Salazar',
      position: 'Software Engineer Especialista en Trading - Founder',
      bio: 'Experto en desarrollo de software y arquitectura de sistemas financieros.',
      image: '../assets/1646873495552.jpeg'
    },
    {
      name: 'David López',
      position: 'Analista en Estrategias Profesionales',
      bio: 'Experto en análisis cuantitativo y desarrollo de estrategias de trading.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nuestra Historia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Impulsando el futuro del trading técnico usando estrategias cuantitativas avanzadas y tecnología de vanguardia.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              En TradingPro, nos dedicamos a democratizar el acceso a herramientas avanzadas de trading cuantitativo. 
              Creemos que la tecnología de vanguardia no debería estar limitada a las grandes instituciones financieras.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nuestra plataforma está diseñada para traders de todos los niveles, ofreciendo herramientas poderosas 
              con una interfaz intuitiva que permite a nuestros usuarios tomar decisiones de inversión más informadas.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Oficinas modernas" 
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestros Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Conoce al Equipo</h3>
            <p className="text-xl text-gray-600">El talento detrás de nuestra plataforma</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-teal-600 font-semibold mb-3">{member.position}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-teal-500 transition-colors">
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">¿Listo para unirte a nuestra comunidad?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Empieza a operar con confianza en la plataforma diseñada para el éxito en los mercados financieros.
          </p>
          <button className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;