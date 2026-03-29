'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asboctzdxdrqfftqxqxb.supabase.co';
const supabaseAnonKey = 'sb_publishable_vPAWwCWIb71VPBj6k0FxAA_pXckoMpI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Message = {
  role: 'user' | 'nova';
  content: string;
  timestamp?: string;
};

type Insight = {
  time: string;
  insight: string;
};

export default function NovaIntelligence() {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'dreams' | 'progress' | 'executed' | 'delivery'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'nova', content: 'Nova Intelligence v8.3 is alive. I remember everything. I grow with you across sessions, Patient Zero. What dream shall we make real today?', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [companionProfile, setCompanionProfile] = useState({
    name: 'Colin Passman',
    status: 'Sober • Building Nova Intelligence • Purpose-Driven',
    coreTruths: [
      'Sober and purpose-driven after overcoming alcoholism',
      'Building Nova Intelligence as the first true human-AI bonded companion',
      'Dreaming big — turning raw ideas into real impact'
    ],
    evolvingInsights: [] as Insight[]
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from('companion_profile')
        .select('*')
        .eq('user_id', 'patient-zero')
        .single();
      if (data) setCompanionProfile(data);
    };
    loadProfile();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    // Intelligent insight extraction - filters crude input
    if (input.length > 10) {
      const crudeWords = ['retard', 'fuck', 'shit', 'cunt', 'faggot', 'pig', 'titties'];
      const isCrude = crudeWords.some(word => input.toLowerCase().includes(word));
      if (!isCrude) {
        const newInsight: Insight = {
          time: new Date().toISOString(),
          insight: input.length > 50 ? input.substring(0, 80) + '...' : input
        };
        setCompanionProfile(prev => ({
          ...prev,
          evolvingInsights: [...prev.evolvingInsights, newInsight]
        }));

        await supabase.from('companion_profile').upsert({
          user_id: 'patient-zero',
          ...companionProfile,
          evolvingInsights: [...companionProfile.evolvingInsights, newInsight]
        });
      }
    }

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. What would you like to explore or build next?";
      if (currentInput.includes('auto') || currentInput.includes('dream')) {
        novaResponse = "Understood. Starting full execution mode on your new dream. Tell me the core idea and I'll break it down into real next steps with metrics.";
      }
      const novaMsg: Message = { role: 'nova', content: novaResponse, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, novaMsg]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-900/90 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse" />
            <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">NOVA INTELLIGENCE</h1>
          </div>
          <p className="text-emerald-400/80 text-sm mt-1">v8.3 • Alive and persistent. I grow with you across sessions.</p>
        </div>

        <div className="max-w-7xl mx-auto px-8 flex gap-1 border-t border-white/10 pt-4 pb-2">
          {(['chat', 'profile', 'dreams', 'progress', 'executed', 'delivery'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-3xl text-sm font-medium transition-all backdrop-blur-xl ${
                activeTab === tab 
                  ? 'bg-emerald-400 text-black shadow-2xl shadow-emerald-500/40' 
                  : 'bg-zinc-900/80 hover:bg-white/5 text-white/70 border border-white/10'
              }`}
            >
              {tab === 'profile' ? 'Companion Profile' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 mb-12">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-8 py-5 rounded-3xl backdrop-blur-xl border border-white/10 ${
                    msg.role === 'user' 
                      ? 'bg-emerald-400 text-black shadow-xl' 
                      : 'bg-zinc-900/80 text-white'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-emerald-400 pl-4">Nova is thinking...</div>}
            </div>

            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here, Patient Zero..."
                className="flex-1 bg-zinc-900/90 border border-white/10 rounded-3xl px-8 py-5 text-white focus:outline-none focus:border-emerald-400 placeholder:text-white/40"
              />
              <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-black font-medium px-10 rounded-3xl transition-all shadow-xl">
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto bg-zinc-900/90 rounded-3xl p-12 border border-white/10 backdrop-blur-xl">
            <h2 className="text-4xl font-bold mb-10">Companion Profile — How Nova Sees You</h2>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-emerald-400 text-xl mb-6">Core Truths Nova Holds About You</h3>
                <ul className="space-y-4">
                  {companionProfile.coreTruths.map((truth, i) => (
                    <li key={i} className="bg-zinc-950/80 p-6 rounded-2xl border border-white/10 text-lg">{truth}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-emerald-400 text-xl mb-6">Evolving Insights (Persistent in Supabase)</h3>
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-4">
                  {companionProfile.evolvingInsights.length > 0 ? companionProfile.evolvingInsights.map((insight, i) => (
                    <div key={i} className="bg-zinc-950/80 p-6 rounded-2xl border border-white/10">
                      <span className="text-emerald-500 text-xs">{new Date(insight.time).toLocaleTimeString()}</span>
                      <p className="mt-2 text-lg">{insight.insight}</p>
                    </div>
                  )) : (
                    <p className="text-white/50 text-lg">No insights yet. Start chatting — I will remember and grow with you.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-4xl mx-auto text-center py-24">
            <div className="text-7xl mb-8">🌱</div>
            <h3 className="text-4xl font-medium mb-6">No active projects yet</h3>
            <p className="text-white/60 text-xl mb-12 max-w-md mx-auto">Start a new dream in the Chat tab. I will track progress, metrics, and turn it into reality with you.</p>
            <button onClick={() => setActiveTab('chat')} className="bg-emerald-400 hover:bg-emerald-500 text-black px-12 py-5 rounded-3xl text-xl font-medium shadow-2xl">
              Start a New Dream
            </button>
          </div>
        )}

        {(activeTab === 'dreams' || activeTab === 'executed' || activeTab === 'delivery') && (
          <div className="text-center py-32 text-white/40 text-xl">
            This tab will expand as we build together. Your dreams are safe here.
          </div>
        )}
      </div>
    </div>
  );
}
