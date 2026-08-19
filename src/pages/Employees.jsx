import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { ROLES } from '../data/seed'
import { Card, Badge, Modal, Field, inputCls, PrimaryButton, GhostButton, EmptyState } from '../components/ui'

const empty = { name: '', email: '', role: ROLES.USER, supervisorId: '' }

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, restoreEmployee } = useData()
  const toast = useToast()
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const supervisors = employees.filter((e) => e.role === ROLES.SUPERVISOR)

  const openNew = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (e) => { setEditing(e.id); setForm(e); setModal(true) }

  const submit = (e) => {
    e.preventDefault()
    if (editing) {
      updateEmployee(editing, form)
      toast.push(`Saved changes to ${form.name}.`)
    } else {
      addEmployee(form)
      toast.push(`Added ${form.name} as ${form.role}.`)
    }
    setModal(false)
  }

  const handleDelete = (emp) => {
    deleteEmployee(emp.id)
    toast.push(`Removed ${emp.name}.`, { onUndo: () => restoreEmployee(emp) })
  }

  const supervisorName = (id) => employees.find((e) => e.id === id)?.name || '—'

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <PrimaryButton onClick={openNew} className="flex items-center gap-1.5"><Plus size={15} /> Add Employee</PrimaryButton>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] text-xs uppercase tracking-wider font-mono border-b border-[var(--border)]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3 hidden sm:table-cell">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 hidden sm:table-cell">Supervisor</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-medium">{e.name}</td>
                  <td className="px-5 py-3.5 text-[var(--muted)] hidden sm:table-cell">{e.email}</td>
                  <td className="px-5 py-3.5"><Badge>{e.role}</Badge></td>
                  <td className="px-5 py-3.5 text-[var(--muted)] hidden sm:table-cell">{e.supervisorId ? supervisorName(e.supervisorId) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--gold)]"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(e)} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--crimson)]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <EmptyState text="No employees yet." />}
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name"><input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role">
            <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value={ROLES.SUPERVISOR}>Supervisor</option>
              <option value={ROLES.USER}>User</option>
            </select>
          </Field>
          {form.role === ROLES.USER && (
            <Field label="Assign Supervisor">
              <select className={inputCls} value={form.supervisorId || ''} onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}>
                <option value="">None</option>
                {supervisors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <GhostButton type="button" onClick={() => setModal(false)}>Cancel</GhostButton>
            <PrimaryButton type="submit">{editing ? 'Save Changes' : 'Add Employee'}</PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
