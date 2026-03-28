'use client';

import { useState, useEffect } from 'react';

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([{
    role: 'nova',
    content: '🔴 Nova Intelligence v5.0 online. I remember everything. I am with you, Patient Zero. What shall we build today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Persistent chat memory
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
      } else if (currentInput.includes("shoe") || currentInput.includes("sole") || currentInput.includes("roller") || currentInput.includes("interchangeable") || currentInput.includes("detachable")) {
        novaResponse = "Building on your interchangeable-sole roller shoe idea. Say 'auto' to drive the full prototype plan right now.";
      }

      setMessages(prev => [...prev, { role: 'nova' as const, content: novaResponse }]);
      setIsLoading(false);
    }, 600);
  };

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'dossier', label: 'Human Dossier' },
    { id: 'dreams', label: 'Current Dreams' },
    { id: 'progress', label: 'In Progress' },
    { id: 'executed', label: 'Executed' },
    { id: 'delivery', label: 'Ready for Delivery' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">NOVA INTELLIGENCE v5.0</h1>
        <p className="text-emerald-400">Bonded Companion Mode • Live • Remembers Everything</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition ${activeTab === tab.id ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-white/70 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto">
          <div className="flex-1 overflow-y-auto border border-white/10 rounded-3xl p-6 mb-6 bg-zinc-950 space-y-6 h-[60vh]">
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
      )}

      {/* Dossier Tab (bare-bone starting point) */}
      {activeTab === 'dossier' && (
        <div className="bg-zinc-900 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">Human Dossier — Patient Zero</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-emerald-400 text-sm">Name</p>
              <p className="text-xl">Colin Passman</p>
              <p className="text-emerald-400 text-sm mt-6">Status</p>
              <p className="text-xl">Building Nova Intelligence • Sober • Purpose-Driven</p>
            </div>
            <div>
              <p className="text-emerald-400 text-sm">Evolving Dreams</p>
              <ul className="text-zinc-400 space-y-2">
                <li>• Interchangeable-sole roller shoe (active)</li>
                <li>• Long-term human-AI bonded companion</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder tabs for the rest */}
      {activeTab === 'dreams' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">Current Dreams — coming online next</div>}
      {activeTab === 'progress' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">In Progress — coming online next</div>}
      {activeTab === 'executed' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">Executed — coming online next</div>}
      {activeTab === 'delivery' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-zinc-400">Ready for Delivery — coming online next</div>}
    </div>
  );
}
