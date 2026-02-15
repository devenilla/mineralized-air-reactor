import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Technology from './components/Technology';
import FactoryAnalysis from './components/FactoryAnalysis';
import Founders from './components/Founders';
import AIChatbot from './components/AIChatbot';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-mar-dark font-sans text-gray-300 selection:bg-mar-teal selection:text-mar-dark overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-metal-texture mix-blend-overlay"></div>
      
      <Navbar scrolled={scrolled} />
      
      <main className="relative z-10">
        <section id="home">
          <Hero />
        </section>

        <section id="technology">
          <Technology />
        </section>

        <section id="analysis">
          <FactoryAnalysis />
        </section>

        <section id="founders">
          <Founders />
        </section>

        <section id="ai-support">
          <AIChatbot />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;