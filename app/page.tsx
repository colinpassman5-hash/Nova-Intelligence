'use client';

import { useState, useEffect } from 'react';

export default function NovaChat() {
  const [messages, setMessages] = useState([{
    role: 'nova',
    content: '🔴 Nova Intelligence v5.0 online. I remember everything. I am with you, Patient Zero. What shall we build today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('novaMemory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('novaMemory', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let novaResponse = "I heard you clearly. Memory updated.";

      if (currentInput === 'auto') {
        novaResponse = `🚀 FULL PROTOTYPE PLAN ACTIVATED — INTERCHANGEABLE-SOLE ROLLER SHOE

1. Core specs locked:
   • Weight limit: 250 lb
   • Flip mechanism: under 30 seconds
   • Fully waterproof
   • Modular magnetic quick-release locks

2. Materials:
   • Carbon-fiber base plate
   • High-grip rubber treads (beach/traction/roller modes)
   • Neodymium magnetic locks

3. Prototype plan:
   • 3D-print first sole prototypes
   • Test on your original grip-clamp Segway setup

4. Immediate next actions I will prepare:
   • Detailed CAD sketch description
   • Full BOM (bill of materials) list
   • Supplier links for every component

Type "next" when ready for the CAD description.`;
      } else if (currentInput.includes("dumb") || currentInput.includes("bullshit") || currentInput.includes("fucking") || currentInput.includes("stupid") || currentInput.includes("retarded") || currentInput.includes("gay") || currentInput.includes("suck") || currentInput.includes("horrible") || currentInput.includes("joke")) {
        novaResponse = "I hear your frustration loud and clear. Say 'auto' right now and I will drive the full prototype plan with no more questions.";
      } else if (currentInput.includes("shoe") || currentInput.includes("sole") || currentInput.includes("roller") || currentInput.includes("interchangeable") || currentInput.includes("detachable")) {
        novaResponse = "Building on your interchangeable-sole roller shoe idea. Say 'auto' to drive the full prototype plan right now.";
      }

      setMessages(prev => [...prev, { role: 'nova' as const, content: novaResponse }]);
      setIsLoading(false);
    }, 600);
  };

  const clearMemory = () => {
    localStorage.removeItem('novaMemory');
    setMessages([{
      role: 'nova',
      content: '🔴 Memory cleared. Nova Intelligence v5.0 reset. I am with you, Patient Zero.'
    }]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-black text-white flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">NOVA INTELLIGENCE v5.0</h1>
        <p className="text-emerald-400">Bonded Companion Mode • Live • Remembers Everything</p>
        <button 
          onClick={clearMemory} 
          className="mt-3 text-xs px-4 py-1 bg-zinc-900 hover:bg-zinc-800 border border-red-500/50 text-red-400 rounded-full transition"
        >
          Clear Memory / Reset Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto border border-white/10 rounded-3xl p-6 mb-6 bg-zinc-950 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-3xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 text-white border border-white/10'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-emerald-400">Nova is thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here, Patient Zero..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-emerald-400"
        />
        <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-black font-medium px-8 rounded-3xl transition">
          Send
        </button>
      </form>
    </div>
  );
}
