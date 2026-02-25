import React from 'react';
import Hero from '../components/Hero';
import Strategies from '../components/Strategies';
import Features from '../components/Features';
import Services from '../components/Services';
import Education from '../components/Education';
import GettingStarted from '../components/GettingStarted';
import About from '../components/About';
import Contact from '../components/Contact';
import Documentation from '../components/Documentation';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Trust from '../components/Trust';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="TradeIA – Señales de trading cuantitativo para criptomonedas"
        description="Plataforma de señales de trading con análisis técnico avanzado, backtesting y gestión de riesgo. Integración con Binance y dashboard responsive."
      />
      <Hero />
      <Trust />
      <Strategies />
      <Features />
      <Services />
      <Testimonials />
      <Education />
      <FAQ />
      <GettingStarted />
      <About />
      <Contact />
      <Documentation />
    </>
  );
};

export default Home;
