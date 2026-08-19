import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import { DEMO_USERS } from '../data/seed'
import { Card } from '../components/ui'

const PROMPTS = [
  'Summarize today\'s activity',
  'Generate a follow-up email',
  'Write a customer proposal',
  'List inactive customers',
  'Show the top-performing employee',
]

// Rule-based assistant grounded in live CRM data.
// Swap `respond()` for a real API call (e.g. your own backend proxying
// the Anthropic Messages API) to turn this into a live LLM assistant —
// see README.md for the wiring notes.
function respond(prompt, data) {
  const p = prompt.toLowerCase()
  const { customers, leads, tasks } = data

  if (p.includes('summar')) {
    const newLeads = leads.filter((l) => l.status === 'New').length
    const doneTasks = tasks.filter((t) => t.status === 'Completed').length
    return `Here's today's summary:\n• ${newLeads} new leads awaiting first contact\n• ${doneTasks} tasks completed, ${tasks.length - doneTasks} still pending\n• ${customers.filter((c) => c.status === 'Active').length} active customer accounts\n• Revenue tracked so far this month: ₹8,45,230`
  }
  if (p.includes('follow-up') || p.includes('follow up email')) {
    const lead = leads[0]
    return `Draft follow-up email:\n\nSubject: Following up — ${lead?.name || 'your enquiry'}\n\nHi ${lead?.name || 'there'},\n\nJust checking in after our last conversation. Happy to answer any questions or set up a quick call this week — let me know what works.\n\nBest,\nTrishul CRM Team`
  }
  if (p.includes('proposal')) {
    const customer = customers[0]
    return `Draft proposal outline for ${customer?.company || 'the customer'}:\n\n1. Overview of ${customer?.company || 'their'} current needs\n2. Proposed plan & key modules\n3. Implementation timeline (2–3 weeks)\n4. Pricing summary\n5. Next steps & sign-off\n\nWant me to expand any section?`
  }
  if (p.includes('inactive')) {
    const inactive = customers.filter((c) => c.status === 'Inactive')
    if (!inactive.length) return 'No inactive customers right now — everyone is Active or Prospect.'
    return `Inactive customers (${inactive.length}):\n${inactive.map((c) => `• ${c.name} — ${c.company}`).join('\n')}`
  }
  if (p.includes('top') && p.includes('employee')) {
    const won = leads.filter((l) => l.status === 'Won')
    const counts = {}
    won.forEach((l) => { counts[l.assignedTo] = (counts[l.assignedTo] || 0) + 1 })
    const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
    const top = DEMO_USERS.find((u) => u.id === topId)
    return top ? `Top performer this period: ${top.name} — ${counts[topId]} lead(s) won.` : 'Not enough closed leads yet to rank performance.'
  }
  return `Got it — I looked at your live CRM data (${customers.length} customers, ${leads.length} leads, ${tasks.length} tasks) but don't have a canned answer for that yet. Try one of the suggested prompts, or connect a live model via the API for open-ended questions.`
}

export default function AIAssistant() {
  const data = useData()
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi Admin — ask me to summarize activity, draft emails, or surface insights from your CRM data.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const send = (text) => {
    const prompt = (text ?? input).trim()
    if (!prompt) return
    setMessages((m) => [...m, { role: 'user', text: prompt }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: respond(prompt, data) }])
      setTyping(false)
    }, 650)
  }

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-6">
      <Card className="flex flex-col h-[70vh] p-0 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(242,169,59,0.14)' }}>
            <Bot size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <div className="font-display font-bold text-sm">Trishul Assistant</div>
            <div className="text-[11px] text-[var(--muted)]">Grounded in your live CRM data</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--ember)] text-[#1a0f00] font-medium'
                    : 'glass'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="glass inline-flex gap-1 rounded-xl px-3.5 py-2.5">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--muted)]" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--border-strong)]"
          />
          <button type="submit" className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-r from-[var(--gold)] to-[var(--ember)] flex items-center justify-center text-[#1a0f00]">
            <Send size={15} />
          </button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={14} style={{ color: 'var(--gold)' }} />
          <h3 className="font-display font-bold text-sm">Try asking</h3>
        </div>
        <div className="space-y-2">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
