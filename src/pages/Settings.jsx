import { useState } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Card, Field, inputCls, PrimaryButton, GhostButton } from '../components/ui'

export default function Settings() {
  const { user } = useAuth()
  const { resetDemoData } = useData()
  const { theme, setTheme } = useTheme()
  const [companyName, setCompanyName] = useState('Trishul CRM')
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="font-display font-bold mb-4">Company Settings</h3>
        <form onSubmit={save} className="space-y-4">
          <Field label="Company Name">
            <input className={inputCls} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
          <Field label="Theme">
            <select className={inputCls} value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark (Cinematic)</option>
              <option value="light">Light</option>
            </select>
          </Field>
          <PrimaryButton type="submit" className="flex items-center gap-1.5">
            {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
          </PrimaryButton>
        </form>
      </Card>

      <Card>
        <h3 className="font-display font-bold mb-4">Account</h3>
        <div className="space-y-4">
          <Field label="Name"><input className={inputCls} defaultValue={user.name} disabled /></Field>
          <Field label="Email"><input className={inputCls} defaultValue={user.email} disabled /></Field>
          <Field label="New Password"><input type="password" placeholder="••••••••" className={inputCls} /></Field>
          <PrimaryButton type="button">Change Password</PrimaryButton>
        </div>
      </Card>

      {user.role === 'Admin' && (
        <Card className="lg:col-span-2">
          <h3 className="font-display font-bold mb-2">Demo Data</h3>
          <p className="text-xs text-[var(--muted)] mb-4">All data in this demo is stored in your browser's local storage. Reset it back to the seeded sample dataset at any time.</p>
          <GhostButton onClick={resetDemoData} className="flex items-center gap-1.5">
            <RotateCcw size={14} /> Reset Demo Data
          </GhostButton>
        </Card>
      )}
    </div>
  )
}
