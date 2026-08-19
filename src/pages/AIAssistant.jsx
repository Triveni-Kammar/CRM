import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Copy, Check, Trash2, BarChart2, Users, Mail, HelpCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import { DEMO_USERS, MONTHLY_LEADS, CUSTOMER_GROWTH } from '../data/seed'
import { Card } from '../components/ui'

const PROMPT_GROUPS = [
  {
    label: 'Insights',
    icon: BarChart2,
    prompts: [
      "Summarize today's activity",
      'Show the top-performing employee',
      'List inactive customers',
      'Show all customers',
      'Show all leads',
      'Show pending tasks',
      'Show lead pipeline stats',
      'Show revenue trends',
      'Show overdue tasks',
    ],
  },
  {
    label: 'Drafts',
    icon: Mail,
    prompts: [
      'Generate a follow-up email',
      'Write a customer proposal',
      'Write a cold outreach email',
    ],
  },
  {
    label: 'Help',
    icon: HelpCircle,
    prompts: [
      'What can you help me with?',
      'How do I add a customer?',
      'How do I manage leads?',
      'CRM best practices',
    ],
  },
]

function respond(prompt, data) {
  const p = prompt.toLowerCase().trim()
  const { customers, leads, tasks } = data

  // GREETINGS
  if (/^(hi|hello|hey|namaste|good morning|good evening|howdy|greetings)/.test(p)) {
    return "Namaste! \uD83D\uDE4F I'm your **Trishul AI Assistant**. I can help you with:\n\n\u2022 CRM insights & summaries\n\u2022 Customer, lead & task data\n\u2022 Email drafts & proposals\n\u2022 Business tips & best practices\n\nWhat would you like to know?"
  }

  // HELP
  if (p.includes('help') || p.includes('what can you') || p.includes('capabilities')) {
    return "\uD83E\uDD16 Here's everything I can help you with:\n\n\uD83D\uDCCA **Insights** \u2014 activity summaries, pipeline stats, revenue trends\n\uD83D\uDC64 **Customers** \u2014 list all, active, inactive, prospects\n\uD83C\uDFAF **Leads** \u2014 new, contacted, won, lost, pipeline overview\n\u2705 **Tasks** \u2014 pending, completed, overdue, by priority\n\uD83D\uDC65 **Employees** \u2014 top performers, team overview\n\u2709\uFE0F **Drafts** \u2014 follow-up emails, proposals, cold outreach\n\uD83D\uDCA1 **Advice** \u2014 CRM tips & best practices\n\nJust ask naturally!"
  }

  // HOW TO
  if (p.includes('how do i add') && p.includes('customer')) {
    return "\uD83D\uDCCB **Adding a Customer**\n\n1. Click **Customers** in the sidebar\n2. Hit the **+ Add Customer** button\n3. Fill in name, company, phone, email, address\n4. Set the status (Active / Prospect / Inactive)\n5. Click **Save**\n\nThe customer appears in your list immediately!"
  }
  if (p.includes('how do i') && (p.includes('manage lead') || p.includes('add lead'))) {
    return "\uD83C\uDFAF **Managing Leads**\n\n1. Go to **Leads** in the sidebar\n2. Use **+ Add Lead** to create new leads\n3. Assign leads to team members\n4. Update status as leads progress:\n   New \u2192 Contacted \u2192 Interested \u2192 Won / Lost\n\n\uD83D\uDCA1 Keep statuses updated daily for accurate pipeline reports!"
  }
  if (p.includes('how do i') && p.includes('task')) {
    return "\u2705 **Managing Tasks**\n\n1. Go to **Tasks** in the sidebar\n2. Click **+ Add Task**\n3. Set due date, priority, and assignee\n4. Mark tasks **Completed** when done\n\nOverdue tasks are highlighted automatically!"
  }

  // SUMMARY / TODAY
  if (p.includes('summar') || p.includes('overview') || p.includes('today') || p.includes('activity')) {
    const newLeads = leads.filter(l => l.status === 'New').length
    const contactedLeads = leads.filter(l => l.status === 'Contacted').length
    const wonLeads = leads.filter(l => l.status === 'Won').length
    const doneTasks = tasks.filter(t => t.status === 'Completed').length
    const pendTasks = tasks.filter(t => t.status === 'Pending').length
    const activeCust = customers.filter(c => c.status === 'Active').length
    const health = doneTasks / Math.max(tasks.length, 1) > 0.5 ? '\uD83D\uDFE2 strong' : '\uD83D\uDFE1 moderate'
    return `\uD83D\uDCCA **Today's CRM Summary**

\uD83D\uDC65 Customers: ${customers.length} total \u2022 ${activeCust} active
\uD83C\uDFAF Leads: ${leads.length} total \u2022 ${newLeads} new \u2022 ${contactedLeads} contacted \u2022 ${wonLeads} won
\u2705 Tasks: ${doneTasks} completed \u2022 ${pendTasks} pending
\uD83D\uDCB0 Revenue tracked this month: \u20B98,45,230

Pipeline health: ${health}

\uD83D\uDCA1 Follow up on the ${newLeads} new lead(s) today!`
  }

  // ALL CUSTOMERS
  if (p.includes('all customer') || (p.includes('show') && p.includes('customer') && !p.includes('inactive') && !p.includes('prospect'))) {
    return `\uD83D\uDC65 **All Customers (${customers.length})**

${customers.map(c => `\u2022 **${c.name}** \u2014 ${c.company} | ${c.status} | ${c.address}`).join('\n')}

Use the Customers page to edit or add new customers.`
  }

  // ACTIVE CUSTOMERS
  if (p.includes('active customer')) {
    const active = customers.filter(c => c.status === 'Active')
    return `\uD83D\uDFE2 **Active Customers (${active.length})**

${active.map(c => `\u2022 **${c.name}** \u2014 ${c.company} | ${c.phone}`).join('\n')}

${customers.length - active.length > 0 ? `${customers.length - active.length} other(s) are inactive or prospects.` : 'All customers are active!'}`
  }

  // INACTIVE CUSTOMERS
  if (p.includes('inactive')) {
    const inactive = customers.filter(c => c.status === 'Inactive')
    if (!inactive.length) return '\u2705 No inactive customers \u2014 great retention!'
    return `\u26A0\uFE0F **Inactive Customers (${inactive.length})**

${inactive.map(c => `\u2022 **${c.name}** \u2014 ${c.company}\n  ${c.notes || 'No notes'}`).join('\n\n')}

\uD83D\uDCA1 Consider a re-engagement call or special offer!`
  }

  // PROSPECTS
  if (p.includes('prospect')) {
    const prospects = customers.filter(c => c.status === 'Prospect')
    if (!prospects.length) return 'No prospects currently. Add leads from your pipeline!'
    return `\uD83D\uDCCB **Prospects (${prospects.length})**

${prospects.map(c => `\u2022 **${c.name}** \u2014 ${c.company}\n  ${c.notes || 'No notes'}`).join('\n\n')}

\uD83D\uDCA1 Schedule demos to convert these into active customers!`
  }

  // ALL LEADS
  if (p.includes('all lead') || (p.includes('show') && p.includes('lead') && !p.includes('new') && !p.includes('won') && !p.includes('lost') && !p.includes('contact') && !p.includes('pipeline'))) {
    return `\uD83C\uDFAF **All Leads (${leads.length})**

${leads.map(l => `\u2022 **${l.name}** \u2014 ${l.status} | Source: ${l.source} | ${l.email}`).join('\n')}

Use the Leads page to update statuses.`
  }

  // NEW LEADS
  if (p.includes('new lead')) {
    const newL = leads.filter(l => l.status === 'New')
    if (!newL.length) return '\uD83D\uDFE2 No new uncontacted leads \u2014 all have been followed up!'
    return `\uD83D\uDFE1 **New Leads (${newL.length}) \u2014 Needs First Contact**

${newL.map(l => `\u2022 **${l.name}** | ${l.phone} | Source: ${l.source}`).join('\n')}

\uD83D\uDCA1 Contact within 24 hours for highest conversion rates!`
  }

  // WON LEADS
  if (p.includes('won lead') || p.includes('won deal') || p.includes('closed lead')) {
    const won = leads.filter(l => l.status === 'Won')
    if (!won.length) return 'No won leads yet. Keep pushing!'
    return `\uD83C\uDFC6 **Won Leads (${won.length})**

${won.map(l => `\u2022 **${l.name}** \u2014 ${l.email} | Source: ${l.source}`).join('\n')}

Excellent work! These have been converted.`
  }

  // LOST LEADS
  if (p.includes('lost lead') || p.includes('lost deal')) {
    const lost = leads.filter(l => l.status === 'Lost')
    if (!lost.length) return '\uD83D\uDFE2 No lost leads \u2014 fantastic!'
    return `\uD83D\uDD34 **Lost Leads (${lost.length})**

${lost.map(l => `\u2022 **${l.name}** \u2014 ${l.email} | Source: ${l.source}`).join('\n')}

\uD83D\uDCA1 Consider a win-back campaign or ask for feedback.`
  }

  // PIPELINE STATS
  if (p.includes('pipeline') || p.includes('lead stat') || p.includes('funnel')) {
    const statuses = ['New', 'Contacted', 'Interested', 'Won', 'Lost']
    const convRate = leads.length ? Math.round((leads.filter(l => l.status === 'Won').length / leads.length) * 100) : 0
    return `\uD83C\uDFAF **Lead Pipeline Stats**

${statuses.map(s => `\u2022 ${s}: ${leads.filter(l => l.status === s).length} lead(s)`).join('\n')}

\uD83D\uDCCA Total: ${leads.length} leads
\uD83D\uDCB0 Conversion Rate: ${convRate}%

${convRate >= 30 ? '\uD83D\uDFE2 Great conversion rate!' : convRate >= 15 ? '\uD83D\uDFE1 Decent \u2014 room to improve.' : '\uD83D\uDD34 Low \u2014 review your follow-up process.'}`
  }

  // ALL TASKS
  if (p.includes('all task') || (p.includes('show') && p.includes('task') && !p.includes('pending') && !p.includes('complet') && !p.includes('overdue') && !p.includes('high'))) {
    return `\u2705 **All Tasks (${tasks.length})**

${tasks.map(t => `\u2022 [${t.status}] **${t.title}** | Due: ${t.dueDate} | Priority: ${t.priority}`).join('\n')}

Use the Tasks page to update statuses.`
  }

  // PENDING TASKS
  if (p.includes('pending task') || (p.includes('pending') && p.includes('task'))) {
    const pend = tasks.filter(t => t.status === 'Pending')
    if (!pend.length) return '\uD83C\uDF89 All tasks are completed \u2014 incredible productivity!'
    return `\uD83D\uDD52 **Pending Tasks (${pend.length})**

${pend.map(t => `\u2022 **${t.title}**\n  Due: ${t.dueDate} | Priority: ${t.priority}`).join('\n\n')}

\uD83D\uDCA1 Start with High-priority ones first!`
  }

  // COMPLETED TASKS
  if (p.includes('complet') && p.includes('task')) {
    const done = tasks.filter(t => t.status === 'Completed')
    if (!done.length) return 'No completed tasks yet. Time to get started! \uD83D\uDCAA'
    return `\u2705 **Completed Tasks (${done.length})**

${done.map(t => `\u2022 **${t.title}** | Due was: ${t.dueDate}`).join('\n')}

Great work! Keep the momentum going.`
  }

  // HIGH PRIORITY
  if (p.includes('high priority') || (p.includes('urgent') && p.includes('task'))) {
    const high = tasks.filter(t => t.priority === 'High' && t.status === 'Pending')
    if (!high.length) return '\uD83D\uDFE2 No pending high-priority tasks \u2014 well managed!'
    return `\uD83D\uDD34 **High Priority Pending Tasks (${high.length})**

${high.map(t => `\u2022 **${t.title}** | Due: ${t.dueDate}`).join('\n')}

\u26A0\uFE0F These need immediate attention!`
  }

  // OVERDUE TASKS
  if (p.includes('overdue') || p.includes('late task') || p.includes('missed')) {
    const today = new Date().toISOString().split('T')[0]
    const overdue = tasks.filter(t => t.status === 'Pending' && t.dueDate < today)
    if (!overdue.length) return '\uD83D\uDFE2 No overdue tasks \u2014 you are on track!'
    return `\u26A0\uFE0F **Overdue Tasks (${overdue.length})**

${overdue.map(t => `\u2022 **${t.title}** \u2014 was due ${t.dueDate} | Priority: ${t.priority}`).join('\n')}

\uD83D\uDCA1 Address these urgently!`
  }

  // TOP EMPLOYEE
  if (p.includes('top') && (p.includes('employee') || p.includes('performer') || p.includes('staff'))) {
    const won = leads.filter(l => l.status === 'Won')
    const counts = {}
    won.forEach(l => { counts[l.assignedTo] = (counts[l.assignedTo] || 0) + 1 })
    const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
    const top = DEMO_USERS.find(u => u.id === topId)
    if (!top) return 'Not enough closed leads yet to rank performance.'
    return `\uD83C\uDFC6 **Top Performer**

\uD83D\uDC64 **${top.name}** (${top.role})
\uD83D\uDCE7 ${top.email}
\uD83C\uDFAF Won deals: **${counts[topId]}**

\uD83D\uDCA1 Recognise their effort in the next team sync!`
  }

  // ALL EMPLOYEES / TEAM
  if (p.includes('all employee') || (p.includes('team') && !p.includes('top'))) {
    return `\uD83D\uDC65 **Team Overview (${DEMO_USERS.length} members)**

${DEMO_USERS.map(u => `\u2022 **${u.name}** \u2014 ${u.role} | ${u.email}`).join('\n')}

Go to **Employees** in the sidebar for the full org chart.`
  }

  // REVENUE
  if (p.includes('revenue') || p.includes('earning') || p.includes('income') || p.includes('sales figure') || p.includes('revenue trend')) {
    return `\uD83D\uDCB0 **Revenue Overview**

\u2022 This month: \u20B98,45,230
\u2022 Last month: \u20B97,82,000
\u2022 Growth: +8% \uD83D\uDCC8

\uD83D\uDCCA **Customer Growth (recent)**
${CUSTOMER_GROWTH.slice(-4).map(r => `\u2022 ${r.month}: ${r.customers} customers`).join('\n')}

\uD83D\uDCA1 Focus on converting the ${leads.filter(l => l.status === 'Interested').length} interested lead(s) to boost revenue!`
  }

  // LEAD TRENDS
  if (p.includes('lead trend') || p.includes('monthly lead') || p.includes('lead growth')) {
    const last = MONTHLY_LEADS[MONTHLY_LEADS.length-1]
    const prev = MONTHLY_LEADS[MONTHLY_LEADS.length-2]
    return `\uD83D\uDCC8 **Monthly Lead Trends**

${MONTHLY_LEADS.slice(-6).map(r => `\u2022 ${r.month}: ${r.leads} leads`).join('\n')}

${last.leads > prev.leads ? '\uD83D\uDCC8 Growing trend \u2014 keep it up!' : '\uD83D\uDCC9 Dip detected \u2014 review your lead sources.'}`
  }

  // FOLLOW-UP EMAIL
  if (p.includes('follow-up') || p.includes('follow up') || (p.includes('email') && !p.includes('cold') && !p.includes('outreach'))) {
    const lead = leads.find(l => l.status === 'Contacted') || leads[0]
    return `\u2709\uFE0F **Draft Follow-up Email**

Subject: Following up on our recent conversation

Hi ${lead?.name || 'there'},

I hope you're doing well! I'm following up on our recent conversation about how Trishul CRM can help streamline your operations.

I'd love to:
\u2022 Answer any questions you might have
\u2022 Set up a quick 20-min demo at your convenience
\u2022 Share a tailored proposal based on your needs

Please let me know what works best for you.

Warm regards,
Trishul CRM Team`
  }

  // COLD OUTREACH
  if (p.includes('cold') || p.includes('outreach')) {
    return `\u2709\uFE0F **Cold Outreach Email Template**

Subject: A smarter way to manage your customer relationships

Hi [Name],

I came across [Company] and was impressed by your work in [industry]. Many businesses like yours struggle to track leads, customers, and follow-ups all in one place \u2014 that's exactly what Trishul CRM solves.

Our platform helps teams:
\u2713 Track every lead from first contact to close
\u2713 Never miss a follow-up
\u2713 Generate actionable insights in seconds

I'd love to show you a 15-min demo \u2014 would this week work?

Best regards,
[Your Name]`
  }

  // PROPOSAL
  if (p.includes('proposal') || p.includes('quote')) {
    const customer = customers[0]
    return `\uD83D\uDCCB **Customer Proposal Template**

**Proposal for: ${customer?.company || 'Client Company'}**
Prepared by: Trishul CRM Team

---

**1. Executive Summary**
Tailored CRM solution for ${customer?.company || 'your business'}.

**2. Challenges We Address**
\u2022 Disconnected customer data
\u2022 Manual follow-up tracking
\u2022 Limited pipeline visibility

**3. Proposed Solution**
\u2022 Full CRM: leads, customers, tasks
\u2022 Team collaboration tools
\u2022 Real-time AI insights

**4. Timeline**
Week 1: Setup & migration
Week 2: Training
Week 3: Go-live

**5. Next Steps**
Reply to schedule a 30-min alignment call.

Shall I expand any section?`
  }

  // TIPS / BEST PRACTICES
  if (p.includes('tip') || p.includes('best practice') || p.includes('advice') || p.includes('improve') || p.includes('crm best')) {
    return `\uD83D\uDCA1 **CRM Best Practices**

\uD83D\uDCDE **Lead Management**
\u2022 Contact new leads within 1 hour
\u2022 Update lead status after every interaction
\u2022 Set a follow-up task for every lead

\uD83D\uDC65 **Customer Retention**
\u2022 Check in with active customers monthly
\u2022 Re-engage inactive customers with offers
\u2022 Track notes for personalised outreach

\u2705 **Task Hygiene**
\u2022 Review pending tasks every morning
\u2022 High-priority first, always
\u2022 Close completed tasks immediately

\uD83D\uDCCA **Reporting**
\u2022 Review pipeline weekly
\u2022 Track monthly lead trends
\u2022 Celebrate won deals with your team!`
  }

  // ABOUT TRISHUL CRM
  if (p.includes('trishul') || p.includes('what is this') || p.includes('about crm')) {
    return `\uD83D\uDD31 **About Trishul CRM**

A powerful CRM platform built for modern sales teams.

**Modules:**
\u2022 \uD83D\uDC65 **Customers** \u2014 manage your full customer base
\u2022 \uD83C\uDFAF **Leads** \u2014 track from first contact to close
\u2022 \u2705 **Tasks** \u2014 assign & monitor team tasks
\u2022 \uD83D\uDC64 **Employees** \u2014 manage team hierarchy
\u2022 \uD83D\uDCCA **Reports** \u2014 visual analytics & trends
\u2022 \uD83E\uDD16 **AI Assistant** \u2014 that's me!

The name "Trishul" (the sacred trident \uD83D\uDD31) symbolises strength, precision, and power.`
  }

  // THANK YOU
  if (/^(thanks|thank you|thank|thx|great|awesome|perfect|nice|good job|well done)/.test(p)) {
    return "You're very welcome! \uD83D\uDE4F\n\nFeel free to ask me anything else about your CRM data, leads, customers, or tasks!"
  }

  // FALLBACK
  const suggestions = ["Summarize today's activity", 'Show all leads', 'Show pending tasks', 'List inactive customers', 'Generate a follow-up email']
  return `\uD83E\uDD14 I'm not sure about that specific query, but here's what I found:\n\n\u2022 ${customers.length} customers (${customers.filter(c => c.status === 'Active').length} active)\n\u2022 ${leads.length} leads (${leads.filter(l => l.status === 'New').length} new)\n\u2022 ${tasks.filter(t => t.status === 'Pending').length} pending tasks\n\n\uD83D\uDCA1 **Try asking:**\n${suggestions.map(s => `\u2022 "${s}"`).join('\n')}`
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function AIAssistant() {
  const data = useData()
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Namaste \uD83D\uDE4F \u2014 I'm your **Trishul AI Assistant**, grounded in your live CRM data.\n\nI can answer questions about customers, leads, tasks, employees, revenue, and more. Pick a suggestion or just ask naturally!",
    time: timeNow(),
  }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [copied, setCopied] = useState(null)
  const endRef = useRef(null)

  const scrollEnd = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _ = scrollEnd // keep dep-free

  const send = (text) => {
    const prompt = (text ?? input).trim()
    if (!prompt) return
    setMessages(m => [...m, { role: 'user', text: prompt, time: timeNow() }])
    setInput('')
    setTyping(true)
    scrollEnd()
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: respond(prompt, data), time: timeNow() }])
      setTyping(false)
      scrollEnd()
    }, 680)
  }

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx); setTimeout(() => setCopied(null), 1800)
    })
  }

  const clearChat = () => setMessages([{ role: 'ai', text: 'Chat cleared. How can I help you?', time: timeNow() }])

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6">

      {/* Chat panel */}
      <Card className="flex flex-col h-[76vh] p-0 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor:'var(--border)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ember-ring"
            style={{ background:'linear-gradient(135deg,rgba(242,169,59,0.22),rgba(255,122,26,0.18))', boxShadow:'0 0 12px rgba(242,169,59,0.25)' }}>
            <svg width="18" height="22" viewBox="0 0 100 320" style={{ filter:'drop-shadow(0 0 4px rgba(242,169,59,0.8))' }}>
              <defs>
                <linearGradient id="aiG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff4c0"/>
                  <stop offset="60%" stopColor="#f2a93b"/>
                  <stop offset="100%" stopColor="#d07010"/>
                </linearGradient>
              </defs>
              <line x1="50" y1="1" x2="50" y2="104" stroke="url(#aiG)" strokeWidth="5.8" strokeLinecap="round"/>
              <polygon points="50,0 46.5,8 53.5,8" fill="#fff8d8"/>
              <path d="M50 102 C50 88 44 73 34 59 C26 47 20 37 22 22 C24 11 31 5 33 4"
                stroke="url(#aiG)" strokeWidth="5.2" fill="none" strokeLinecap="round"/>
              <circle cx="31" cy="3" r="1.8" fill="#fff8d0"/>
              <path d="M50 102 C50 88 56 73 66 59 C74 47 80 37 78 22 C76 11 69 5 67 4"
                stroke="url(#aiG)" strokeWidth="5.2" fill="none" strokeLinecap="round"/>
              <circle cx="69" cy="3" r="1.8" fill="#fff8d0"/>
              <line x1="50" y1="104" x2="50" y2="290" stroke="url(#aiG)" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="50" cy="313" r="9.5" fill="#f2a93b"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-[15px] leading-tight">Trishul AI Assistant</div>
            <div className="text-[11px] flex items-center gap-1.5" style={{ color:'var(--muted)' }}>
              <span className="status-dot pulse-glow" style={{ background:'var(--emerald)' }} />
              Live CRM data &middot; smart responses
            </div>
          </div>
          <button onClick={clearChat} title="Clear chat"
            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,75,92,0.08)]"
            style={{ color:'var(--muted)' }}
            onMouseOver={e => e.currentTarget.style.color='var(--crimson)'}
            onMouseOut={e => e.currentTarget.style.color='var(--muted)'}>
            <Trash2 size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:10, scale:0.97 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ duration:0.25, ease:'easeOut' }}
                className={'flex gap-2.5 '+(m.role==='user'?'justify-end':'justify-start')}>

                {m.role === 'ai' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:'rgba(242,169,59,0.14)', boxShadow:'0 0 8px rgba(242,169,59,0.2)' }}>
                    <Bot size={13} style={{ color:'var(--gold)' }} />
                  </div>
                )}

                <div className={'flex flex-col gap-1 max-w-[85%] '+(m.role==='user'?'items-end':'items-start')}>
                  <div className={'relative group rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line '+(
                    m.role==='user' ? 'rounded-br-sm font-medium text-[#1a0f00]' : 'glass rounded-bl-sm'
                  )}
                  style={m.role==='user' ? { background:'linear-gradient(135deg,var(--gold),var(--ember))' } : {}}>
                    {m.text.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={pi}>{part.slice(2,-2)}</strong>
                        : part
                    )}
                    {m.role === 'ai' && (
                      <button onClick={() => copyText(m.text, i)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md glass"
                        style={{ color:'var(--muted)' }}
                        onMouseOver={e => e.currentTarget.style.color='var(--gold)'}
                        onMouseOut={e => e.currentTarget.style.color='var(--muted)'}>
                        {copied===i ? <Check size={11}/> : <Copy size={11}/>}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] px-1" style={{ color:'var(--muted-2)' }}>{m.time}</span>
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:'rgba(242,169,59,0.14)' }}>
                    <Users size={13} style={{ color:'var(--gold)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background:'rgba(242,169,59,0.14)' }}>
                  <Bot size={13} style={{ color:'var(--gold)' }} />
                </div>
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:'var(--gold)' }}
                      animate={{ opacity:[0.25,1,0.25], scale:[0.8,1.15,0.8] }}
                      transition={{ duration:0.85, repeat:Infinity, delay:i*0.18 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); send() }}
          className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor:'var(--border)' }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask anything — customers, leads, tasks, emails…"
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
            style={{ background:'var(--panel-solid)', border:'1px solid var(--border)' }}
            onFocus={e => e.target.style.borderColor='var(--border-strong)'}
            onBlur={e => e.target.style.borderColor='var(--border)'} />
          <motion.button type="submit" disabled={!input.trim()} whileTap={{ scale:0.9 }}
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-[#1a0f00] disabled:opacity-40 transition-opacity"
            style={{ background:'linear-gradient(135deg,var(--gold),var(--ember))' }}>
            <Send size={15}/>
          </motion.button>
        </form>
      </Card>

      {/* Sidebar */}
      <div className="space-y-3">
        {PROMPT_GROUPS.map(group => (
          <Card key={group.label} className="p-3.5">
            <div className="flex items-center gap-1.5 mb-2.5">
              <group.icon size={12} style={{ color:'var(--gold)' }} />
              <h3 className="font-display font-bold text-[11px] tracking-widest uppercase" style={{ color:'var(--muted)' }}>{group.label}</h3>
            </div>
            <div className="space-y-1">
              {group.prompts.map(pr => (
                <motion.button key={pr} onClick={() => send(pr)} whileHover={{ x:3 }}
                  className="w-full text-left text-[11px] px-3 py-2 rounded-xl border transition-colors"
                  style={{ borderColor:'var(--border)', color:'var(--muted)' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='var(--border-strong)'; e.currentTarget.style.color='var(--text)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)' }}>
                  {pr}
                </motion.button>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} style={{ color:'var(--gold)' }} />
            <h3 className="font-display font-bold text-[11px] tracking-widest uppercase" style={{ color:'var(--muted)' }}>Pro Tip</h3>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color:'var(--muted)' }}>
            Ask naturally: <em>"show lost leads"</em>, <em>"who is the top performer"</em>,
            <em>"write a cold email"</em> &mdash; I understand plain English!
          </p>
        </Card>
      </div>
    </div>
  )
}
