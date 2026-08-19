import { Users, Filter, UserCog, IndianRupee, CheckSquare } from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts'
import { useData } from '../context/DataContext'
import { Card, StatCard, Badge } from '../components/ui'

export default function Dashboard() {
  const { customers, leads, tasks, employees, monthlyLeads, customerGrowth } = useData()

  const pending = tasks.filter((t) => t.status === 'Pending').length
  const revenue = 845230

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Customers" value={customers.length} icon={Users} accent="var(--gold)" delay={0} />
        <StatCard label="Total Leads" value={leads.length} icon={Filter} accent="var(--azure)" delay={0.05} />
        <StatCard label="Active Employees" value={employees.length} icon={UserCog} accent="var(--emerald)" delay={0.1} />
        <StatCard label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} icon={IndianRupee} accent="var(--ember)" delay={0.15} />
        <StatCard label="Pending Tasks" value={pending} icon={CheckSquare} accent="var(--crimson)" delay={0.2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Monthly Leads</h3>
            <span className="text-xs text-[var(--muted)] font-mono">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyLeads}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1322', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="leads" stroke="var(--gold)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--gold)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Customer Growth</h3>
            <span className="text-xs text-[var(--muted)] font-mono">2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={customerGrowth}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0d1322', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="customers" fill="var(--azure)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold mb-4">Latest Customers</h3>
          <div className="space-y-3">
            {customers.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-[var(--muted)]">{c.company}</div>
                </div>
                <Badge>{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-bold mb-4">New Leads</h3>
          <div className="space-y-3">
            {leads.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-[var(--muted)]">{l.source}</div>
                </div>
                <Badge>{l.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
