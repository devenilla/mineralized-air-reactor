import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Mic, Bot } from 'lucide-react';

const API_KEY = process.env.API_KEY;

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Systems Online. I am MAR-OS. How can I assist you with your flue gas optimization today?' }
  ]);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // --- AI FACE VISUALIZER ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let tick = 0;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);
      tick += 0.05;

      // Base Circle
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#161b1b';
      ctx.fill();
      ctx.strokeStyle = '#3dc6b7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner pulsating core
      const pulse = Math.sin(tick) * 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 15 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = thinking ? '#b87333' : '#3dc6b7'; // Orange when thinking, Teal when idle
      ctx.fill();

      // Orbiting rings
      ctx.strokeStyle = thinking ? 'rgba(184, 115, 51, 0.5)' : 'rgba(61, 198, 183, 0.5)';
      ctx.lineWidth = 1;

      // Ring 1
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60, 20, tick, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 2
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60, 20, -tick, 0, Math.PI * 2);
      ctx.stroke();
      
      // Voice waves if thinking
      if (thinking) {
        ctx.beginPath();
        for(let i=0; i<width; i+=5) {
            const y = height - 10 + Math.sin(i*0.1 + tick*5) * 5;
            ctx.lineTo(i, y);
        }
        ctx.strokeStyle = '#b87333';
        ctx.stroke();
      }

      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [thinking]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const prompt = `
        You are MAR-OS, the advanced AI support system for MAR (Mineralized Air Reactor).
        
        CONTEXT:
        - Founders: Omar Tarek & Zyad Mohamed.
        - Tech: Modular bubble columns, heated catalyst beds, ESPs.
        - Goal: Turn flue gas (SOx, NOx, CO2) into sellable assets (Carbonates, Acids).
        - Style: Professional, industrial, slightly robotic but very helpful.
        
        User Query: ${userMsg}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text;
      setMessages(prev => [...prev, { role: 'model', text: text || "Processing Error." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection disrupted. Please retry." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="py-24 bg-mar-dark relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
           <span className="text-mar-teal font-mono tracking-[0.3em] text-xs uppercase mb-2 block">Live Assistance</span>
           <h2 className="text-3xl font-bold text-white uppercase tracking-wider">MAR-OS <span className="text-mar-teal">Support</span></h2>
        </div>

        <div className="bg-[#1c2323] border border-mar-teal/30 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
          
          {/* AI Visualizer Panel */}
          <div className="w-full md:w-1/3 bg-[#131616] border-b md:border-b-0 md:border-r border-mar-teal/20 flex flex-col items-center justify-center p-6">
             <canvas ref={canvasRef} className="w-full h-64 mb-4" />
             <div className="text-center">
               <div className="text-white font-bold text-xl mb-1">MAR-OS</div>
               <div className="text-xs font-mono text-mar-teal flex items-center justify-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${thinking ? 'bg-mar-copper animate-ping' : 'bg-green-500'}`}></span>
                 {thinking ? 'PROCESSING...' : 'ONLINE'}
               </div>
             </div>
          </div>

          {/* Chat Interface */}
          <div className="w-full md:w-2/3 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-[#1c2323] to-[#161b1b]">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded font-mono text-sm leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-mar-teal/10 border border-mar-teal/30 text-white rounded-br-none' 
                       : 'bg-[#111] border border-gray-700 text-gray-300 rounded-bl-none'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="p-4 bg-[#131616] border-t border-mar-teal/20 flex gap-2">
               <input 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 placeholder="Query the database..."
                 className="flex-1 bg-[#1c2323] border border-gray-700 text-white p-3 font-mono focus:border-mar-teal focus:outline-none"
               />
               <button 
                 type="submit" 
                 disabled={thinking}
                 className="bg-mar-teal/20 text-mar-teal p-3 border border-mar-teal hover:bg-mar-teal hover:text-mar-dark transition-colors"
               >
                 <Send size={20} />
               </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIChatbot;