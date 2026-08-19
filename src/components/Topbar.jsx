import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Sun, Moon, Settings, LogOut, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Topbar({ title, onMenu, onSearch }) {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setShowProfile(false)
    logout()
  }

  const handleSettings = () => {
    setShowProfile(false)
    navigate('/settings')
  }

  const roleColor = {
    Admin: 'var(--gold)',
    Supervisor: 'var(--ember)',
    User: 'var(--emerald)',
  }[user?.role] || 'var(--gold)'

  return (
    <header className="sticky top-0 z-20 glass border-b border-[var(--border)] px-4 md:px-8 py-4 flex items-center justify-between backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="md:hidden text-[var(--muted)]">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold tracking-wide">{title}</h1>
        </div>
      </div>

      <button
        onClick={onSearch}
        className="hidden md:flex items-center gap-2 bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2 w-72 text-left hover:border-[var(--border-strong)] transition-colors"
      >
        <Search size={15} className="text-[var(--muted)]" />
        <span className="text-sm text-[var(--muted-2)] flex-1">Search here...</span>
        <kbd className="text-[10px] font-mono text-[var(--muted-2)] border border-[var(--border)] rounded px-1.5 py-0.5">Ctrl K</kbd>
      </button>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif((s) => !s); setShowProfile(false) }}
            className="relative w-9 h-9 rounded-lg glass flex items-center justify-center text-[var(--muted)] hover:text-[var(--gold)] transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--ember)]" />
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-64 glass rounded-xl p-3 text-sm shadow-xl"
                style={{ border: '1px solid var(--border-strong)' }}
              >
                <div className="font-display font-bold mb-2 text-sm">Notifications</div>
                <div className="space-y-2 text-[var(--muted)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ember)] shrink-0" />
                    3 tasks due today
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--azure)] shrink-0" />
                    2 new leads assigned to you
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald)] shrink-0" />
                    Weekly report is ready
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile button + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile((s) => !s); setShowNotif(false) }}
            className="flex items-center gap-1.5 rounded-full transition-all hover:ring-2 hover:ring-[var(--gold)] hover:ring-offset-2 hover:ring-offset-[var(--bg)]"
            title="Profile"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--ember)] flex items-center justify-center text-xs font-bold text-[#1a0f00] select-none"
              style={{ boxShadow: '0 0 10px rgba(242,169,59,0.4)' }}>
              {user?.name?.slice(0, 1) ?? 'A'}
            </div>
            <ChevronDown size={13} className="text-[var(--muted)]"
              style={{ transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-3 w-60 glass rounded-2xl shadow-2xl overflow-hidden"
                style={{ border: '1px solid var(--border-strong)' }}
              >
                {/* User info header */}
                <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--ember)] flex items-center justify-center text-base font-bold text-[#1a0f00] shrink-0"
                      style={{ boxShadow: '0 0 14px rgba(242,169,59,0.45)' }}>
                      {user?.name?.slice(0, 1) ?? 'A'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm truncate">{user?.name}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--muted)' }}>{user?.email}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${roleColor}20`, color: roleColor, border: `1px solid ${roleColor}44` }}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--muted)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(242,169,59,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    <Settings size={15} />
                    Settings
                  </button>

                  <button
                    onClick={() => { setShowProfile(false); navigate('/') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--muted)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(242,169,59,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    <User size={15} />
                    Dashboard
                  </button>

                  <div className="my-1.5 mx-4 h-px" style={{ background: 'var(--border)' }} />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--crimson)' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,75,92,0.08)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
