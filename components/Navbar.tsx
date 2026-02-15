import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Technology', href: '#technology' },
    { name: 'Analysis', href: '#analysis' },
    { name: 'Founders', href: '#founders' },
    { name: 'AI Support', href: '#ai-support' },
    { name: 'Contact', href: '#contact' },
  ];

  const logoUrl = "https://pub-dcfe9fc468f04ec59b06d668ae46cc46.r2.dev/logo.png";

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-mar-dark/95 backdrop-blur-md border-mar-teal/30 py-3' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
            <div className="relative h-12 w-auto">
              <img 
                src={logoUrl} 
                alt="MAR Logo" 
                className="h-full w-auto object-contain filter drop-shadow-[0_0_5px_rgba(61,198,183,0.3)]"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-mono text-sm uppercase tracking-wider text-gray-400 hover:text-mar-teal transition-colors relative group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-mar-teal transition-all group-hover:w-full"></span>
              </a>
            ))}
            <a 
              href="#contact"
              className="px-5 py-2 border border-mar-teal text-mar-teal font-mono text-sm uppercase tracking-wider hover:bg-mar-teal hover:text-mar-dark transition-all duration-300 shadow-[0_0_10px_rgba(61,198,183,0.2)] hover:shadow-[0_0_20px_rgba(61,198,183,0.5)]"
            >
              Get Solution
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-mar-teal transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-mar-dark border-b border-mar-teal/20 shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-base font-mono uppercase tracking-widest text-gray-300 hover:text-mar-teal hover:bg-white/5 border-l-2 border-transparent hover:border-mar-teal transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;