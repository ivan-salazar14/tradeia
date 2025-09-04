import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Sobre Nosotros</h1>
          <p className="text-xl text-gray-600">
            En TradingPro, estamos revolucionando la forma en que las personas interactúan con los mercados financieros.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <p className="text-gray-700 mb-6">
              Fundada en 2023 por un equipo de traders profesionales e ingenieros de software, TradingPro nació de la necesidad de crear herramientas de trading accesibles y potentes para todos los niveles de experiencia.
            </p>
            <p className="text-gray-700 mb-6">
              Lo que comenzó como un proyecto personal se ha convertido en una plataforma líder en el sector, ayudando a miles de traders a tomar decisiones más informadas y rentables.
            </p>
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
              <p className="text-teal-700 font-medium">
                "Nuestra misión es democratizar el acceso a herramientas profesionales de trading, haciendo que el análisis de mercados sea accesible para todos."
              </p>
              <p className="text-teal-900 font-semibold mt-4">- Equipo de TradingPro</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Equipo de TradingPro" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'María González',
                role: 'Fundadora & CEO',
                bio: 'Más de 10 años de experiencia en mercados financieros y gestión de carteras.',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'Ivan Salazar',
                role: 'Director de Tecnología',
                bio: 'Ingeniero de software especializado en algoritmos de trading y análisis de datos.',
                image: '../assets/1646873495552.jpg'
              },
              {
                name: 'Ana Martínez',
                role: 'Jefa de Análisis',
                bio: 'Experta en análisis técnico y cuantitativo con un historial comprobado en gestión de riesgos.',
                image: 'https://randomuser.me/api/portraits/women/63.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-teal-600 font-medium">{member.role}</p>
                  <p className="mt-2 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Transparencia',
                description: 'Creemos en la transparencia total en nuestras operaciones y en cómo generamos valor para nuestros usuarios.'
              },
              {
                title: 'Innovación',
                description: 'Nos esforzamos por estar a la vanguardia de la tecnología de trading y análisis de mercados.'
              },
              {
                title: 'Educación',
                description: 'Estamos comprometidos con la educación financiera y el empoderamiento de nuestros usuarios.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-teal-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
