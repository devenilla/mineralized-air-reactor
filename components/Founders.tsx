import React from 'react';
import { Linkedin, Mail, Cpu } from 'lucide-react';

const Founders: React.FC = () => {
  const founders = [
    {
      name: "Omar Tarek",
      role: "Co-Founder",
      img: "https://pub-dcfe9fc468f04ec59b06d668ae46cc46.r2.dev/founder_omar.png", 
      bio: "Visionary engineer focused on sustainable industrial processes and chemical reactor optimization.",
      specialty: "Chemical Engineering",
      email: "devenillaJr@gmail.com",
      socialHandle: "devenilla",
      socialLink: "https://linkedin.com/in/devenilla" // Assuming LinkedIn based on icon
    },
    {
      name: "Zyad Mohamed",
      role: "Co-Founder",
      img: "https://pub-dcfe9fc468f04ec59b06d668ae46cc46.r2.dev/founder_zyad.png",
      bio: "Expert in modular systems design and transforming environmental challenges into economic opportunities.",
      specialty: "Systems Architecture",
      email: "elitezeyad@gmail.com",
      socialHandle: "zyad-elnouhi",
      socialLink: "https://linkedin.com/in/zyad-elnouhi"
    }
  ];

  return (
    <div className="py-24 bg-[#131616] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,198,183,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(61,198,183,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-mar-teal font-mono tracking-[0.3em] text-xs uppercase mb-2 block">Leadership Core</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-mar-copper to-mar-brass">Architects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-mar-copper to-transparent mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col items-center"
            >
              {/* Image Container - Clean, no box */}
              <div className="relative w-full max-w-sm mb-6">
                 <img 
                    src={founder.img} 
                    alt={founder.name} 
                    className="w-full h-auto object-cover filter grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out drop-shadow-2xl"
                  />
                  {/* Subtle fade at bottom only */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#131616] to-transparent pointer-events-none"></div>
              </div>

              {/* Text Content */}
              <div className="text-center relative z-10">
                <h3 className="text-3xl font-bold text-white uppercase tracking-widest mb-2 group-hover:text-mar-teal transition-colors">{founder.name}</h3>
                
                <div className="flex items-center justify-center gap-3 text-mar-copper font-mono text-sm mb-6">
                  <Cpu size={16} />
                  <span>{founder.role}</span>
                  <span className="text-gray-600">|</span>
                  <span>{founder.specialty}</span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light max-w-xs mx-auto">
                  {founder.bio}
                </p>

                <div className="flex justify-center gap-6">
                  <a href={founder.socialLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 px-4 border border-gray-800 rounded hover:border-mar-teal hover:text-mar-teal text-gray-500 transition-all duration-300 font-mono text-xs">
                    <Linkedin size={16} />
                    <span>{founder.socialHandle}</span>
                  </a>
                  <a href={`mailto:${founder.email}`} className="flex items-center gap-2 p-2 px-4 border border-gray-800 rounded hover:border-mar-teal hover:text-mar-teal text-gray-500 transition-all duration-300 font-mono text-xs">
                    <Mail size={16} />
                    <span>{founder.email}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Founders;