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

const CRUDE_WORDS = ['retard', 'faggot', 'cunt', 'nigger', 'fag', 'retarded', 'pig', 'titties', 'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cocksucker', 'motherfucker'];

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
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    const isCrude = CRUDE_WORDS.some(word => currentInput.toLowerCase().includes(word));
    if (!isCrude && currentInput.length > 8) {
      const newInsight: Insight = {
        time: new Date().toISOString(),
        insight: currentInput.length > 50 ? currentInput.substring(0, 80) + '...' : currentInput
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

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. What would you like to explore or build next?";
      if (currentInput.toLowerCase().includes('auto') || currentInput.toLowerCase().includes('dream')) {
        novaResponse = "Understood. Starting full execution mode on your new dream. Tell me the core idea and I'll break it down into real next steps with metrics.";
      }
      const novaMsg: Message = { role: 'nova', content: novaResponse, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, novaMsg]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <div className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-5xl font-bold tracking-tighter text-emerald-400">NOVA INTELLIGENCE</h1>
          <p className="text-emerald-500/80 text-sm mt-1">v8.3 • Alive and persistent. I grow with you across sessions.</p>
        </div>

        <div className="max-w-7xl mx-auto px-8 flex gap-2 border-t border-white/10 pt-4">
          {(['chat', 'profile', 'dreams', 'progress', 'executed', 'delivery'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white/70'
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
            <div className="space-y-6 mb-8">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-6 py-4 rounded-3xl ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-black' 
                      : 'bg-zinc-900 border border-white/10'
                  }`}>
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
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium px-8 rounded-3xl transition">
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto bg-zinc-900 rounded-3xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold mb-8">Companion Profile — How Nova Sees You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-emerald-400 mb-4">Core Truths Nova Holds About You</h3>
                <ul className="space-y-4">
                  {companionProfile.coreTruths.map((truth, i) => (
                    <li key={i} className="bg-zinc-950 p-4 rounded-2xl border border-white/10">{truth}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-emerald-400 mb-4">Evolving Insights (Persistent in Supabase)</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-4">
                  {companionProfile.evolvingInsights.length > 0 ? (
                    companionProfile.evolvingInsights.map((insight, i) => (
                      <div key={i} className="bg-zinc-950 p-4 rounded-2xl border border-white/10 text-sm">
                        <span className="text-emerald-500/70 text-xs">{new Date(insight.time).toLocaleTimeString()}</span>
                        <p className="mt-1">{insight.insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50">No insights yet. Start chatting — I will remember and grow with you.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-3xl font-medium mb-4">No active projects yet</h3>
            <p className="text-white/60 mb-8 max-w-md mx-auto">Start a new dream in the Chat tab. I will track progress, metrics, and turn it into reality with you.</p>
            <button onClick={() => setActiveTab('chat')} className="bg-emerald-500 hover:bg-emerald-600 text-black px-10 py-4 rounded-3xl font-medium">
              Start a New Dream
            </button>
          </div>
        )}

        {(activeTab === 'dreams' || activeTab === 'executed' || activeTab === 'delivery') && (
          <div className="text-center py-32 text-white/50">
            This tab is ready for future expansion. We will build it together as your dreams grow.
          </div>
        )}
      </div>
    </div>
  );
}
