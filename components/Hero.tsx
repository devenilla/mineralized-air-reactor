import React from 'react';
import { ArrowRight, Factory, Wind, FlaskConical } from 'lucide-react';

const Hero: React.FC = () => {
  const logoUrl = "https://pub-dcfe9fc468f04ec59b06d668ae46cc46.r2.dev/logo.png";

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mar-teal/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-mar-copper/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(61,198,183,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,198,183,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Dominant Logo */}
        <div className="mb-8 relative w-48 h-48 md:w-64 md:h-64 animate-fade-in-up">
          <div className="absolute inset-0 bg-mar-teal/20 blur-3xl rounded-full"></div>
          <img 
            src={logoUrl} 
            alt="MAR Logo" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(61,198,183,0.4)]"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight text-white mb-6 leading-tight">
          Industrial Evolution <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-mar-teal to-mar-copper relative">
            Elemental Solution
            <svg className="absolute w-full h-2 bottom-0 left-0 text-mar-teal opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-mar-steel mb-10 font-light leading-relaxed">
          We provide modular solutions that turn industrial exhaust into economic assets.
          Purifying the air while synthesizing sellable resources.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a 
            href="#technology" 
            className="group relative px-8 py-4 bg-mar-teal text-mar-dark font-bold uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              Our Technology <ArrowRight size={20} />
            </span>
          </a>
          
          <a 
            href="#contact" 
            className="group px-8 py-4 border border-mar-steel text-mar-steel font-bold uppercase tracking-widest hover:border-mar-teal hover:text-mar-teal transition-colors"
          >
            Partner With Us
          </a>
        </div>

        {/* Stats / Features Strip */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl border-t border-mar-teal/20 pt-10">
          <div className="flex flex-col items-center group">
            <div className="mb-4 p-3 border border-mar-teal/20 rounded bg-mar-dark group-hover:border-mar-teal/50 transition-colors">
              <Wind className="text-mar-teal" size={32} />
            </div>
            <h3 className="font-mono text-xl font-bold text-white mb-1">98% Purification</h3>
            <p className="text-sm text-gray-500 font-mono">Targeted CO₂, SOx, NOx Removal</p>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="mb-4 p-3 border border-mar-copper/20 rounded bg-mar-dark group-hover:border-mar-copper/50 transition-colors">
              <FlaskConical className="text-mar-copper" size={32} />
            </div>
            <h3 className="font-mono text-xl font-bold text-white mb-1">Asset Generation</h3>
            <p className="text-sm text-gray-500 font-mono">Convert Waste to Chemical Commodities</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="mb-4 p-3 border border-mar-brass/20 rounded bg-mar-dark group-hover:border-mar-brass/50 transition-colors">
              <Factory className="text-mar-brass" size={32} />
            </div>
            <h3 className="font-mono text-xl font-bold text-white mb-1">Modular Retrofit</h3>
            <p className="text-sm text-gray-500 font-mono">Seamless Industrial Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;