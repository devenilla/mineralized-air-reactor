import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Zap, FlaskConical, Flame } from 'lucide-react';

// Canvas Visualizer Component
const TechVisualizer: React.FC<{ type: 'reactors' | 'catalysts' | 'esp' }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let precipitates: any[] = [];
    let arcs: any[] = [];
    
    // Canvas dimensions
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Simulation Constants
    const centerX = width / 2;
    const vesselWidth = Math.min(200, width * 0.8);
    const vesselHeight = height * 0.8;
    const vesselY = (height - vesselHeight) / 2;

    const init = () => {
      particles = [];
      precipitates = [];
      arcs = [];
      
      if (type === 'catalysts') {
        // Create static catalyst beads filling the vessel
        for (let i = 0; i < 60; i++) {
           precipitates.push({
             x: centerX + (Math.random() - 0.5) * (vesselWidth - 20),
             y: vesselY + vesselHeight - 10 - Math.random() * (vesselHeight * 0.6),
             r: 5 + Math.random() * 5,
             baseX: 0, 
             baseY: 0
           });
        }
        precipitates.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
      }
    };
    init();

    const drawVessel = (color: string, fill: string) => {
      ctx.beginPath();
      ctx.moveTo(centerX - vesselWidth / 2, vesselY); 
      ctx.lineTo(centerX - vesselWidth / 2, vesselY + vesselHeight); 
      ctx.quadraticCurveTo(centerX, vesselY + vesselHeight + 20, centerX + vesselWidth / 2, vesselY + vesselHeight);
      ctx.lineTo(centerX + vesselWidth / 2, vesselY);
      
      ctx.moveTo(centerX + vesselWidth / 2, vesselY);
      ctx.ellipse(centerX, vesselY, vesselWidth / 2, 10, 0, 0, Math.PI * 2);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = fill;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX - vesselWidth / 2 + 10, vesselY + 20);
      ctx.lineTo(centerX - vesselWidth / 2 + 10, vesselY + vesselHeight - 20);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 4;
      ctx.stroke();
    };

    const drawESPChamber = () => {
      // Darker background for contrast
      ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
      ctx.fillRect(centerX - vesselWidth/2, vesselY, vesselWidth, vesselHeight);
      
      // Collection Plates (Outer Walls)
      ctx.fillStyle = '#333';
      ctx.fillRect(centerX - vesselWidth/2 - 15, vesselY, 15, vesselHeight); 
      ctx.fillRect(centerX + vesselWidth/2, vesselY, 15, vesselHeight); 
      
      // Plate connectors
      ctx.fillStyle = '#555';
      ctx.fillRect(centerX - vesselWidth/2, vesselY, 5, vesselHeight); 
      ctx.fillRect(centerX + vesselWidth/2 - 5, vesselY, 5, vesselHeight);

      // Central Discharge Electrode (The Wire)
      ctx.beginPath();
      ctx.moveTo(centerX, vesselY);
      ctx.lineTo(centerX, vesselY + vesselHeight);
      ctx.strokeStyle = '#facc15'; // Bright Yellow Gold
      ctx.setLineDash([15, 5]);
      ctx.lineWidth = 3;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Corona Discharge Glow
      const grad = ctx.createRadialGradient(centerX, vesselY + vesselHeight/2, 2, centerX, vesselY + vesselHeight/2, vesselWidth/1.5);
      grad.addColorStop(0, 'rgba(250, 204, 21, 0.3)');
      grad.addColorStop(0.4, 'rgba(61, 198, 183, 0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(centerX - vesselWidth/2, vesselY, vesselWidth, vesselHeight);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // -- BUBBLE REACTOR --
      if (type === 'reactors') {
        drawVessel('rgba(255,255,255,0.3)', 'rgba(61, 198, 183, 0.1)');
        
        if (Math.random() < 0.2) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * (vesselWidth - 20),
            y: vesselY + vesselHeight - 10,
            r: Math.random() * 4 + 2,
            speed: Math.random() * 1.5 + 0.5,
            isPurified: false
          });
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.y -= p.speed;
          
          if (p.x < centerX - vesselWidth/2 + 5) p.x += 1;
          if (p.x > centerX + vesselWidth/2 - 5) p.x -= 1;

          if (p.y < vesselY + vesselHeight * 0.6 && !p.isPurified && Math.random() < 0.03) {
            p.isPurified = true;
            p.r = 0; 
            for(let j=0; j<3; j++) {
              precipitates.push({
                x: p.x,
                y: p.y,
                r: 1.5,
                alpha: 1,
                vx: (Math.random() - 0.5) * 2
              });
            }
          }

          if (p.y < vesselY || (p.isPurified && p.r <= 0)) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = '#3dc6b7';
          ctx.stroke();
          ctx.fillStyle = 'rgba(61,198,183,0.3)';
          ctx.fill();
        }

        for (let i = precipitates.length - 1; i >= 0; i--) {
          const p = precipitates[i];
          p.y += 0.8;
          p.x += p.vx;
          p.vx *= 0.95;

          if (p.y > vesselY + vesselHeight - 5) {
            p.y = vesselY + vesselHeight - 5;
            p.alpha -= 0.02;
          }

          if (p.alpha <= 0) {
            precipitates.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
        }
      }

      // -- ESP --
      else if (type === 'esp') {
        drawESPChamber();

        // High volume of dirty particles from bottom
        if (Math.random() < 0.8) { // Increased spawn rate
          particles.push({
            x: centerX + (Math.random() - 0.5) * (vesselWidth - 40),
            y: vesselY + vesselHeight + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -3 - Math.random() * 2,
            color: '#666',
            ionized: false,
            life: 200,
            charge: 0
          });
        }

        // Random Arcs (Lightning)
        if (Math.random() < 0.15) {
          arcs.push({
            x1: centerX,
            y1: vesselY + Math.random() * vesselHeight,
            x2: centerX + (Math.random() < 0.5 ? -1 : 1) * (vesselWidth/2 - 10),
            y2: vesselY + Math.random() * vesselHeight,
            life: 5
          });
        }

        // Draw Arcs
        for (let i = arcs.length - 1; i >= 0; i--) {
          const arc = arcs[i];
          ctx.beginPath();
          ctx.moveTo(arc.x1, arc.y1);
          // Jagged line
          const midX = (arc.x1 + arc.x2) / 2 + (Math.random() - 0.5) * 20;
          const midY = (arc.y1 + arc.y2) / 2 + (Math.random() - 0.5) * 20;
          ctx.lineTo(midX, midY);
          ctx.lineTo(arc.x2, arc.y2);
          
          ctx.strokeStyle = `rgba(100, 200, 255, ${arc.life / 5})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
          
          arc.life--;
          if (arc.life <= 0) arcs.splice(i, 1);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.y += p.vy;
          p.x += p.vx;

          // Ionization Zone
          const distToCenter = Math.abs(p.x - centerX);
          if (!p.ionized && distToCenter < 25 && p.y < vesselY + vesselHeight * 0.95) {
            p.ionized = true;
            p.color = '#fff'; // Initial flash
            p.vx = p.x < centerX ? -4 - Math.random()*2 : 4 + Math.random()*2; // Fast migration
            p.vy *= 0.5; // Slow down vertical
          }

          if (p.ionized) {
             // Gradient shift to blue/teal as they charge
             if(p.charge < 1) p.charge += 0.1;
             p.color = `rgba(${255 * (1-p.charge) + 61 * p.charge}, ${255 * (1-p.charge) + 198 * p.charge}, ${255 * (1-p.charge) + 183 * p.charge}, 1)`;
             
             // Accelerate to plates
             p.vx *= 1.05;
          }

          // Hit Plates
          if (p.x <= centerX - vesselWidth/2 + 10 || p.x >= centerX + vesselWidth/2 - 10) {
            p.vx = 0;
            p.vy = 0;
            p.color = '#3dc6b7'; // Collected
            p.life -= 8; // Fade fast
            
            // Spark on impact
            if(Math.random() < 0.1) {
               ctx.fillStyle = '#fff';
               ctx.beginPath();
               ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
               ctx.fill();
            }
          }

          if (p.y < vesselY - 10 || p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.ionized ? 3 : 4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          // Glow if ionized
          if(p.ionized) {
             ctx.shadowColor = p.color;
             ctx.shadowBlur = 5;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // -- CATALYSTS --
      else if (type === 'catalysts') {
        drawVessel('rgba(184, 115, 51, 0.5)', 'rgba(0,0,0,0.3)');

        precipitates.forEach((bead, idx) => {
          const time = Date.now() / 500;
          const offsetX = Math.sin(time + idx) * 5;
          const offsetY = Math.cos(time + idx * 0.5) * 5;
          
          ctx.beginPath();
          ctx.arc(bead.x + offsetX, bead.y + offsetY, bead.r, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(bead.x + offsetX - 2, bead.y + offsetY - 2, 1, bead.x + offsetX, bead.y + offsetY, bead.r);
          g.addColorStop(0, '#e5a56d');
          g.addColorStop(1, '#8c501c');
          ctx.fillStyle = g;
          ctx.fill();
        });

        if (Math.random() < 0.25) {
          particles.push({
            x: centerX + (Math.random() - 0.5) * (vesselWidth - 30),
            y: vesselY + vesselHeight + 10,
            vy: -2,
            color: '#aaa',
            converted: false
          });
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.y += p.vy;

          let collided = false;
          for (let bead of precipitates) {
            const time = Date.now() / 500;
            const bx = bead.x + Math.sin(time + particles.indexOf(p)) * 5;
            const by = bead.y + Math.cos(time + particles.indexOf(p) * 0.5) * 5;
            
            const dx = p.x - bx;
            const dy = p.y - by;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < bead.r + 3) {
              collided = true;
              break;
            }
          }

          if (collided && !p.converted) {
            p.converted = true;
            p.color = '#3dc6b7';
          }

          if (p.y < vesselY - 10) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [type]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};


const Technology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reactors' | 'catalysts' | 'esp'>('reactors');

  const content = {
    reactors: {
      title: "Bubble Column Reactors",
      description: "Advanced fluid dynamics maximize gas-liquid contact. Bubbles rise through our proprietary solution, where 95% of targeted gases react and dissolve, precipitating into valuable carbonates and acids.",
      icon: <FlaskConical className="w-6 h-6" />,
      specs: [
        { label: "CO₂ + NaOH", value: "Na₂CO₃ (Soda Ash)" },
        { label: "CO₂ + Na₂CO₃", value: "NaHCO₃ (Bicarbonate)" },
        { label: "SOx + H₂O", value: "H₂SO₄ (Sulfuric Acid)" },
        { label: "NOx + H₂O₂", value: "HNO₃ (Nitric Acid)" }
      ]
    },
    catalysts: {
      title: "Heated Catalyst Beds",
      description: "Continuously stirred and heated beds utilize metal oxides (ZnO, MnO₂, CuO) to break down stubborn pollutants like CO and NO that resist liquid phase absorption.",
      icon: <Flame className="w-6 h-6" />,
      specs: [
        { label: "Active Agents", value: "ZnO, MnO₂, CuO" },
        { label: "Mechanism", value: "Heated & Stirred" },
        { label: "Temperature", value: "150°C - 300°C" },
        { label: "Efficiency", value: "High Surface Area" }
      ]
    },
    esp: {
      title: "Electrostatic Precipitators",
      description: "High-voltage electrostatic fields ionize particulate matter. Charged particles are aggressively attracted to collection plates, protecting downstream reactors.",
      icon: <Zap className="w-6 h-6" />,
      specs: [
        { label: "Technology", value: "Dry ESP" },
        { label: "Voltage", value: "40kV - 70kV DC" },
        { label: "Target", value: "Soot & Ash" },
        { label: "Efficiency", value: "> 99.5%" }
      ]
    }
  };

  return (
    <div className="py-20 bg-mar-dark relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#161b1b] to-[#111]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest">
            Core <span className="text-mar-teal">Technology</span>
          </h2>
          <div className="w-24 h-1 bg-mar-teal mx-auto mt-4"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {(Object.keys(content) as Array<keyof typeof content>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 border border-mar-teal/30 font-mono text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === key
                  ? 'bg-mar-teal text-mar-dark font-bold shadow-[0_0_15px_rgba(61,198,183,0.3)]'
                  : 'text-gray-400 hover:text-mar-teal hover:border-mar-teal'
              }`}
            >
              {content[key].title}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-[#1c2323] border border-mar-teal/20 rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Left Side: Information */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-mar-teal/10 bg-[#161b1b]/50">
            <div className="flex items-center gap-4 mb-6 text-mar-teal">
              <div className="p-3 bg-mar-teal/10 rounded-lg">
                {content[activeTab].icon}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">{content[activeTab].title}</h3>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {content[activeTab].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {content[activeTab].specs.map((spec, idx) => (
                <div key={idx} className="bg-[#111] p-4 border-l-2 border-mar-teal/50">
                  <div className="text-xs font-mono text-gray-500 uppercase mb-1">{spec.label}</div>
                  <div className="text-sm font-bold text-mar-teal font-mono">{spec.value}</div>
                </div>
              ))}
            </div>

            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-mono text-white hover:text-mar-teal uppercase tracking-widest transition-colors self-start border-b border-transparent hover:border-mar-teal pb-1">
              Request Full Specifications <ArrowRight size={16} />
            </a>
          </div>

          {/* Right Side: Visualization */}
          <div className="w-full lg:w-1/2 relative bg-[#111] min-h-[300px] lg:min-h-auto flex items-center justify-center overflow-hidden">
             {/* Labels overlay */}
             <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-mar-dark/80 border border-mar-teal/30 text-[10px] font-mono text-mar-teal uppercase animate-pulse">
                  System Operational
                </span>
             </div>
             
             <div className="w-full h-full absolute inset-0">
                <TechVisualizer type={activeTab} />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Technology;