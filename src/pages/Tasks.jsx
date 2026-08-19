import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { DEMO_USERS } from '../data/seed'
import { Card, Badge, Modal, Field, inputCls, PrimaryButton, GhostButton, EmptyState } from '../components/ui'

const PRIORITIES = ['High', 'Medium', 'Low']
const empty = { title: '', assignedTo: 'u2', dueDate: '', priority: 'Medium', status: 'Pending' }

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, restoreTask } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const visible = useMemo(() => {
    if (user.role === 'User') return tasks.filter((t) => t.assignedTo === user.id)
    return tasks
  }, [tasks, user])

  const openNew = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (t) => { setEditing(t.id); setForm(t); setModal(true) }
  const toggle = (t) => updateTask(t.id, { status: t.status === 'Completed' ? 'Pending' : 'Completed' })

  const submit = (e) => {
    e.preventDefault()
    if (editing) {
      updateTask(editing, form)
      toast.push(`Saved changes to "${form.title}".`)
    } else {
      addTask(form)
      toast.push(`Created task "${form.title}".`)
    }
    setModal(false)
  }

  const handleDelete = (t) => {
    deleteTask(t.id)
    toast.push(`Deleted "${t.title}".`, { onUndo: () => restoreTask(t) })
  }

  const nameOf = (id) => DEMO_USERS.find((u) => u.id === id)?.name || '—'

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <PrimaryButton onClick={openNew} className="flex items-center gap-1.5"><Plus size={15} /> Create Task</PrimaryButton>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wider font-mono border-b border-[var(--border)]">
                <th className="px-5 py-3 w-8"></th>
                <th className="px-5 py-3">Task</th>
                <th className="px-5 py-3 hidden sm:table-cell">Assigned</th>
                <th className="px-5 py-3 hidden sm:table-cell">Due</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggle(t)}>
                      {t.status === 'Completed'
                        ? <CheckCircle2 size={17} className="text-[var(--emerald)]" />
                        : <Circle size={17} className="text-[var(--muted-2)]" />}
                    </button>
                  </td>
                  <td className={`px-5 py-3.5 font-medium ${t.status === 'Completed' ? 'line-through text-[var(--muted)]' : ''}`}>{t.title}</td>
                  <td className="px-5 py-3.5 text-[var(--muted)] hidden sm:table-cell">{nameOf(t.assignedTo)}</td>
                  <td className="px-5 py-3.5 text-[var(--muted)] hidden sm:table-cell font-mono text-xs">{t.dueDate}</td>
                  <td className="px-5 py-3.5"><Badge>{t.priority}</Badge></td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--gold)]"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--crimson)]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <EmptyState text="No tasks assigned yet." />}
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Title"><input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assigned User">
              <select className={inputCls} value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                {DEMO_USERS.filter((u) => u.role !== 'Admin').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </Field>
            <Field label="Due Date"><input type="date" className={inputCls} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></Field>
          </div>
          <Field label="Priority">
            <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setModal(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit">{editing ? 'Save Changes' : 'Create Task'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
