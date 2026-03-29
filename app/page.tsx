"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Send, Heart, Lightbulb, Target, Zap, Star,
  Brain, Moon, Rocket, CheckCircle2,
  MessageCircle, User, TrendingUp, Package, LogOut,
  Loader2, Cpu, ToggleLeft, ToggleRight, FileText, Plus
} from "lucide-react"

const TABS = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "profile", label: "Companion Profile", icon: User },
  { id: "dreams", label: "Dreams", icon: Moon },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "executed", label: "Executed", icon: CheckCircle2 },
  { id: "delivery", label: "Delivery", icon: Package },
] as const

type TabId = (typeof TABS)[number]["id"]

interface Message {
  id: string
  role: "user" | "nova"
  content: string
  created_at: string
}

interface CoreTruth {
  id: string
  icon: string
  label: string
  detail: string
}

interface EvolvingInsight {
  id: string
  insight: string
  source: string
  created_at: string
}

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "paused"
  milestones: string[]
  created_at: string
}

interface StoredDocument {
  id: string
  name: string
  content: string
  type: "txt" | "json" | "md"
  created_at: string
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, Lightbulb, Target, Zap, Star, Brain, Rocket
}

const DEFAULT_CORE_TRUTHS: CoreTruth[] = [
  { id: "1", icon: "Heart", label: "Builder at Heart", detail: "Creates with passion and precision" },
  { id: "2", icon: "Lightbulb", label: "Visionary Thinker", detail: "Sees possibilities others miss" },
  { id: "3", icon: "Target", label: "Goal-Oriented", detail: "Relentlessly pursues excellence" },
  { id: "4", icon: "Zap", label: "Fast Learner", detail: "Absorbs and applies knowledge rapidly" },
]

function extractInsight(message: string): string | null {
  const patterns = [
    /i (?:want|need|think|believe|feel|know|realize|understand|see|notice)\s+(.{20,80})/i,
    /my (?:goal|dream|plan|idea|vision|project|focus)\s+(?:is|involves|includes)\s+(.{15,80})/i,
    /i'm (?:working on|building|creating|developing|pursuing|focused on)\s+(.{15,80})/i,
    /(?:struggling|excited|passionate|curious) about\s+(.{15,80})/i,
  ]
  
  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) return match[1].trim()
  }
  return null
}

function detectProjectLaunch(message: string): { name: string; description: string } | null {
  const launchPatterns = [
    /launch[!:]?\s*["']?([^"'\n]+)["']?/i,
    /start project[:\s]+["']?([^"'\n]+)["']?/i,
    /create project[:\s]+["']?([^"'\n]+)["']?/i,
    /begin[:\s]+["']?([^"'\n]+)["']?/i,
  ]
  
  for (const pattern of launchPatterns) {
    const match = message.match(pattern)
    if (match) {
      return {
        name: match[1].trim().slice(0, 50),
        description: `Project initiated from chat: "${message.slice(0, 100)}..."`
      }
    }
  }
  return null
}

function detectDocumentRequest(message: string): { name: string; content: string; type: "txt" | "json" | "md" } | null {
  const docPatterns = [
    /(?:save|store|create|write)\s+(?:document|file|note)[:\s]+["']?([^"'\n]+)["']?/i,
    /(?:remember|log|record)[:\s]+["']?([^"'\n]+)["']?/i,
  ]
  
  for (const pattern of docPatterns) {
    const match = message.match(pattern)
    if (match) {
      return {
        name: `note_${Date.now()}`,
        content: match[1].trim(),
        type: "txt"
      }
    }
  }
  return null
}

function updateProfileFromMessage(message: string, currentTruths: CoreTruth[]): CoreTruth[] {
  const truthPatterns: { pattern: RegExp; icon: string; label: string }[] = [
    { pattern: /build|create|make|develop/i, icon: "Rocket", label: "Builder" },
    { pattern: /learn|study|understand|know/i, icon: "Brain", label: "Knowledge Seeker" },
    { pattern: /lead|manage|direct|guide/i, icon: "Target", label: "Leader" },
    { pattern: /help|support|assist|care/i, icon: "Heart", label: "Caregiver" },
    { pattern: /innovate|invent|disrupt|transform/i, icon: "Lightbulb", label: "Innovator" },
    { pattern: /fast|quick|efficient|optimize/i, icon: "Zap", label: "Optimizer" },
  ]
  
  for (const { pattern, icon, label } of truthPatterns) {
    if (pattern.test(message)) {
      const existing = currentTruths.find(t => t.label === label)
      if (!existing && currentTruths.length < 8) {
        return [...currentTruths, {
          id: crypto.randomUUID(),
          icon,
          label,
          detail: `Detected from: "${message.slice(0, 40)}..."`
        }]
      }
    }
  }
  return currentTruths
}

export default function NovaDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("chat")
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [coreTruths, setCoreTruths] = useState<CoreTruth[]>(DEFAULT_CORE_TRUTHS)
  const [evolvingInsights, setEvolvingInsights] = useState<EvolvingInsight[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isGrokEnabled, setIsGrokEnabled] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userName = "Patient Zero"

  useEffect(() => {
    const savedMessages = localStorage.getItem("nova_messages")
    const savedInsights = localStorage.getItem("nova_insights")
    const savedTruths = localStorage.getItem("nova_truths")
    const savedProjects = localStorage.getItem("nova_projects")
    const savedDocs = localStorage.getItem("nova_documents")
    
    if (savedMessages) setMessages(JSON.parse(savedMessages))
    if (savedInsights) setEvolvingInsights(JSON.parse(savedInsights))
    if (savedTruths) setCoreTruths(JSON.parse(savedTruths))
    if (savedProjects) setProjects(JSON.parse(savedProjects))
    if (savedDocs) setDocuments(JSON.parse(savedDocs))
    
    if (!savedMessages) {
      const welcomeMsg: Message = {
        id: crypto.randomUUID(),
        role: "nova",
        content: `${userName}. I'm Nova — running on Grok. I remember everything. I don't do small talk. Tell me what you're building, what's blocking you, or what truth you're avoiding. Let's get real.`,
        created_at: new Date().toISOString()
      }
      setMessages([welcomeMsg])
      localStorage.setItem("nova_messages", JSON.stringify([welcomeMsg]))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem("nova_messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem("nova_insights", JSON.stringify(evolvingInsights))
  }, [evolvingInsights])

  useEffect(() => {
    localStorage.setItem("nova_truths", JSON.stringify(coreTruths))
  }, [coreTruths])

  useEffect(() => {
    localStorage.setItem("nova_projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem("nova_documents", JSON.stringify(documents))
  }, [documents])

  async function handleSendMessage() {
    if (!inputValue.trim() || isSending) return
    
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
      created_at: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMsg])
    const currentInput = inputValue
    setInputValue("")
    setIsSending(true)
    setStreamingContent("")

    // Auto-trigger: Profile Update
    const updatedTruths = updateProfileFromMessage(currentInput, coreTruths)
    if (updatedTruths.length !== coreTruths.length) {
      setCoreTruths(updatedTruths)
    }

    // Auto-trigger: Insight Extraction
    const insight = extractInsight(currentInput)
    if (insight) {
      const newInsight: EvolvingInsight = {
        id: crypto.randomUUID(),
        insight,
        source: currentInput.slice(0, 50),
        created_at: new Date().toISOString()
      }
      setEvolvingInsights(prev => [newInsight, ...prev].slice(0, 50))
    }

    // Auto-trigger: Project Launch Detection
    const projectLaunch = detectProjectLaunch(currentInput)
    if (projectLaunch) {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: projectLaunch.name,
        description: projectLaunch.description,
        status: "active",
        milestones: [],
        created_at: new Date().toISOString()
      }
      setProjects(prev => [newProject, ...prev])
    }

    // Auto-trigger: Document Storage
    const docRequest = detectDocumentRequest(currentInput)
    if (docRequest) {
      const newDoc: StoredDocument = {
        id: crypto.randomUUID(),
        ...docRequest,
        created_at: new Date().toISOString()
      }
      setDocuments(prev => [newDoc, ...prev])
    }

    if (isGrokEnabled) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map(m => ({
              role: m.role === "nova" ? "assistant" : "user",
              content: m.content
            })),
            userName,
            context: {
              coreTruths: coreTruths.map(t => t.label),
              recentInsights: evolvingInsights.slice(0, 5).map(i => i.insight),
              activeProjects: projects.filter(p => p.status === "active").map(p => p.name)
            }
          })
        })

        if (!response.ok) throw new Error("API error")
        if (!response.body) throw new Error("No response body")

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith("0:")) {
              try {
                const text = trimmed.slice(2).trim()
                if (text.startsWith('"')) {
                  const parsed = JSON.parse(text)
                  fullContent += parsed
                  setStreamingContent(fullContent)
                }
              } catch {}
            }
          }
        }

        const novaMsg: Message = {
          id: crypto.randomUUID(),
          role: "nova",
          content: fullContent || "Signal lost. Retry.",
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, novaMsg])
        setStreamingContent("")

      } catch {
        const novaMsg: Message = {
          id: crypto.randomUUID(),
          role: "nova",
          content: "Connection dropped. I'm still here. What were you saying?",
          created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, novaMsg])
        setStreamingContent("")
      }
    } else {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400))
      
      const contextResponses = [
        `You said "${currentInput.slice(0, 30)}..." — I'm tracking that. What's the next move?`,
        `Noted. That connects to what you mentioned before. Keep going.`,
        `Direct. I like it. Now tell me what's actually in the way.`,
        `I've stored that insight. You're building patterns I can work with.`,
        `Good. You're not wasting time. What do you need from me right now?`,
      ]
      
      const novaMsg: Message = {
        id: crypto.randomUUID(),
        role: "nova",
        content: contextResponses[Math.floor(Math.random() * contextResponses.length)],
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, novaMsg])
    }

    setIsSending(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary rounded-full blur-[200px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-[180px]" 
        />
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 flex flex-col h-screen">
        <header className="flex-shrink-0 px-6 py-6 border-b border-border/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px oklch(0.72 0.19 160 / 0.4)",
                      "0 0 40px oklch(0.72 0.19 160 / 0.6)",
                      "0 0 20px oklch(0.72 0.19 160 / 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-light tracking-[0.2em] text-foreground">
                    <span className="font-extralight">NOVA</span>{" "}
                    <span className="font-medium text-primary">INTELLIGENCE</span>
                  </h1>
                  <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase mt-1">
                    v8.3 — Grok Core — {evolvingInsights.length} insights | {projects.length} projects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsGrokEnabled(!isGrokEnabled)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isGrokEnabled 
                      ? "bg-primary/20 border-primary/40 text-primary" 
                      : "bg-card/40 border-border/20 text-muted-foreground"
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isGrokEnabled ? "Grok Live" : "Demo Mode"}
                  </span>
                  {isGrokEnabled ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </motion.button>
                <span className="text-sm text-muted-foreground">{userName}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="p-2 rounded-xl bg-card/40 backdrop-blur-xl border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const count = tab.id === "progress" ? projects.filter(p => p.status === "active").length :
                              tab.id === "executed" ? projects.filter(p => p.status === "completed").length :
                              tab.id === "delivery" ? documents.length : 0
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "bg-card/30 backdrop-blur-xl border border-border/10 text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {count > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full p-6">
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card/60 backdrop-blur-xl border border-border/20 text-foreground rounded-bl-md"
                        }`}>
                          {message.role === "nova" && (
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              <span className="text-xs text-primary font-medium">Nova</span>
                              {isGrokEnabled && (
                                <span className="text-xs text-primary/60 ml-1">(Grok)</span>
                              )}
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {streamingContent && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 text-foreground rounded-bl-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs text-primary font-medium">Nova</span>
                            <span className="text-xs text-primary/60 ml-1">(Grok)</span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingContent}</p>
                        </div>
                      </motion.div>
                    )}
                    {isSending && !streamingContent && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-card/60 backdrop-blur-xl border border-border/20 p-4 rounded-2xl rounded-bl-md">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs text-primary font-medium">Processing...</span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex-shrink-0 pt-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                        placeholder="Say 'Launch! [project name]' to start a project..."
                        className="w-full px-6 py-4 pr-14 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isSending}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto scrollbar-hide"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">
                      Live Profile — Updated Every Message
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      I extract truths and insights from everything you say. This profile evolves in real-time.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20">
                      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        Core Truths ({coreTruths.length})
                      </h3>
                      <div className="space-y-3">
                        {coreTruths.map((truth, index) => {
                          const Icon = ICON_MAP[truth.icon] || Star
                          return (
                            <motion.div
                              key={truth.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-xl bg-background/30 border border-border/10"
                            >
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{truth.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{truth.detail}</p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20">
                      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        Extracted Insights
                        <span className="ml-auto text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                          {evolvingInsights.length} stored
                        </span>
                      </h3>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                        {evolvingInsights.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            Start talking. I extract insights automatically.
                          </p>
                        ) : (
                          evolvingInsights.map((insight, index) => (
                            <motion.div
                              key={insight.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 rounded-xl bg-background/30 border border-border/10"
                            >
                              <p className="text-sm text-foreground">{insight.insight}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(insight.created_at).toLocaleString()}
                              </p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "dreams" && (
                <motion.div
                  key="dreams"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto scrollbar-hide"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">Dreams</h2>
                    <p className="text-muted-foreground text-sm">Say &quot;Launch! [name]&quot; in chat to create a project.</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-20">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="p-6 rounded-full bg-primary/10 mb-6"
                    >
                      <Moon className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Talk to me about what you want to build</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      I convert conversation into action. No forms. Just talk.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab("chat")}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Go to Chat
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "progress" && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto scrollbar-hide"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">Active Projects</h2>
                    <p className="text-muted-foreground text-sm">Created via &quot;Launch!&quot; command in chat.</p>
                  </div>
                  
                  {projects.filter(p => p.status === "active").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="p-6 rounded-full bg-primary/10 mb-6"
                      >
                        <Rocket className="w-12 h-12 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-medium text-foreground mb-2">No active projects</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Type &quot;Launch! Roller Shoes&quot; in chat to start.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.filter(p => p.status === "active").map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                                <Rocket className="w-5 h-5 text-primary" />
                                {project.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Created {new Date(project.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setProjects(prev => prev.map(p => 
                                  p.id === project.id ? { ...p, status: "completed" } : p
                                ))
                              }}
                              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "executed" && (
                <motion.div
                  key="executed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto scrollbar-hide"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">Completed</h2>
                    <p className="text-muted-foreground text-sm">Projects marked as done.</p>
                  </div>
                  
                  {projects.filter(p => p.status === "completed").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="p-6 rounded-full bg-primary/10 mb-6"
                      >
                        <CheckCircle2 className="w-12 h-12 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-medium text-foreground mb-2">Nothing completed yet</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Mark projects as complete in the Progress tab.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {projects.filter(p => p.status === "completed").map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/20"
                        >
                          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            {project.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "delivery" && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full overflow-y-auto scrollbar-hide"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-light tracking-wide text-foreground mb-2">Stored Documents</h2>
                    <p className="text-muted-foreground text-sm">Say &quot;save document: [content]&quot; in chat to store.</p>
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="p-6 rounded-full bg-primary/10 mb-6"
                      >
                        <FileText className="w-12 h-12 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-medium text-foreground mb-2">No documents stored</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Say &quot;save document: your content here&quot; in chat.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {documents.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/20"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {doc.name}.{doc.type}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2 font-mono bg-background/30 p-2 rounded">
                                {doc.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(doc.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
cat > app/page.tsx << 'EOF'
