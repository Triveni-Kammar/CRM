import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, Users, Filter, CheckSquare, UserCog, BarChart3, Bot, Settings, CornerDownLeft,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { can } from '../utils/permissions'

const PAGES = [
  { key: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { key: 'customers', label: 'Customers', to: '/customers', icon: Users },
  { key: 'leads', label: 'Leads', to: '/leads', icon: Filter },
  { key: 'tasks', label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { key: 'employees', label: 'Employees', to: '/employees', icon: UserCog },
  { key: 'reports', label: 'Reports', to: '/reports', icon: BarChart3 },
  { key: 'ai', label: 'AI Assistant', to: '/ai-assistant', icon: Bot },
  { key: 'settings', label: 'Settings', to: '/settings', icon: Settings },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { customers, leads, tasks } = useData()

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pages = PAGES.filter((p) => can(user.role, p.key)).filter((p) => !q || p.label.toLowerCase().includes(q))

    if (!q) return { pages, customers: [], leads: [], tasks: [] }

    return {
      pages,
      customers: can(user.role, 'customers')
        ? customers.filter((c) => `${c.name} ${c.company}`.toLowerCase().includes(q)).slice(0, 4)
        : [],
      leads: can(user.role, 'leads')
        ? leads.filter((l) => `${l.name} ${l.source}`.toLowerCase().includes(q)).slice(0, 4)
        : [],
      tasks: can(user.role, 'tasks')
        ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 4)
        : [],
    }
  }, [query, customers, leads, tasks, user])

  const go = (to) => { navigate(to); onClose() }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[12vh] px-4 bg-black/60"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)]">
              <Search size={16} className="text-[var(--muted)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a page, customer, lead, or task…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <kbd className="text-[10px] font-mono text-[var(--muted-2)] border border-[var(--border)] rounded px-1.5 py-0.5">esc</kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              <ResultGroup title="Pages">
                {results.pages.map((p) => (
                  <ResultRow key={p.to} icon={p.icon} label={p.label} onClick={() => go(p.to)} />
                ))}
              </ResultGroup>

              {results.customers.length > 0 && (
                <ResultGroup title="Customers">
                  {results.customers.map((c) => (
                    <ResultRow key={c.id} icon={Users} label={c.name} sub={c.company} onClick={() => go('/customers')} />
                  ))}
                </ResultGroup>
              )}
              {results.leads.length > 0 && (
                <ResultGroup title="Leads">
                  {results.leads.map((l) => (
                    <ResultRow key={l.id} icon={Filter} label={l.name} sub={l.status} onClick={() => go('/leads')} />
                  ))}
                </ResultGroup>
              )}
              {results.tasks.length > 0 && (
                <ResultGroup title="Tasks">
                  {results.tasks.map((t) => (
                    <ResultRow key={t.id} icon={CheckSquare} label={t.title} sub={t.priority} onClick={() => go('/tasks')} />
                  ))}
                </ResultGroup>
              )}

              {query &&
                results.pages.length === 0 &&
                !results.customers.length &&
                !results.leads.length &&
                !results.tasks.length && (
                  <div className="text-center text-xs text-[var(--muted)] py-8">No matches for "{query}"</div>
                )}
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-[var(--border)] text-[10px] text-[var(--muted-2)] font-mono">
              <CornerDownLeft size={11} /> select · <kbd className="border border-[var(--border)] rounded px-1">Ctrl</kbd>+<kbd className="border border-[var(--border)] rounded px-1">K</kbd> to reopen anywhere
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResultGroup({ title, children }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null
  return (
    <div className="mb-1.5">
      <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-[var(--muted-2)] font-mono">{title}</div>
      {children}
    </div>
  )
}

function ResultRow({ icon: Icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/[0.04] transition-colors text-left"
    >
      <Icon size={15} className="text-[var(--muted)] shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {sub && <span className="text-xs text-[var(--muted-2)] shrink-0">{sub}</span>}
    </button>
  )
}
