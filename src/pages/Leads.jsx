import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, UserPlus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { DEMO_USERS } from '../data/seed'
import { Card, Badge, Modal, Field, inputCls, PrimaryButton, GhostButton } from '../components/ui'

const STATUSES = ['New', 'Contacted', 'Interested', 'Won', 'Lost']
const SOURCES = ['Website', 'Referral', 'Advertisement', 'Cold Call']
const empty = { name: '', phone: '', email: '', source: 'Website', assignedTo: 'u2', status: 'New' }

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead, restoreLead, convertLeadToCustomer } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const visible = useMemo(() => {
    if (user.role === 'User') return leads.filter((l) => l.assignedTo === user.id)
    return leads
  }, [leads, user])

  const grouped = useMemo(() => {
    const g = {}
    STATUSES.forEach((s) => (g[s] = visible.filter((l) => l.status === s)))
    return g
  }, [visible])

  const openNew = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (l) => { setEditing(l.id); setForm(l); setModal(true) }

  const submit = (e) => {
    e.preventDefault()
    if (editing) {
      updateLead(editing, form)
      toast.push(`Saved changes to ${form.name}.`)
    } else {
      addLead(form)
      toast.push(`Added lead ${form.name}.`)
    }
    setModal(false)
  }

  const handleDelete = (l) => {
    deleteLead(l.id)
    toast.push(`Deleted lead ${l.name}.`, { onUndo: () => restoreLead(l) })
  }

  const handleConvert = (l) => {
    convertLeadToCustomer(l)
    toast.push(`${l.name} converted to a customer.`, { tone: 'info' })
  }

  const nameOf = (id) => DEMO_USERS.find((u) => u.id === id)?.name || '—'

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <PrimaryButton onClick={openNew} className="flex items-center gap-1.5"><Plus size={15} /> Add Lead</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {STATUSES.map((status) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">{status}</span>
              <span className="text-xs text-[var(--muted-2)]">{grouped[status].length}</span>
            </div>
            <div className="space-y-3 min-h-[60px]">
              {grouped[status].map((l) => (
                <Card key={l.id} className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{l.name}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5 truncate">{l.email}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(l)} className="text-[var(--muted)] hover:text-[var(--gold)]"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(l)} className="text-[var(--muted)] hover:text-[var(--crimson)]"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] font-mono text-[var(--muted-2)]">{l.source}</span>
                    <span className="text-[10px] text-[var(--muted)]">{nameOf(l.assignedTo)}</span>
                  </div>
                  {status === 'Won' && !l.convertedCustomerId && (
                    <button
                      onClick={() => handleConvert(l)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold rounded-lg py-1.5 bg-gradient-to-r from-[var(--gold)] to-[var(--ember)] text-[#1a0f00]"
                    >
                      <UserPlus size={12} /> Convert to Customer
                    </button>
                  )}
                  {status === 'Won' && l.convertedCustomerId && (
                    <div className="mt-3 text-[10px] text-[var(--emerald)] text-center font-mono">✓ Converted to customer</div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Lead' : 'Add Lead'}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source">
              <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Assigned User">
              <select className={inputCls} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                {DEMO_USERS.filter((u) => u.role !== 'Admin').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setModal(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit">{editing ? 'Save Changes' : 'Add Lead'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
