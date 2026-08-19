import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Clock } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { Card, Badge, Modal, Field, inputCls, PrimaryButton, GhostButton, EmptyState } from '../components/ui'

const STATUSES = ['Active', 'Prospect', 'Inactive']
const empty = { name: '', company: '', phone: '', email: '', address: '', status: 'Prospect', notes: '' }

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, restoreCustomer, activityForCustomer } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesQuery = `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [customers, query, statusFilter])

  const openNew = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (c) => { setEditing(c.id); setForm(c); setModal(true) }

  const submit = (e) => {
    e.preventDefault()
    if (editing) {
      updateCustomer(editing, form)
      toast.push(`Saved changes to ${form.name}.`)
    } else {
      addCustomer(form)
      toast.push(`Added ${form.name} as a new customer.`)
    }
    setModal(false)
  }

  const handleDelete = (c) => {
    deleteCustomer(c.id)
    toast.push(`Deleted ${c.name}.`, { onUndo: () => restoreCustomer(c) })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 bg-[var(--panel-solid)] border border-[var(--border)] rounded-lg px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-[var(--muted)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..." className="bg-transparent outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls + ' w-auto'}>
            <option>All</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <PrimaryButton onClick={openNew} className="flex items-center gap-1.5 whitespace-nowrap">
            <Plus size={15} /> Add Customer
          </PrimaryButton>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wider font-mono border-b border-[var(--border)]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3 hidden md:table-cell">Contact</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02] cursor-pointer" onClick={() => setDetail(c)}>
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-[var(--muted)]">{c.company}</td>
                  <td className="px-5 py-3.5 text-[var(--muted)] hidden md:table-cell">{c.email}</td>
                  <td className="px-5 py-3.5"><Badge>{c.status}</Badge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--gold)]"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--crimson)]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState text="No customers match your search." />}
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Company"><input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          </div>
          <Field label="Address"><input className={inputCls} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Notes"><textarea rows={2} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setModal(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit">{editing ? 'Save Changes' : 'Add Customer'}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || ''}>
        {detail && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--muted)]">{detail.company}</div>
              <Badge>{detail.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-[10px] uppercase text-[var(--muted-2)] font-mono">Phone</div>{detail.phone || '—'}</div>
              <div><div className="text-[10px] uppercase text-[var(--muted-2)] font-mono">Email</div>{detail.email || '—'}</div>
              <div className="col-span-2"><div className="text-[10px] uppercase text-[var(--muted-2)] font-mono">Address</div>{detail.address || '—'}</div>
              {detail.notes && <div className="col-span-2"><div className="text-[10px] uppercase text-[var(--muted-2)] font-mono">Notes</div>{detail.notes}</div>}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted-2)] font-mono mb-2">
                <Clock size={12} /> Activity Timeline
              </div>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {activityForCustomer(detail.id).length === 0 && (
                  <div className="text-xs text-[var(--muted)]">No activity recorded yet.</div>
                )}
                {activityForCustomer(detail.id).map((a) => (
                  <div key={a.id} className="flex gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mt-1 shrink-0" />
                    <div>
                      <div>{a.text}</div>
                      <div className="text-[var(--muted-2)] font-mono mt-0.5">{timeAgo(a.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
