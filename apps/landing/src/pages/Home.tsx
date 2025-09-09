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

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Strategies />
      <Features />
      <Services />
      <Education />
      <GettingStarted />
      <About />
      <Contact />
      <Documentation />
    </>
  );
};

export default Home;
