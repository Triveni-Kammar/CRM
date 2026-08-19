import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import { X } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { can } from '../utils/permissions'

export function Card({ children, className = '' }) {
  return <div className={`glass glass-hover rounded-2xl p-5 ${className}`}>{children}</div>
}

function Counter({ value }) {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-10px" })

  useEffect(() => {
    if (isInView) {
      if (typeof value === 'number') {
        motionValue.set(value)
      } else if (typeof value === 'string' && value.startsWith('₹')) {
        const num = parseInt(value.replace(/[^0-9]/g, ''), 10)
        motionValue.set(num)
      }
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        if (typeof value === 'string' && value.startsWith('₹')) {
          ref.current.textContent = `₹${Math.floor(latest).toLocaleString('en-IN')}`
        } else {
          ref.current.textContent = Math.floor(latest).toLocaleString()
        }
      }
    })
  }, [springValue, value])

  return <span ref={ref}>{typeof value === 'string' && !value.startsWith('₹') ? value : '0'}</span>
}

export function StatCard({ label, value, icon: Icon, accent = 'var(--gold)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-mono">{label}</div>
          <div className="font-display text-2xl font-bold mt-1.5">
            <Counter value={value} />
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
      </Card>
    </motion.div>
  )
}

const STATUS_COLORS = {
  Active: 'var(--emerald)', Prospect: 'var(--azure)', Inactive: 'var(--muted-2)',
  New: 'var(--azure)', Contacted: 'var(--gold)', Interested: 'var(--ember)', Won: 'var(--emerald)', Lost: 'var(--crimson)',
  Pending: 'var(--gold)', Completed: 'var(--emerald)',
  High: 'var(--crimson)', Medium: 'var(--gold)', Low: 'var(--emerald)',
}

export function Badge({ children }) {
  const color = STATUS_COLORS[children] || 'var(--muted)'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
    >
      <span className="status-dot" style={{ background: color }} />
      {children}
    </span>
  )
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg rounded-2xl p-6 max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)]">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-[var(--muted)] font-mono">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export const inputCls =
  'w-full bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--border-strong)]'

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`bg-gradient-to-r from-[var(--gold)] to-[var(--ember)] text-[#1a0f00] font-semibold rounded-lg px-4 py-2 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`border border-[var(--border)] hover:border-[var(--border-strong)] rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function ProtectedRoute({ permKey, children }) {
  const { user } = useAuth()
  if (!can(user.role, permKey)) return <Navigate to="/" replace />
  return children
}

export function EmptyState({ text }) {
  return (
    <div className="text-center py-14 text-[var(--muted)] text-sm">
      {text}
    </div>
  )
}
