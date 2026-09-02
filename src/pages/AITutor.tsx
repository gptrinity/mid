import { useState } from 'react'
import { Send, Brain, Loader2 } from 'lucide-react'
import { askAITutor } from '../lib/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your MidWise AI Tutor. Ask me anything about midwifery — anatomy, labour, pharmacology, public health, or any other topic. I\'m here to help you study!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    const response = await askAITutor([...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })), { role: 'user', content: text }])
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg"><Brain className="text-purple-600" size={24} /></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Tutor</h1>
          <p className="text-sm text-gray-500">Ask anything about midwifery</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border p-4 mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              {msg.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
              <Loader2 className="animate-spin text-gray-400" size={18} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
