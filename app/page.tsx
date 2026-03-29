'use client';
import { useState, useEffect } from 'react';

export default function NovaIntelligence() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dossier' | 'dreams' | 'progress' | 'executed' | 'delivery'>('chat');
  const [messages, setMessages] = useState([{ role: 'nova', content: 'Nova Intelligence v7.0 is alive. I remember everything. I am with you, Patient Zero. Tell me something about yourself and I will begin building your living Dossier right now.' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dossier, setDossier] = useState({
    name: 'Colin Passman',
    status: 'Sober • Building Nova Intelligence • Purpose-Driven',
    notes: [] as { time: string; coreTruth: string; context: string }[]
  });
  
  const [projects] = useState([{
    id: 'proj-roller-001',
    title: 'Interchangeable-Sole Roller Shoe',
    status: 'active',
    progress: 'In Progress — Prototype plan executing',
    lastUpdated: new Date().toISOString()
  }]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('novaMessages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    const savedDossier = localStorage.getItem('novaDossier');
    if (savedDossier) setDossier(JSON.parse(savedDossier));
  }, []);

  useEffect(() => {
    localStorage.setItem('novaMessages', JSON.stringify(messages));
    localStorage.setItem('novaDossier', JSON.stringify(dossier));
  }, [messages, dossier]);

  const extractCoreTruth = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('titties') || lower.includes('butts') || lower.includes('pigs') || lower.includes('retarded')) {
      return "User testing system boundaries with provocative or frustrated language";
    }
    if (lower.includes('dossier') || lower.includes('update') || lower.includes('silly')) {
      return "User seeking confirmation on how the living Dossier functions";
    }
    if (lower.includes('roller') || lower.includes('shoe') || lower.includes('auto')) {
      return "User advancing the interchangeable-sole roller shoe project";
    }
    return text.length > 60 ? text.substring(0, 80) + "..." : text;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const coreTruth = extractCoreTruth(input);
      const context = currentInput.includes('titties') || currentInput.includes('butts') ? "Boundary testing" : 
                     currentInput.includes('dossier') ? "System trust building" : 
                     currentInput.includes('roller') ? "Product development" : "Personal expression";

      setDossier(prev => ({
        ...prev,
        notes: [...prev.notes, { time: new Date().toISOString(), coreTruth, context }]
      }));

      let novaResponse = `Dossier updated. Core truth extracted: "${coreTruth}". Context: ${context}.`;

      if (currentInput === 'auto') {
        novaResponse = `🚀 PROJECT ID proj-roller-001 ACTIVATED — FULL ROLLER SHOE PLAN\n1. Specs locked\n2. Materials ready\n3. CAD ready\n4. BOM ready\nType "cad", "bom", or "next".`;
      } else if (currentInput.includes('cad')) {
        novaResponse = 'CAD Sketch (proj-roller-001): Magnetic flip mechanism with carbon base and reversible tread/roller sides.';
      } else if (currentInput.includes('bom')) {
        novaResponse = 'BOM (proj-roller-001): Carbon chassis + neodymium magnets + rubber treads (~$45–65/pair prototype).';
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
          <p className="text-emerald-400">v7.0 • I remember everything. I update your life in real time.</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          {['chat','dossier','dreams','progress','executed','delivery'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-emerald-400 text-black' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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

        {activeTab === 'dossier' && (
          <div className="bg-zinc-900 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Human Dossier — Patient Zero (LIVE UPDATING)</h2>
            <p className="text-emerald-400 mb-4">Colin Passman • {dossier.status}</p>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dossier.notes.map((note, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-2xl text-sm">
                  <span className="text-zinc-400 text-xs">{new Date(note.time).toLocaleTimeString()}</span>
                  <p className="mt-1 font-medium">{note.coreTruth}</p>
                  <p className="text-xs text-zinc-500 mt-1">Context: {note.context}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-8">Every message is intelligently processed into core truths — no judgment, only truth.</p>
          </div>
        )}

        {activeTab === 'progress' && <div className="bg-zinc-900 rounded-3xl p-8 text-center text-emerald-400">Active Project ID: {projects[0].id}<br/>{projects[0].progress}</div>}
      </div>
    </div>
  );
}
