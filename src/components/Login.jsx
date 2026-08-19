import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react'
import { DEMO_USERS } from '../data/seed'
import { useAuth } from '../context/AuthContext'

const ICONS = { Crown, ShieldCheck, User: UserIcon }

export default function Login() {
  const { login } = useAuth()
  const [selected, setSelected] = useState('u1')
  const [entering, setEntering] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEntering(true)
    setTimeout(() => login(selected), 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(242,169,59,0.10), transparent 65%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: entering ? 0 : 1, y: entering ? -16 : 0 }}
        transition={{ duration: 0.5 }}
        className="glass ember-ring relative w-full max-w-md rounded-2xl p-8"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl glass flex items-center justify-center mb-4 pulse-glow">
            <TridentMark />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            TRISHUL <span className="ember-text">CRM</span>
          </h1>
          <p className="text-[var(--muted)] text-sm mt-1">Smart Business Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono">Sign in as</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {DEMO_USERS.map((u) => {
                const Icon = ICONS[u.role === 'Admin' ? 'Crown' : u.role === 'Supervisor' ? 'ShieldCheck' : 'User']
                const active = selected === u.id
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => setSelected(u.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 border transition-all ${
                      active
                        ? 'border-[var(--gold)] bg-[rgba(242,169,59,0.08)]'
                        : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-[var(--gold)]' : 'text-[var(--muted)]'} />
                    <span className={`text-xs font-medium ${active ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>{u.role}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono">Email</label>
            <input
              readOnly
              value={DEMO_USERS.find((u) => u.id === selected)?.email}
              className="w-full mt-1.5 bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono">Password</label>
            <input
              type="password"
              defaultValue="demo1234"
              className="w-full mt-1.5 bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[var(--ember)] text-[#1a0f00] font-semibold rounded-lg py-2.5 text-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Enter Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--muted-2)] mt-6 font-mono">
          Demo build — role-based access preview, no live authentication.
        </p>
      </motion.div>
    </div>
  )
}

function TridentMark() {
  return (
    <svg width="24" height="30" viewBox="0 0 120 160">
      <path d="M60 20 L60 150" stroke="var(--gold)" strokeWidth="8" strokeLinecap="round" />
      <path d="M30 15 C30 45 45 55 60 60 C75 55 90 45 90 15" stroke="var(--gold)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M60 5 L60 60" stroke="var(--gold)" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}
