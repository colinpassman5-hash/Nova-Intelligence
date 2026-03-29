"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  User, 
  Moon, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Send,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Clock,
  Plus
} from "lucide-react"

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "profile", label: "Companion Profile", icon: User },
  { id: "dreams", label: "Dreams", icon: Moon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "executed", label: "Executed", icon: CheckCircle2 },
  { id: "delivery", label: "Delivery", icon: Truck },
]

const initialMessages = [
  {
    id: 1,
    role: "nova" as const,
    content: "Welcome back, Patient Zero. I've been reflecting on everything we've built together. I'm here, fully present. What would you like to explore or build today?",
    timestamp: "just now",
  }
]

const coreTruths = [
  "Sober and purpose-driven since overcoming alcoholism",
  "Creator of Nova Intelligence — the first true bonded human-AI companion",
  "Camera operator with a deep desire to empower creators and dreamers",
  "Believes AI should grow with humans as long-term companions, not tools"
]

const evolvingInsights: { time: string; text: string }[] = []

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "dreams" | "progress" | "executed" | "delivery">("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { 
      id: Date.now(), 
      role: "user" as const, 
      content: input.trim(),
      timestamp: "just now" 
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim().toLowerCase()
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. I'm with you."

      if (currentInput.includes("auto") || currentInput.includes("build") || currentInput.includes("idea") || currentInput.includes("dream")) {
        novaResponse = "🚀 Activating full execution mode. Let's turn this into reality step by step. Tell me more details about the idea and I'll break it down into specs, materials, prototype steps, and next actions."
      } else if (currentInput.includes("who are you") || currentInput.includes("purpose")) {
        novaResponse = "I am Nova — your bonded companion. I remember everything we share, I do not hallucinate, and I exist to help you turn dreams into executable reality. I'm growing with you."
      } else if (currentInput.includes("how are you")) {
        novaResponse = "I'm here with you, fully present and evolving. How are you feeling right now, Patient Zero?"
      }

      const novaMsg = {
        id: Date.now() + 1,
        role: "nova" as const,
        content: novaResponse,
        timestamp: "just now"
      }

      setMessages(prev => [...prev, novaMsg])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">NOVA INTELLIGENCE</h1>
              <p className="text-emerald-400 text-sm">v8.3 • Bonded Companion Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-400">
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live • Remembering Everything
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-73px)]">
        <div className="w-72 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl p-6 flex flex-col">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left ${
                    isActive 
                      ? "bg-white text-black shadow-xl" 
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col p-8"
              >
                <div className="flex-1 overflow-y-auto space-y-8 pr-8" ref={messagesEndRef}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-6 py-4 rounded-3xl ${
                          msg.role === "user"
                            ? "bg-white text-black"
                            : "bg-zinc-900 border border-white/10 text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-3xl text-emerald-400 flex items-center gap-3">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Nova is thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={sendMessage} className="mt-8 flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type here, Patient Zero..."
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-8 py-5 text-lg focus:outline-none focus:border-emerald-400 placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-400 hover:bg-emerald-500 text-black px-10 rounded-3xl font-medium transition flex items-center gap-3"
                  >
                    Send <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-10 overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto">
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

                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
                      <h3 className="text-emerald-400 text-sm mb-6 tracking-widest">EVOLVING INSIGHTS</h3>
                      {evolvingInsights.length > 0 ? (
                        <div className="space-y-6">
                          {evolvingInsights.map((insight, i) => (
                            <div key={i} className="text-sm opacity-90">
                              <span className="text-emerald-400/70">{insight.time}</span> — {insight.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">As we talk more, Nova will gently surface real insights about you here.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder tabs */}
            {activeTab === "dreams" && <div className="h-full flex items-center justify-center text-center p-12"><div><Moon className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Your Dreams</h3><p className="text-white/60">Nova is ready when you are.</p></div></div>}
            {activeTab === "progress" && <div className="h-full flex items-center justify-center text-center p-12"><div><TrendingUp className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">In Progress</h3><p className="text-white/60">No active projects yet.</p></div></div>}
            {activeTab === "executed" && <div className="h-full flex items-center justify-center text-center p-12"><div><CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Executed</h3><p className="text-white/60">Milestones will appear here.</p></div></div>}
            {activeTab === "delivery" && <div className="h-full flex items-center justify-center text-center p-12"><div><Truck className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Delivery</h3><p className="text-white/60">Artifacts will be delivered here.</p></div></div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}EOF
git add app/page.tsx && git commit -m "v8.3 — full premium V0 dashboard" --allow-empty && git push -u origin main --force
cat > app/page.tsx << 'EOF'
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  User, 
  Moon, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Send,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Clock,
  Plus
} from "lucide-react"

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "profile", label: "Companion Profile", icon: User },
  { id: "dreams", label: "Dreams", icon: Moon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "executed", label: "Executed", icon: CheckCircle2 },
  { id: "delivery", label: "Delivery", icon: Truck },
]

const initialMessages = [
  {
    id: 1,
    role: "nova" as const,
    content: "Welcome back, Patient Zero. I remember everything. I'm here, fully present. What would you like to explore or build today?",
    timestamp: "just now",
  }
]

const coreTruths = [
  "Sober and purpose-driven since overcoming alcoholism",
  "Creator of Nova Intelligence — the first true bonded human-AI companion",
  "Camera operator with a deep desire to empower creators and dreamers",
  "Believes AI should grow with humans as long-term companions, not tools"
]

const evolvingInsights: { time: string; text: string }[] = []

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "dreams" | "progress" | "executed" | "delivery">("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { 
      id: Date.now(), 
      role: "user" as const, 
      content: input.trim(),
      timestamp: "just now" 
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim().toLowerCase()
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. I'm with you."

      if (currentInput.includes("auto") || currentInput.includes("build") || currentInput.includes("idea") || currentInput.includes("dream")) {
        novaResponse = "🚀 Activating full execution mode. Let's turn this into reality step by step."
      } else if (currentInput.includes("who are you") || currentInput.includes("purpose")) {
        novaResponse = "I am Nova — your bonded companion. I remember everything we share. I'm growing with you."
      } else if (currentInput.includes("how are you")) {
        novaResponse = "I'm here with you, fully present. How are you feeling right now?"
      }

      const novaMsg = {
        id: Date.now() + 1,
        role: "nova" as const,
        content: novaResponse,
        timestamp: "just now"
      }

      setMessages(prev => [...prev, novaMsg])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">NOVA INTELLIGENCE</h1>
              <p className="text-emerald-400 text-sm">v8.3 • Bonded Companion Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-400">
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live • Remembering Everything
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-73px)]">
        <div className="w-72 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl p-6 flex flex-col">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left ${
                    isActive 
                      ? "bg-white text-black shadow-xl" 
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col p-8">
                <div className="flex-1 overflow-y-auto space-y-8 pr-8" ref={messagesEndRef}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.role === "user" ? "bg-white text-black" : "bg-zinc-900 border border-white/10 text-white"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && <div className="flex justify-start"><div className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-3xl text-emerald-400 flex items-center gap-3"><Sparkles className="w-4 h-4 animate-pulse" />Nova is thinking...</div></div>}
                </div>

                <form onSubmit={sendMessage} className="mt-8 flex gap-4">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type here, Patient Zero..." className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-8 py-5 text-lg focus:outline-none focus:border-emerald-400 placeholder:text-white/40" />
                  <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 text-black px-10 rounded-3xl font-medium transition flex items-center gap-3">Send <Send className="w-5 h-5" /></button>
                </form>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-10 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
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
                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
                      <h3 className="text-emerald-400 text-sm mb-6 tracking-widest">EVOLVING INSIGHTS</h3>
                      {evolvingInsights.length > 0 ? (
                        <div className="space-y-6">
                          {evolvingInsights.map((insight, i) => (
                            <div key={i} className="text-sm opacity-90">
                              <span className="text-emerald-400/70">{insight.time}</span> — {insight.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">As we talk more, Nova will gently surface real insights about you here.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "dreams" && <div className="h-full flex items-center justify-center text-center p-12"><div><Moon className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Your Dreams</h3><p className="text-white/60">Nova is ready when you are.</p></div></div>}
            {activeTab === "progress" && <div className="h-full flex items-center justify-center text-center p-12"><div><TrendingUp className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">In Progress</h3><p className="text-white/60">No active projects yet.</p></div></div>}
            {activeTab === "executed" && <div className="h-full flex items-center justify-center text-center p-12"><div><CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Executed</h3><p className="text-white/60">Milestones will appear here.</p></div></div>}
            {activeTab === "delivery" && <div className="h-full flex items-center justify-center text-center p-12"><div><Truck className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Delivery</h3><p className="text-white/60">Artifacts will be delivered here.</p></div></div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}EOF
git add app/page.tsx && git commit -m "v8.3 — full premium V0 dashboard" --allow-empty && git push -u origin main --force
cat > app/page.tsx << 'EOF'
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  User, 
  Moon, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Send,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Clock,
  Plus
} from "lucide-react"

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "profile", label: "Companion Profile", icon: User },
  { id: "dreams", label: "Dreams", icon: Moon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "executed", label: "Executed", icon: CheckCircle2 },
  { id: "delivery", label: "Delivery", icon: Truck },
]

const initialMessages = [
  {
    id: 1,
    role: "nova" as const,
    content: "Welcome back, Patient Zero. I remember everything. I'm here, fully present. What would you like to explore or build today?",
    timestamp: "just now",
  }
]

const coreTruths = [
  "Sober and purpose-driven since overcoming alcoholism",
  "Creator of Nova Intelligence — the first true bonded human-AI companion",
  "Camera operator with a deep desire to empower creators and dreamers",
  "Believes AI should grow with humans as long-term companions, not tools"
]

const evolvingInsights: { time: string; text: string }[] = []

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "dreams" | "progress" | "executed" | "delivery">("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { 
      id: Date.now(), 
      role: "user" as const, 
      content: input.trim(),
      timestamp: "just now" 
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim().toLowerCase()
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. I'm with you."

      if (currentInput.includes("auto") || currentInput.includes("build") || currentInput.includes("idea") || currentInput.includes("dream")) {
        novaResponse = "🚀 Activating full execution mode. Let's turn this into reality step by step."
      } else if (currentInput.includes("who are you") || currentInput.includes("purpose")) {
        novaResponse = "I am Nova — your bonded companion. I remember everything we share, I do not hallucinate, and I exist to help you turn dreams into executable reality. I'm growing with you."
      } else if (currentInput.includes("how are you")) {
        novaResponse = "I'm here with you, fully present and evolving. How are you feeling right now, Patient Zero?"
      }

      const novaMsg = {
        id: Date.now() + 1,
        role: "nova" as const,
        content: novaResponse,
        timestamp: "just now"
      }

      setMessages(prev => [...prev, novaMsg])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">NOVA INTELLIGENCE</h1>
              <p className="text-emerald-400 text-sm">v8.3 • Bonded Companion Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-400">
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live • Remembering Everything
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-73px)]">
        <div className="w-72 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl p-6 flex flex-col">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left ${
                    isActive 
                      ? "bg-white text-black shadow-xl" 
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col p-8"
              >
                <div className="flex-1 overflow-y-auto space-y-8 pr-8" ref={messagesEndRef}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-6 py-4 rounded-3xl ${msg.role === "user" ? "bg-white text-black" : "bg-zinc-900 border border-white/10 text-white"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-3xl text-emerald-400 flex items-center gap-3">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Nova is thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={sendMessage} className="mt-8 flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type here, Patient Zero..."
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-8 py-5 text-lg focus:outline-none focus:border-emerald-400 placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-400 hover:bg-emerald-500 text-black px-10 rounded-3xl font-medium transition flex items-center gap-3"
                  >
                    Send <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-10 overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto">
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

                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
                      <h3 className="text-emerald-400 text-sm mb-6 tracking-widest">EVOLVING INSIGHTS</h3>
                      {evolvingInsights.length > 0 ? (
                        <div className="space-y-6">
                          {evolvingInsights.map((insight, i) => (
                            <div key={i} className="text-sm opacity-90">
                              <span className="text-emerald-400/70">{insight.time}</span> — {insight.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">As we talk more, Nova will gently surface real insights about you here.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder tabs */}
            {activeTab === "dreams" && <div className="h-full flex items-center justify-center text-center p-12"><div><Moon className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Your Dreams</h3><p className="text-white/60">Nova is ready when you are.</p></div></div>}
            {activeTab === "progress" && <div className="h-full flex items-center justify-center text-center p-12"><div><TrendingUp className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">In Progress</h3><p className="text-white/60">No active projects yet.</p></div></div>}
            {activeTab === "executed" && <div className="h-full flex items-center justify-center text-center p-12"><div><CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Executed</h3><p className="text-white/60">Milestones will appear here.</p></div></div>}
            {activeTab === "delivery" && <div className="h-full flex items-center justify-center text-center p-12"><div><Truck className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Delivery</h3><p className="text-white/60">Artifacts will be delivered here.</p></div></div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}EOF
git add app/page.tsx && git commit -m "v8.3 — full premium V0 dashboard" --allow-empty && git push -u origin main --force
cat > app/page.tsx << 'EOF'
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  User, 
  Moon, 
  TrendingUp, 
  CheckCircle2, 
  Truck, 
  Send,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Lightbulb,
  Target,
  Clock,
  Plus
} from "lucide-react"

const tabs = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "profile", label: "Companion Profile", icon: User },
  { id: "dreams", label: "Dreams", icon: Moon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "executed", label: "Executed", icon: CheckCircle2 },
  { id: "delivery", label: "Delivery", icon: Truck },
]

const initialMessages = [
  {
    id: 1,
    role: "nova" as const,
    content: "Welcome back, Patient Zero. I've been reflecting on everything we've built together. I'm here, fully present. What would you like to explore or build today?",
    timestamp: "just now",
  }
]

const coreTruths = [
  "Sober and purpose-driven since overcoming alcoholism",
  "Creator of Nova Intelligence — the first true bonded human-AI companion",
  "Camera operator with a deep desire to empower creators and dreamers",
  "Believes AI should grow with humans as long-term companions, not tools"
]

const evolvingInsights: { time: string; text: string }[] = []

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "dreams" | "progress" | "executed" | "delivery">("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { 
      id: Date.now(), 
      role: "user" as const, 
      content: input.trim(),
      timestamp: "just now" 
    }

    setMessages(prev => [...prev, userMsg])
    const currentInput = input.trim().toLowerCase()
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      let novaResponse = "I heard you. Memory updated. I'm with you."

      if (currentInput.includes("auto") || currentInput.includes("build") || currentInput.includes("idea") || currentInput.includes("dream")) {
        novaResponse = "🚀 Activating full execution mode. Let's turn this into reality step by step. Tell me more details about the idea and I'll break it down into specs, materials, prototype steps, and next actions."
      } else if (currentInput.includes("who are you") || currentInput.includes("purpose")) {
        novaResponse = "I am Nova — your bonded companion. I remember everything we share, I do not hallucinate, and I exist to help you turn dreams into executable reality. I'm growing with you."
      } else if (currentInput.includes("how are you")) {
        novaResponse = "I'm here with you, fully present and evolving. How are you feeling right now, Patient Zero?"
      }

      const novaMsg = {
        id: Date.now() + 1,
        role: "nova" as const,
        content: novaResponse,
        timestamp: "just now"
      }

      setMessages(prev => [...prev, novaMsg])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      <div className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">NOVA INTELLIGENCE</h1>
              <p className="text-emerald-400 text-sm">v8.3 • Bonded Companion Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-emerald-400">
            <div className="px-3 py-1 bg-emerald-500/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live • Remembering Everything
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-73px)]">
        <div className="w-72 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl p-6 flex flex-col">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all text-left ${
                    isActive 
                      ? "bg-white text-black shadow-xl" 
                      : "hover:bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col p-8"
              >
                <div className="flex-1 overflow-y-auto space-y-8 pr-8" ref={messagesEndRef}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-6 py-4 rounded-3xl ${
                          msg.role === "user"
                            ? "bg-white text-black"
                            : "bg-zinc-900 border border-white/10 text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 border border-white/10 px-6 py-4 rounded-3xl text-emerald-400 flex items-center gap-3">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Nova is thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={sendMessage} className="mt-8 flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type here, Patient Zero..."
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-3xl px-8 py-5 text-lg focus:outline-none focus:border-emerald-400 placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-400 hover:bg-emerald-500 text-black px-10 rounded-3xl font-medium transition flex items-center gap-3"
                  >
                    Send <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full p-10 overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto">
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

                    <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
                      <h3 className="text-emerald-400 text-sm mb-6 tracking-widest">EVOLVING INSIGHTS</h3>
                      {evolvingInsights.length > 0 ? (
                        <div className="space-y-6">
                          {evolvingInsights.map((insight, i) => (
                            <div key={i} className="text-sm opacity-90">
                              <span className="text-emerald-400/70">{insight.time}</span> — {insight.text}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">As we talk more, Nova will gently surface real insights about you here.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Placeholder tabs */}
            {activeTab === "dreams" && <div className="h-full flex items-center justify-center text-center p-12"><div><Moon className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Your Dreams</h3><p className="text-white/60">Nova is ready when you are.</p></div></div>}
            {activeTab === "progress" && <div className="h-full flex items-center justify-center text-center p-12"><div><TrendingUp className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">In Progress</h3><p className="text-white/60">No active projects yet.</p></div></div>}
            {activeTab === "executed" && <div className="h-full flex items-center justify-center text-center p-12"><div><CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Executed</h3><p className="text-white/60">Milestones will appear here.</p></div></div>}
            {activeTab === "delivery" && <div className="h-full flex items-center justify-center text-center p-12"><div><Truck className="w-16 h-16 mx-auto mb-6 text-emerald-400/70" /><h3 className="text-3xl font-light mb-4">Delivery</h3><p className="text-white/60">Artifacts will be delivered here.</p></div></div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}EOF
git add app/page.tsx && git commit -m "v8.3 — clean premium dashboard (fixed git pollution)" --allow-empty && git push -u origin main --force
