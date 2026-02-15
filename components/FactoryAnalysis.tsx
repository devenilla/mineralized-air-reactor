import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search, BrainCircuit, Activity, ChevronRight, X, Settings, Sparkles, Thermometer, Beaker, Zap, ShieldAlert, Wrench } from 'lucide-react';

const API_KEY = process.env.API_KEY;

// --- VISUALIZATION COMPONENT ---
interface StackModuleVisuals {
  type: 'ESP' | 'CATALYST_BED' | 'BUBBLE_COLUMN';
  relative_scale: { width: number; height: number }; 
  colors: {
    gas_in: string;    
    gas_out: string;   
    substance: string; 
    reaction: string;  
  };
}

const StackVisualizer: React.FC<{ modules: AnalysisResult['recommended_system'] }> = ({ modules }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let particles: any[] = [];
    
    const padding = 20;
    const availableWidth = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const groundY = height - 40;

    const totalGap = (modules.length - 1) * 30; 
    const moduleWidths = modules.map(m => (m.visual_data?.relative_scale.width || 2) * 35);
    const totalModuleWidth = moduleWidths.reduce((a, b) => a + b, 0);
    
    let startX = (availableWidth - (totalModuleWidth + totalGap)) / 2;
    if (startX < padding) startX = padding;

    const geometries = modules.map((m, i) => {
      const w = moduleWidths[i];
      const hScale = m.visual_data?.relative_scale.height || 3;
      const h = Math.min(hScale * 35, height - 60); 
      const x = startX + moduleWidths.slice(0, i).reduce((a, b) => a + b, 0) + i * 30;
      const y = groundY - h;
      return { x, y, w, h, ...m };
    });

    const render = () => {
      ctx.clearRect(0, 0, availableWidth, height);
      
      ctx.strokeStyle = '#333';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(availableWidth, groundY);
      ctx.stroke();

      geometries.forEach((geom, idx) => {
        const { x, y, w, h, visual_data, type } = geom;
        const colors = visual_data?.colors || { substance: '#fff', reaction: '#fff' };

        ctx.fillStyle = 'rgba(30, 35, 35, 0.9)';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;

        if (type === 'ESP') {
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.beginPath();
          for(let k=1; k<4; k++) {
             ctx.moveTo(x + (w/4)*k, y + 10);
             ctx.lineTo(x + (w/4)*k, y + h - 10);
          }
          ctx.strokeStyle = '#444';
          ctx.stroke();
          
          if(Math.random() < 0.1) {
             ctx.strokeStyle = colors.reaction || '#ffff00';
             ctx.beginPath();
             ctx.moveTo(x + w/2, y + h/2);
             ctx.lineTo(x + w/2 + (Math.random()-0.5)*20, y + h/2 + (Math.random()-0.5)*20);
             ctx.stroke();
          }

        } else if (type === 'CATALYST_BED') {
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          ctx.fillStyle = colors.substance; 
          for(let bx=0; bx<w; bx+=6) {
             for(let by=0; by<h; by+=6) {
                if(Math.random() > 0.5) ctx.fillRect(x + bx, y + by, 3, 3);
             }
          }
          ctx.fillStyle = '#222';
          ctx.fillRect(x - 5, y - 5, w + 10, 8);

        } else if (type === 'BUBBLE_COLUMN') {
          ctx.beginPath();
          ctx.ellipse(x + w/2, y + h, w/2, 8, 0, 0, Math.PI*2); 
          ctx.moveTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.ellipse(x + w/2, y, w/2, 8, 0, 0, Math.PI*2); 
          ctx.lineTo(x + w, y + h);
          ctx.fillStyle = 'rgba(200, 200, 200, 0.05)'; 
          ctx.fill();
          ctx.strokeStyle = '#666';
          ctx.stroke();

          const liquidH = h * 0.85;
          ctx.fillStyle = colors.substance + '90'; 
          ctx.fillRect(x + 4, y + (h - liquidH), w - 8, liquidH);
          
          ctx.fillStyle = colors.reaction;
          if(Math.random() < 0.4) {
             ctx.beginPath();
             ctx.arc(x + 8 + Math.random()*(w-16), y + h - Math.random()*liquidH, Math.random()*3, 0, Math.PI*2);
             ctx.fill();
          }
        }

        ctx.fillStyle = '#aaa';
        ctx.font = '9px monospace';
        ctx.fillText(geom.name.substring(0, 12), x, y - 10);
      });

      // Particle System
      if (Math.random() < 0.4) {
        particles.push({
          x: 0,
          y: groundY - 40 - Math.random() * 20,
          vx: 3,
          color: '#333',
          stage: -1
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        
        let currentModuleIdx = -1;
        for(let idx=0; idx<geometries.length; idx++) {
           const g = geometries[idx];
           if(p.x >= g.x && p.x <= g.x + g.w) {
              currentModuleIdx = idx;
              break;
           }
        }

        if (currentModuleIdx !== -1) {
           const mod = geometries[currentModuleIdx];
           p.color = mod.visual_data?.colors.gas_out || '#fff';
           if(mod.type === 'BUBBLE_COLUMN') {
              p.y -= 0.8; 
              if(p.y < mod.y) p.y = mod.y + mod.h - 10; 
           }
        } else if (p.x > availableWidth) {
           particles.splice(i, 1);
           continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [modules]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// --- MAIN ANALYSIS COMPONENT ---

interface AnalysisResult {
  company_profile: string;
  flue_gas_estimate: {
    volume: string;
    composition: string[];
  };
  recommended_system: Array<{
    id: string;
    name: string;
    type: 'ESP' | 'CATALYST_BED' | 'BUBBLE_COLUMN';
    dimensions: string;
    substances_inventory: string; 
    purification_metrics: string; 
    details: string; 
    visual_data: StackModuleVisuals;
  }>;
  regulatory_insight: {
    country: string;
    regulations_summary: string;
    avoided_penalties: string; // The fee evasion/savings
  };
  auxiliary_equipment: Array<{
    item: string;
    specs: string;
    estimated_cost: string;
  }>;
  economics: {
    capex_estimate: string;
    opex_estimate: string;
    byproduct_revenue: string;
    potential_buyers: string[];
    potential_sellers: string[];
  };
}

const FactoryAnalysis: React.FC = () => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  
  const [basicData, setBasicData] = useState({ name: '', country: '', industry: '', processDescription: '' });
  const [advancedData, setAdvancedData] = useState({
    name: '', country: '', industry: '', flowRate: '', temperature: '', pressure: '', fuelType: '', so2: '', nox: '', co2: '', co: '', pm: '', existingTreatment: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedModule, setSelectedModule] = useState<AnalysisResult['recommended_system'][0] | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      setLoadingStep('Initializing AI Core...');
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const userInput = mode === 'basic' 
        ? `BASIC MODE. Company: ${basicData.name}, Country: ${basicData.country}, Industry: ${basicData.industry}, Desc: ${basicData.processDescription}`
        : `ADVANCED MODE. Company: ${advancedData.name}, Country: ${advancedData.country}, Industry: ${advancedData.industry}, Flow: ${advancedData.flowRate} Nm3/h, Temp: ${advancedData.temperature}C, Pollutants: SO2 ${advancedData.so2}, NOx ${advancedData.nox}`;

      const prompt = `
        You are an advanced AI Process Engineer for MAR. 
        TASK: Detailed techno-economic feasibility study for: ${userInput}.
        
        INSTRUCTIONS:
        1. **Optimize Efficiency:** You are NOT limited to a single template. You can chain multiple Bubble Columns, Catalyst Beds, or ESPs. 
           - Choose the BEST catalysts and solvents for efficiency and cost (e.g., amine blends, ionic liquids, specific metal oxides). 
           - Research the specific COLORS of these chemicals for visualization.
        2. **Country Specifics:** Research environmental laws in **${mode === 'basic' ? basicData.country : advancedData.country}**. 
           - Estimate fines/taxes (Carbon tax, NOx penalties) that this system helps EVADE.
        3. **Hardware Sizing:** Estimate pumps, pipes (length/diameter based on flow), and valves needed. Research their market prices.
        4. **Economics:** Calculate CAPEX/OPEX and Byproduct Revenue. Find buyers/sellers.

        OUTPUT FORMAT (STRICT JSON):
        {
          "company_profile": "String...",
          "flue_gas_estimate": { "volume": "String", "composition": ["String"] },
          "recommended_system": [
            {
              "id": "1",
              "name": "String",
              "type": "ESP" | "CATALYST_BED" | "BUBBLE_COLUMN",
              "dimensions": "String (e.g. 15m Height x 3m Dia)",
              "substances_inventory": "String (Detailed amount & cost of specific catalyst/solvent)",
              "purification_metrics": "String",
              "details": "String",
              "visual_data": {
                "relative_scale": { "width": number (1-5), "height": number (1-10) },
                "colors": {
                  "gas_in": "hex",
                  "gas_out": "hex",
                  "substance": "hex (real chemical color)",
                  "reaction": "hex"
                }
              }
            }
          ],
          "regulatory_insight": {
            "country": "String",
            "regulations_summary": "String",
            "avoided_penalties": "String (e.g. Avoids $50k/yr in Carbon Tax)"
          },
          "auxiliary_equipment": [
             { "item": "String (e.g. Centrifugal Pump)", "specs": "String", "estimated_cost": "String" }
          ],
          "economics": {
            "capex_estimate": "String",
            "opex_estimate": "String",
            "byproduct_revenue": "String",
            "potential_buyers": ["String"],
            "potential_sellers": ["String"]
          }
        }
      `;

      setLoadingStep(`Analyzing Environmental Laws in ${mode === 'basic' ? basicData.country : advancedData.country}...`);
      await new Promise(r => setTimeout(r, 1000));
      
      setLoadingStep('Optimizing Reactor Configuration & Solvents...');
      await new Promise(r => setTimeout(r, 1000));

      setLoadingStep('Sizing Pumps, Pipes & Hardware...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setLoadingStep('Finalizing Report...');
      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setResult(data);
      }

    } catch (error) {
      console.error("Analysis Failed", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 bg-[#111] border-t border-mar-teal/20 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(61,198,183,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(61,198,183,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-mar-teal font-mono tracking-[0.3em] text-xs uppercase mb-2 block">AI Process Engineering</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">
            Factory <span className="text-mar-teal">Analysis</span>
          </h2>
        </div>

        {/* Mode Toggles */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => { setMode('basic'); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 border font-mono uppercase tracking-wider transition-all ${mode === 'basic' ? 'bg-mar-teal text-mar-dark border-mar-teal font-bold' : 'text-gray-500 border-gray-700'}`}><Sparkles size={18} /> Basic</button>
          <button onClick={() => { setMode('advanced'); setResult(null); }} className={`flex items-center gap-2 px-6 py-3 border font-mono uppercase tracking-wider transition-all ${mode === 'advanced' ? 'bg-mar-copper text-mar-dark border-mar-copper font-bold' : 'text-gray-500 border-gray-700'}`}><Settings size={18} /> Advanced</button>
        </div>

        {/* INPUT FORM */}
        {!result && (
          <div className="bg-[#1c2323] border border-mar-teal/30 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto mb-16 relative">
            <form onSubmit={handleAnalyze} className="space-y-6">
              {mode === 'basic' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                    <div><label className="text-mar-teal text-xs font-mono uppercase">Company</label><input required value={basicData.name} onChange={e => setBasicData({...basicData, name: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-3 font-mono" /></div>
                    <div><label className="text-mar-teal text-xs font-mono uppercase">Country</label><input required value={basicData.country} onChange={e => setBasicData({...basicData, country: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-3 font-mono" /></div>
                  </div>
                  <div className="col-span-1 md:col-span-2"><label className="text-mar-teal text-xs font-mono uppercase">Industry</label><input required value={basicData.industry} onChange={e => setBasicData({...basicData, industry: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-3 font-mono" /></div>
                  <div className="col-span-1 md:col-span-2"><label className="text-mar-teal text-xs font-mono uppercase">Details</label><textarea required value={basicData.processDescription} onChange={e => setBasicData({...basicData, processDescription: e.target.value})} rows={3} className="w-full bg-[#131616] border-gray-700 border text-white p-3 font-mono" /></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-mar-copper text-xs font-mono uppercase">Name</label><input required value={advancedData.name} onChange={e => setAdvancedData({...advancedData, name: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-2 font-mono" /></div>
                    <div><label className="text-mar-copper text-xs font-mono uppercase">Country</label><input required value={advancedData.country} onChange={e => setAdvancedData({...advancedData, country: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-2 font-mono" /></div>
                    <div><label className="text-mar-copper text-xs font-mono uppercase">Industry</label><input required value={advancedData.industry} onChange={e => setAdvancedData({...advancedData, industry: e.target.value})} className="w-full bg-[#131616] border-gray-700 border text-white p-2 font-mono" /></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                     <input placeholder="Flow (Nm3/h)" value={advancedData.flowRate} onChange={e => setAdvancedData({...advancedData, flowRate: e.target.value})} className="bg-[#131616] border-gray-700 border text-white p-2 font-mono text-xs" />
                     <input placeholder="Temp (C)" value={advancedData.temperature} onChange={e => setAdvancedData({...advancedData, temperature: e.target.value})} className="bg-[#131616] border-gray-700 border text-white p-2 font-mono text-xs" />
                     <input placeholder="SO2 (ppm)" value={advancedData.so2} onChange={e => setAdvancedData({...advancedData, so2: e.target.value})} className="bg-[#131616] border-gray-700 border text-white p-2 font-mono text-xs" />
                     <input placeholder="NOx (ppm)" value={advancedData.nox} onChange={e => setAdvancedData({...advancedData, nox: e.target.value})} className="bg-[#131616] border-gray-700 border text-white p-2 font-mono text-xs" />
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading} className={`w-full py-4 font-bold uppercase tracking-widest flex justify-center items-center gap-2 ${mode === 'basic' ? 'bg-mar-teal/20 text-mar-teal border border-mar-teal' : 'bg-mar-copper/20 text-mar-copper border border-mar-copper'}`}>
                {loading ? <span className="animate-pulse">{loadingStep}</span> : <><BrainCircuit /> Run Analysis</>}
              </button>
            </form>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="space-y-12 animate-fade-in">
            {/* Visualizer Canvas */}
            <div className="bg-[#1c2323] border border-mar-teal/30 p-4 rounded-lg shadow-2xl h-[450px] relative overflow-hidden group">
               <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 text-xs font-mono text-mar-teal border border-mar-teal/30">MULTI-STAGE SIMULATION</div>
               <StackVisualizer modules={result.recommended_system} />
            </div>

            {/* Regulatory & Economics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
               {/* 1. Profile & Regulatory */}
               <div className="bg-[#161b1b] p-6 border-l-4 border-mar-teal flex flex-col justify-between">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase">Profile & Compliance</h3>
                    <p className="text-gray-400 text-sm mb-4">{result.company_profile}</p>
                    <div className="bg-red-900/10 border border-red-500/20 p-3 mb-4">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-1">
                            <ShieldAlert size={14} /> Regulatory Risk ({result.regulatory_insight.country})
                        </div>
                        <p className="text-gray-400 text-xs">{result.regulatory_insight.regulations_summary}</p>
                    </div>
                 </div>
                 <div className="bg-green-900/10 border border-green-500/20 p-3">
                     <div className="text-green-400 text-xs font-bold uppercase">Estimated Fines Avoided</div>
                     <div className="text-white font-mono text-lg">{result.regulatory_insight.avoided_penalties}</div>
                 </div>
               </div>

               {/* 2. Economics */}
               <div className="bg-[#161b1b] p-6 border-l-4 border-mar-copper">
                 <h3 className="text-xl font-bold text-white mb-4 uppercase">Project Economics</h3>
                 <div className="grid grid-cols-2 gap-4 font-mono text-sm mb-4">
                    <div><div className="text-gray-500">CAPEX</div><div className="text-white">{result.economics.capex_estimate}</div></div>
                    <div><div className="text-gray-500">OPEX</div><div className="text-white">{result.economics.opex_estimate}</div></div>
                    <div className="col-span-2 pt-2 border-t border-gray-800">
                      <div className="text-mar-teal">Revenue: {result.economics.byproduct_revenue}</div>
                    </div>
                 </div>
                 <div className="text-xs space-y-2 bg-black/20 p-2 rounded">
                    <div><span className="text-mar-copper">SUPPLIERS:</span> {result.economics.potential_sellers.join(', ')}</div>
                    <div><span className="text-mar-teal">BUYERS:</span> {result.economics.potential_buyers.join(', ')}</div>
                 </div>
               </div>

               {/* 3. Hardware & Auxiliaries */}
               <div className="bg-[#161b1b] p-6 border-l-4 border-mar-brass">
                 <h3 className="text-xl font-bold text-white mb-4 uppercase">Auxiliary Hardware</h3>
                 <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {result.auxiliary_equipment.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start border-b border-gray-800 pb-2">
                            <div>
                                <div className="text-white text-xs font-bold">{item.item}</div>
                                <div className="text-gray-500 text-[10px]">{item.specs}</div>
                            </div>
                            <div className="text-mar-brass text-xs font-mono">{item.estimated_cost}</div>
                        </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Modules List */}
            <div>
               <h3 className="text-2xl font-bold text-white uppercase mb-6 flex items-center gap-2"><Wrench className="text-mar-teal"/> Stack Configuration</h3>
               <div className="flex flex-wrap gap-4">
                 {result.recommended_system.map((mod, i) => (
                    <div key={i} className="flex items-center">
                      <button onClick={() => setSelectedModule(mod)} className={`w-48 h-40 border-2 p-4 flex flex-col justify-center items-center text-center transition-all ${selectedModule?.id === mod.id ? 'border-mar-teal bg-mar-teal/10' : 'border-gray-700 bg-[#1c2323] hover:border-mar-teal/50'}`}>
                         <div className="text-[10px] font-mono text-mar-teal uppercase mb-1">Stage {i+1}</div>
                         <div className="text-xs font-mono text-gray-500 mb-1">{mod.type}</div>
                         <div className="font-bold text-white text-sm line-clamp-2">{mod.name}</div>
                         <div className="text-[10px] text-gray-400 mt-2 bg-black/30 px-2 py-1 rounded">{mod.dimensions.split('x')[0]}</div>
                      </button>
                      {i < result.recommended_system.length - 1 && <ChevronRight className="mx-2 text-gray-700" />}
                    </div>
                 ))}
               </div>
            </div>
            
            <div className="flex justify-center">
               <button onClick={() => setResult(null)} className="px-8 py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-white uppercase tracking-widest font-mono text-sm transition-colors">
                 Reset Analysis
               </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED MODAL */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1c2323] border border-mar-teal w-full max-w-3xl relative shadow-[0_0_50px_rgba(0,0,0,0.7)] p-8">
            <button onClick={() => setSelectedModule(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
            
            <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
               <div className="p-3 bg-mar-teal/10 border border-mar-teal/30 rounded">
                 {selectedModule.type === 'ESP' ? <Zap className="text-mar-teal"/> : selectedModule.type === 'CATALYST_BED' ? <Thermometer className="text-mar-copper"/> : <Beaker className="text-blue-400"/>}
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-white uppercase">{selectedModule.name}</h2>
                 <div className="text-xs font-mono text-mar-teal flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ONLINE
                   <span>| ID: {selectedModule.id}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-6 font-mono text-sm">
               {/* 1. Dimensions */}
               <div className="bg-black/30 p-4 border-l-2 border-white">
                 <h4 className="text-gray-500 text-xs uppercase mb-1">Dimensions & Sizing</h4>
                 <p className="text-white text-lg">{selectedModule.dimensions}</p>
               </div>

               {/* 2. Substances */}
               <div className="bg-black/30 p-4 border-l-2 border-mar-copper">
                 <h4 className="text-gray-500 text-xs uppercase mb-1">Substances & Inventory</h4>
                 <p className="text-mar-copper whitespace-pre-line leading-relaxed">{selectedModule.substances_inventory}</p>
               </div>

               {/* 3. Purification */}
               <div className="bg-black/30 p-4 border-l-2 border-mar-teal">
                 <h4 className="text-gray-500 text-xs uppercase mb-1">Purification Metrics</h4>
                 <p className="text-mar-teal text-lg">{selectedModule.purification_metrics}</p>
               </div>

               {/* 4. Details */}
               <div className="mt-4 pt-4 border-t border-gray-800">
                 <h4 className="text-gray-500 text-xs uppercase mb-2">Engineering Detail</h4>
                 <p className="text-gray-400 leading-relaxed font-sans">{selectedModule.details}</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryAnalysis;