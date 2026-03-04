import React from 'react';
import Hero from '../components/Hero';
import Strategies from '../components/Strategies';
import LiquidityPoolStrategy from '../components/LiquidityPoolStrategy';
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
        title="TradeIA - Análisis técnico avanzado y gestión de riesgo"
        description="Análisis técnico avanzado, backtesting y gestión de riesgo. TradeIA es tu compañero de trading inteligente para maximizar tus ganancias y minimizar tus riesgos."
      />
      <Hero />
      <Trust />
      <Strategies />
      <LiquidityPoolStrategy />
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
