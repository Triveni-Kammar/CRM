import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Filter, CheckSquare, UserCog, BarChart3,
  Bot, Settings, LogOut, Crown, ShieldCheck, User as UserIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { can } from '../utils/permissions'

const NAV = [
  { key: 'dashboard', to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'customers', to: '/customers', label: 'Customers', icon: Users },
  { key: 'leads', to: '/leads', label: 'Leads', icon: Filter },
  { key: 'tasks', to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'employees', to: '/employees', label: 'Employees', icon: UserCog },
  { key: 'reports', to: '/reports', label: 'Reports', icon: BarChart3 },
  { key: 'ai', to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { key: 'settings', to: '/settings', label: 'Settings', icon: Settings },
]

const ROLE_ICON = { Admin: Crown, Supervisor: ShieldCheck, User: UserIcon }

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const RoleIcon = ROLE_ICON[user.role]

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />}
      <aside
        className={`glass fixed md:sticky top-0 h-screen w-64 shrink-0 z-40 flex flex-col border-r border-[var(--border)] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border)]">
          <svg width="20" height="26" viewBox="0 0 120 160" className="shrink-0">
            <path d="M60 20 L60 150" stroke="var(--gold)" strokeWidth="9" strokeLinecap="round" />
            <path d="M30 15 C30 45 45 55 60 60 C75 55 90 45 90 15" stroke="var(--gold)" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M60 5 L60 60" stroke="var(--gold)" strokeWidth="9" strokeLinecap="round" />
          </svg>
          <div className="font-display font-bold tracking-wide leading-none">
            TRISHUL <span className="ember-text">CRM</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.filter((n) => can(user.role, n.key)).map((n) => (
            <NavLink
              key={n.key}
              to={n.to}
              end={n.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[rgba(242,169,59,0.10)] text-[var(--gold)] border border-[var(--border-strong)]'
                    : 'text-[var(--muted)] border border-transparent hover:text-[var(--text)] hover:bg-white/[0.03]'
                }`
              }
            >
              <n.icon size={17} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(242,169,59,0.12)' }}>
              <RoleIcon size={15} style={{ color: 'var(--gold)' }} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] text-[var(--muted)]">{user.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--crimson)] hover:bg-white/[0.03] transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
