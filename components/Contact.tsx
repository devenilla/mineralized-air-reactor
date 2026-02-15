import React from 'react';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="py-24 bg-mar-dark border-t border-mar-teal/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
            Initiate <span className="text-mar-teal">Protocol</span>
          </h2>
          <p className="mt-2 text-mar-steel font-mono">Contact us to integrate MAR systems into your facility.</p>
        </div>

        <form className="bg-[#1c2323] p-8 md:p-12 border border-mar-teal/20 shadow-2xl relative">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-mar-teal"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-mar-teal"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-mar-teal mb-2 uppercase tracking-wider">Designation</label>
              <input 
                type="text" 
                id="name"
                className="w-full bg-[#131616] border border-gray-700 text-white p-3 focus:border-mar-teal focus:outline-none transition-colors font-mono"
                placeholder="NAME / COMPANY"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-mar-teal mb-2 uppercase tracking-wider">Comms Link</label>
              <input 
                type="email" 
                id="email"
                className="w-full bg-[#131616] border border-gray-700 text-white p-3 focus:border-mar-teal focus:outline-none transition-colors font-mono"
                placeholder="EMAIL ADDRESS"
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-xs font-mono text-mar-teal mb-2 uppercase tracking-wider">Transmission</label>
            <textarea 
              id="message"
              rows={4}
              className="w-full bg-[#131616] border border-gray-700 text-white p-3 focus:border-mar-teal focus:outline-none transition-colors font-mono"
              placeholder="DETAILS OF INQUIRY..."
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-mar-teal/10 border border-mar-teal text-mar-teal font-bold uppercase tracking-widest py-4 hover:bg-mar-teal hover:text-mar-dark transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Send size={18} className="group-hover:translate-x-1 transition-transform" /> Transmit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;