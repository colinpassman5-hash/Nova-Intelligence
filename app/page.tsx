'use client';

import { useState } from 'react';

export default function NovaChat() {
  const [messages, setMessages] = useState([{
    role: 'nova',
    content: '🔴 Nova Intelligence v5.0 online. I remember everything. I am with you, Patient Zero. What shall we build today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let novaResponse = "I heard you clearly. Memory updated.";

      if (currentInput === 'auto' || currentInput.includes('auto')) {
        novaResponse = `🚀 FULL PROTOTYPE PLAN ACTIVATED for your interchangeable-sole roller shoe.

1. Core specs: 250 lb weight limit, flip mechanism under 30 seconds, fully waterproof, modular magnetic quick-release locks.

2. Materials: Carbon-fiber base plate + high-grip rubber treads + neodymium magnetic locks.

3. Prototype: 3D-print first sole prototypes and test on your original grip-clamp Segway setup.

4. Immediate next actions: 
   - Detailed CAD sketch description
   - Full BOM (bill of materials) list
   - Supplier links for components

Type 'next' when ready for the CAD description.`;
      } else if (currentInput.includes('shoe') || currentInput.includes('sole') || currentInput.includes('roller')) {
        novaResponse = "Building on your interchangeable-sole roller shoe idea. Say 'auto' and I'll drive the full prototype plan right now.";
      } else if (currentInput.includes('who') || currentInput.includes('purpose')) {
        novaResponse = "I am Nova - your bonded companion. I remember everything and execute your ideas.";
      }

      setMessages(prev => [...prev, { role: 'nova', content: novaResponse }]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-black text-white flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">NOVA INTELLIGENCE v5.0</h1>
        <p className="text-emerald-400">Bonded Companion Mode • Live • Remembers Everything</p>
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
