import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Filter, CheckSquare, UserCog, BarChart3,
  Bot, Settings, LogOut, Crown, ShieldCheck, User as UserIcon, ChevronLeft, ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const RoleIcon = ROLE_ICON[user.role]

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />}
      <aside
        className={`glass fixed md:sticky top-0 h-screen shrink-0 z-40 flex flex-col border-r border-[var(--border)] transition-all duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center px-5 py-5 border-b border-[var(--border)] relative ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <svg width="20" height="26" viewBox="0 0 120 160" className="shrink-0">
            <path d="M60 20 L60 150" stroke="var(--gold)" strokeWidth="9" strokeLinecap="round" />
            <path d="M30 15 C30 45 45 55 60 60 C75 55 90 45 90 15" stroke="var(--gold)" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M60 5 L60 60" stroke="var(--gold)" strokeWidth="9" strokeLinecap="round" />
          </svg>
          {!isCollapsed && (
            <div className="font-display font-bold tracking-wide leading-none overflow-hidden whitespace-nowrap">
              TRISHUL <span className="ember-text">CRM</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--panel-solid)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors hidden md:flex"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.filter((n) => can(user.role, n.key)).map((n) => (
            <NavLink
              key={n.key}
              to={n.to}
              end={n.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-colors ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-[rgba(242,169,59,0.10)] text-[var(--gold)] border border-[var(--border-strong)]'
                    : 'text-[var(--muted)] border border-transparent hover:text-[var(--text)] hover:bg-white/[0.03]'
                }`
              }
              title={isCollapsed ? n.label : undefined}
            >
              <n.icon size={isCollapsed ? 20 : 17} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{n.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={`py-4 border-t border-[var(--border)] ${isCollapsed ? 'px-2 flex flex-col items-center' : 'px-3'}`}>
          <div className={`flex items-center gap-2.5 py-2 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(242,169,59,0.12)' }}>
              <RoleIcon size={15} style={{ color: 'var(--gold)' }} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-[11px] text-[var(--muted)] truncate">{user.role}</div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-2 flex items-center rounded-lg text-sm text-[var(--muted)] hover:text-[var(--crimson)] hover:bg-white/[0.03] transition-colors ${
              isCollapsed ? 'p-3 justify-center w-auto' : 'w-full gap-2 px-3 py-2'
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut size={isCollapsed ? 18 : 15} />
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}
