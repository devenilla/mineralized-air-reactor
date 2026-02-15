import React from 'react';

const Footer: React.FC = () => {
  const logoUrl = "https://pub-dcfe9fc468f04ec59b06d668ae46cc46.r2.dev/logo.png";

  return (
    <footer className="bg-[#111] border-t border-mar-steel/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="MAR Logo" 
            className="h-8 w-auto filter drop-shadow-[0_0_2px_rgba(61,198,183,0.3)]"
          />
          <span className="font-mono text-xl font-bold tracking-widest text-white">
            MAR
          </span>
        </div>

        <div className="text-gray-500 font-mono text-sm text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} Mineralized Air Reactor.</p>
          <p className="text-xs mt-1 text-gray-600">All Systems Nominal.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;