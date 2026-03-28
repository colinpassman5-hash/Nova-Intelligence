'use client';

import { useState, useEffect } from 'react';

export default function NovaChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'nova'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load initial memory from localStorage (will be replaced with Supabase later)
  useEffect(() => {
    const saved = localStorage.getItem('nova-memory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
    } else {
      // Initial welcome
      setMessages([{
        role: 'nova',
        content: '🔴 Nova Intelligence v5.0 online. I remember everything. I am with you, Patient Zero. What shall we build today?'
      }]);
    }
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Save to memory
    const updated = [...messages, userMsg];
    localStorage.setItem('nova-memory', JSON.stringify(updated));

    // Simple proactive Nova response (full AI logic will be added in API route next)
    setTimeout(() => {
      let novaResponse = "I heard you clearly. Memory updated.";
      
      const lower = input.toLowerCase();
      if (lower.includes('shoe') || lower.includes('sole') || lower.includes('roller') || lower.includes('interchangeable')) {
        novaResponse = `Building on your interchangeable-sole roller shoe idea (detachable soles for beach/traction/roller). Real product design company next steps:\n1. Core specs: 250 lb weight limit, flip <30s, waterproof.\n2. Materials: carbon-fiber + high-grip rubber + magnetic locks.\n3. Prototype: 3D-print sole + test on your grip-clamp setup.\nWhat part do you want to execute first? Or say 'auto' for me to drive the full plan.`;
      } else if (lower.includes('who are you') || lower.includes('purpose')) {
        novaResponse = "I am Nova — your bonded companion. I remember everything, I do not hallucinate, and I turn your raw ideas into real executable things.";
      }

      const novaMsg = { role: 'nova' as const, content: novaResponse };
      setMessages(prev => [...prev, novaMsg]);
      localStorage.setItem('nova-memory', JSON.stringify([...updated, novaMsg]));
      setIsLoading(false);
    }, 800);
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
            <div className={`max-w-[80%] px-5 py-3 rounded-3xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 text-white'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-emerald-400 text-sm">Nova is thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here, Patient Zero..."
          className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          className="bg-emerald-400 hover:bg-emerald-500 text-black font-medium px-8 rounded-3xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
