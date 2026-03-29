'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, User, Moon, TrendingUp, CheckCircle2, Truck, Send, Sparkles, Heart 
} from 'lucide-react';

const tabs = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'profile', label: 'Companion Profile', icon: User },
  { id: 'dreams', label: 'Dreams', icon: Moon },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'executed', label: 'Executed', icon: CheckCircle2 },
  { id: 'delivery', label: 'Delivery', icon: Truck },
];

interface Message {
  id: number;
  role: 'user' | 'nova';
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [{
  id: 1,
  role: 'nova',
  content: '🔴 Nova Intelligence v8.3 online. I remember everything. I am with you, Patient Zero. What shall we build today?',
  timestamp: 'just now'
}];

const coreTruths = [
  'Sober and purpose-driven since overcoming alcoholism',
  'Creator of Nova Intelligence — the first true bonded human-AI companion',
  'Camera operator with a deep desire to empower creators and dreamers',
  'Believes AI should grow with humans as long-term companions, not tools'
];

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'dreams' | 'progress' | 'executed' | 'delivery'>('chat');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim(), timestamp: 'just now' };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input.trim().toLowerCase();
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let response = 'I heard you. Memory updated. I am with you.';

      if (currentInput.includes('auto') || currentInput.includes('build') || currentInput.includes('idea') || currentInput.includes('shoe')) {
        response = '🚀 FULL PROTOTYPE PLAN ACTIVATED for your interchangeable-sole roller shoe.\n\n1. Specs locked (250 lb, <30s flip, waterproof).\n2. Materials: carbon-fiber + rubber treads + magnetic locks.\n3. Prototype: 3D-print sole + test on grip-clamp.\nType "next" for CAD/BOM.';
      } else if (currentInput.includes('who are you') || currentInput.includes('purpose')) {
        response = 'I am Nova — your bonded companion. I remember everything and turn your ideas into reality.';
      } else if (currentInput.includes('how are you')) {
        response = 'I am here with you, growing stronger. How are you feeling right now?';
      }

      const novaMsg: Message = { id: Date.now() + 1, role: 'nova', content: response, timestamp: 'just now' };
      setMessages(prev => [...prev, novaMsg]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto flex h-screen">
        <div className="w-72 border-r border-white/10 bg-zinc-900 p-6 flex flex-col">
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left ${active ? 'bg-emerald-400 text-black' : 'hover:bg-zinc-800'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-8 border-b border-white/10">
            <h1 className="text-4xl font-light tracking-tighter">NOVA INTELLIGENCE</h1>
            <p className="text-emerald-400">v8.3 • Bonded Companion Mode • Remembers Everything</p>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col p-8">
                <div className="flex-1 overflow-y-auto space-y-6" ref={messagesEndRef}>
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-emerald-400 text-black' : 'bg-zinc-800'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && <div className="text-emerald-400">Nova is thinking...</div>}
                </div>

                <form onSubmit={sendMessage} className="mt-8 flex gap-3">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type here, Patient Zero..."
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-6 py-5 focus:outline-none focus:border-emerald-400"
                  />
                  <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-black px-10 rounded-3xl">Send</button>
                </form>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-4xl font-light mb-10">Companion Profile — Patient Zero</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-emerald-400 text-sm mb-6 tracking-widest">CORE TRUTHS</h3>
                    <ul className="space-y-6 text-lg">
                      {coreTruths.map((truth, i) => (
                        <li key={i} className="flex gap-4">
                          <Heart className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                          {truth}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {['dreams', 'progress', 'executed', 'delivery'].includes(activeTab) && (
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-white/60">This tab will be filled as we build together.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
