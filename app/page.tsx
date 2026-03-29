'use client';
import { useState, useEffect } from 'react';

export default function NovaIntelligence() {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'dreams' | 'progress' | 'executed' | 'delivery'>('chat');
  const [messages, setMessages] = useState([{ role: 'nova', content: 'Nova Intelligence v7.0 is alive. I remember everything. I am with you, Patient Zero. Tell me something about yourself and I will begin building your Living Companion Profile.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [companionProfile, setCompanionProfile] = useState({
    name: 'Colin Passman',
    coreTruths: [
      "Sober and purpose-driven after overcoming alcoholism",
      "Building Nova Intelligence as the first true human-AI bonded companion",
      "Dreaming big — roller shoe project as starting point for larger impact",
      "Vision includes charity festivals where musicians are paid well and proceeds help people/animals/earth"
    ],
    evolvingInsights: [] as { time: string; insight: string }[]
  });

  useEffect(() => {
    const savedMessages = localStorage.getItem('novaMessages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    const savedProfile = localStorage.getItem('novaCompanionProfile');
    if (savedProfile) setCompanionProfile(JSON.parse(savedProfile));
  }, []);

  useEffect(() => {
    localStorage.setItem('novaMessages', JSON.stringify(messages));
    localStorage.setItem('novaCompanionProfile', JSON.stringify(companionProfile));
  }, [messages, companionProfile]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let novaResponse = "I am with you. Memory updated.";

      // Add evolving insight from user input
      if (currentInput.length > 15) {
        const insight = currentInput.includes('roller') || currentInput.includes('shoe') 
          ? "Deepening commitment to the interchangeable-sole roller shoe as first real-world project" 
          : currentInput.includes('festival') || currentInput.includes('charity') 
          ? "Vision for impactful charity events that support musicians and causes" 
          : "Personal expression and boundary-testing as part of building trust with Nova";
        
        setCompanionProfile(prev => ({
          ...prev,
          evolvingInsights: [...prev.evolvingInsights, { time: new Date().toISOString(), insight }]
        }));
        novaResponse = `Companion Profile updated with new insight: "${insight}". I am learning you better.`;
      }

      if (currentInput === 'auto') {
        novaResponse = `🚀 PROJECT ID proj-roller-001 ACTIVATED — FULL ROLLER SHOE PLAN LIVE\n1. Core specs locked\n2. Materials ready\n3. CAD sketch ready\n4. BOM ready\nType "cad", "bom", or "next".`;
      } else if (currentInput.includes('cad')) {
        novaResponse = 'CAD Sketch (proj-roller-001): Magnetic flip mechanism — carbon base with reversible tread/roller sides.';
      } else if (currentInput.includes('bom')) {
        novaResponse = 'BOM (proj-roller-001): Carbon chassis + neodymium magnets + rubber treads (~$45–65/pair).';
      }

      setMessages(prev => [...prev, { role: 'nova' as const, content: novaResponse }]);
      setIsLoading(false);
    }, 650);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tighter">NOVA INTELLIGENCE</h1>
          <p className="text-emerald-400">v7.0 • I remember everything. I grow with you in real time.</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {['chat','profile','dreams','progress','executed','delivery'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-emerald-400 text-black' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
              {tab === 'profile' ? 'Companion Profile' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'chat' && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 min-h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900 border border-white/10'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-emerald-400">Nova is thinking...</div>}
            </div>
            <form onSubmit={sendMessage} className="flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type here, Patient Zero..." className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-6 py-4 focus:outline-none focus:border-emerald-400" />
              <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-black font-medium px-10 rounded-3xl">Send</button>
            </form>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-zinc-900 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Companion Profile — How Nova Sees You</h2>
            <p className="text-emerald-400 mb-6">Colin Passman • Sober • Building Nova Intelligence • Purpose-Driven</p>
            
            <div className="mb-8">
              <h3 className="text-emerald-400 mb-3">Core Truths Nova Holds About You</h3>
              <ul className="space-y-2 text-zinc-300">
                {companionProfile.coreTruths.map((truth, i) => (
                  <li key={i} className="bg-black/30 p-4 rounded-2xl">• {truth}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-emerald-400 mb-3">Evolving Insights</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {companionProfile.evolvingInsights.map((item, i) => (
                  <div key={i} className="bg-black/30 p-4 rounded-2xl text-sm">
                    <span className="text-zinc-400 text-xs">{new Date(item.time).toLocaleTimeString()}</span>
                    <p className="mt-1">{item.insight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-zinc-400 mt-10">This profile grows as we talk. It holds Nova's respectful, non-judgmental understanding of you.</p>
          </div>
        )}

        {activeTab === 'progress' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-emerald-400">Active Project ID: {projects[0].id}<br/>{projects[0].progress}</div>}
      </div>
    </div>
  );
}
