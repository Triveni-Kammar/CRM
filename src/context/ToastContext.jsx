import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, Undo2, X } from 'lucide-react'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback((message, opts = {}) => {
    const id = ++idCounter
    setToasts((t) => [...t, { id, message, ...opts }])
    setTimeout(() => dismiss(id), opts.duration || 4200)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-72">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className="glass rounded-xl px-3.5 py-3 flex items-start gap-2.5 shadow-xl"
            >
              {t.tone === 'info' ? (
                <Info size={16} className="text-[var(--azure)] mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={16} className="text-[var(--emerald)] mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0 text-xs leading-snug">{t.message}</div>
              {t.onUndo && (
                <button
                  onClick={() => { t.onUndo(); dismiss(t.id) }}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--gold)] hover:underline shrink-0 mt-0.5"
                >
                  <Undo2 size={11} /> Undo
                </button>
              )}
              <button onClick={() => dismiss(t.id)} className="text-[var(--muted)] hover:text-[var(--text)] shrink-0">
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
