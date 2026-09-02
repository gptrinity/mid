import { useState, useRef, useEffect } from 'react'
import { Send, Brain, Loader2, Bot, User } from 'lucide-react'
import { askAITutor } from '../lib/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const suggestedPrompts = [
  'Explain APGAR scoring',
  'What is a partograph?',
  'Stages of normal labour',
  'Management of PPH',
  'Eclampsia nursing care',
]

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your MidWise AI Tutor. Ask me anything about midwifery — anatomy, labour, pharmacology, public health, or any other topic. I\'m here to help you study!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    const response = await askAITutor([...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })), { role: 'user', content: msg }])
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex items-center gap-3 mb-4 animate-fade-in">
        <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-glow-purple">
          <Brain className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">AI Tutor</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft" />
            <p className="text-xs text-gray-500 font-medium">Always available</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-card border border-gray-100 p-4 mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? '' : 'flex items-start gap-2.5'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 gradient-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
                  <Bot className="text-white" size={12} />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-md shadow-soft'
                  : 'bg-gray-50 text-gray-800 rounded-bl-md border border-gray-100'
              }`}>
                {msg.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="text-emerald-600" size={12} />
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-slide-up">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 gradient-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
                <Bot className="text-white" size={12} />
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-100">
                <Loader2 className="animate-spin text-gray-400" size={16} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2 animate-fade-in">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about midwifery..."
          className="input-modern flex-1"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 disabled:opacity-50 flex items-center justify-center"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  )
}
